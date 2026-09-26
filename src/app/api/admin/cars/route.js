import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Car from "@/models/Car";

export const dynamic = "force-dynamic";

/* ============================================================
   GET — PUBLIC CAR INVENTORY
============================================================ */

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    /* ======================================================
        PAGINATION
    ====================================================== */

    const rawPage = searchParams.get("page");
    const rawLimit = searchParams.get("limit");

    const pageNumber = Number(rawPage);
    const limitNumber = Number(rawLimit);

    const page =
      Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;

    /*
     * The frontend uses 6.
     * Keep a hard API maximum so clients cannot request
     * an unreasonable number of documents.
     */
    const requestedLimit =
      Number.isInteger(limitNumber) && limitNumber > 0 ? limitNumber : 6;

    const limit = Math.min(requestedLimit, 50);

    const skip = (page - 1) * limit;

    /* ======================================================
        FILTER VALUES
    ====================================================== */

    const search = searchParams.get("search")?.trim() || "";

    const statusParam = searchParams.get("status")?.trim() || "";

    const condition = searchParams.get("condition")?.trim() || "";

    const make = searchParams.get("make")?.trim() || "";

    const bodyType = searchParams.get("bodyType")?.trim() || "";

    const fuelType = searchParams.get("fuelType")?.trim() || "";

    const transmission = searchParams.get("transmission")?.trim() || "";

    const sort = searchParams.get("sort")?.trim() || "newest";

    /* ======================================================
        OPTIONAL NUMBER FILTERS
    ====================================================== */

    const minPrice = parseOptionalNumber(searchParams.get("minPrice"));

    const maxPrice = parseOptionalNumber(searchParams.get("maxPrice"));

    const minYear = parseOptionalNumber(searchParams.get("minYear"));

    const maxYear = parseOptionalNumber(searchParams.get("maxYear"));

    /* ======================================================
        VALIDATE NUMBER FILTERS
    ====================================================== */

    if (searchParams.has("minPrice") && minPrice === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid minimum price",
        },
        { status: 400 },
      );
    }

    if (searchParams.has("maxPrice") && maxPrice === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid maximum price",
        },
        { status: 400 },
      );
    }

    if (searchParams.has("minYear") && minYear === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid minimum year",
        },
        { status: 400 },
      );
    }

    if (searchParams.has("maxYear") && maxYear === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid maximum year",
        },
        { status: 400 },
      );
    }

    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      return NextResponse.json(
        {
          success: false,
          message: "Minimum price cannot be greater than maximum price",
        },
        { status: 400 },
      );
    }

    if (minYear !== null && maxYear !== null && minYear > maxYear) {
      return NextResponse.json(
        {
          success: false,
          message: "Minimum year cannot be greater than maximum year",
        },
        { status: 400 },
      );
    }

    /* ======================================================
        MONGO FILTER
    ====================================================== */

    const filter = {};

    /* ------------------------------------------------------
       STATUS

       No status supplied:
       → public inventory shows Available cars

       status=Available:
       → only Available cars

       status=all:
       → do not filter by status
    ------------------------------------------------------ */

    const normalizedStatus = statusParam.toLowerCase();

    if (!statusParam || normalizedStatus === "available") {
      filter.status = "Available";
    } else if (normalizedStatus !== "all") {
      filter.status = statusParam;
    }

    /* ======================================================
        EXACT FILTERS
    ====================================================== */

    if (condition) {
      filter.condition = condition;
    }

    if (make) {
      filter.make = make;
    }

    if (bodyType) {
      filter.bodyType = bodyType;
    }

    if (fuelType) {
      filter.fuelType = fuelType;
    }

    if (transmission) {
      filter.transmission = transmission;
    }

    /* ======================================================
        SEARCH
    ====================================================== */

    if (search) {
      const escapedSearch = escapeRegex(search);

      filter.$or = [
        {
          make: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          model: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          stockNumber: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    /* ======================================================
        PRICE FILTER
    ====================================================== */

    if (minPrice !== null || maxPrice !== null) {
      filter.price = {};

      if (minPrice !== null) {
        filter.price.$gte = minPrice;
      }

      if (maxPrice !== null) {
        filter.price.$lte = maxPrice;
      }
    }

    /* ======================================================
        YEAR FILTER
    ====================================================== */

    if (minYear !== null || maxYear !== null) {
      filter.year = {};

      if (minYear !== null) {
        filter.year.$gte = minYear;
      }

      if (maxYear !== null) {
        filter.year.$lte = maxYear;
      }
    }

    /* ======================================================
        SORT
    ====================================================== */

    /*
     * _id is included as a deterministic tie-breaker.
     *
     * This is important for pagination because multiple
     * cars can have the same price/year/createdAt.
     */

    const sortOptions = {
      newest: {
        createdAt: -1,
        _id: -1,
      },

      oldest: {
        createdAt: 1,
        _id: 1,
      },

      "price-low": {
        price: 1,
        createdAt: -1,
        _id: -1,
      },

      "price-high": {
        price: -1,
        createdAt: -1,
        _id: -1,
      },

      "year-new": {
        year: -1,
        createdAt: -1,
        _id: -1,
      },

      "year-old": {
        year: 1,
        createdAt: -1,
        _id: 1,
      },

      "mileage-low": {
        mileage: 1,
        createdAt: -1,
        _id: -1,
      },
    };

    const sortQuery = sortOptions[sort] || sortOptions.newest;

    /* ======================================================
        DATABASE QUERIES
    ====================================================== */

    const [cars, total] = await Promise.all([
      Car.find(filter)
        .select(
          [
            "stockNumber",
            "make",
            "model",
            "year",
            "price",
            "currency",
            "mileage",
            "mileageUnit",
            "transmission",
            "fuelType",
            "bodyType",
            "condition",
            "exteriorColor",
            "interiorColor",
            "engine",
            "images",
            "status",
            "isFeatured",
            "createdAt",
            "updatedAt",
          ].join(" "),
        )
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),

      Car.countDocuments(filter),
    ]);

    /* ======================================================
        PAGINATION
    ====================================================== */

    const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

    const hasNextPage = page < totalPages;

    const hasPreviousPage = page > 1;

    /* ======================================================
        SERVER LOG
    ====================================================== */

    console.log("Cars GET:", {
      page,
      limit,
      skip,
      returnedCars: cars.length,
      total,
      totalPages,
      hasNextPage,
      filters: {
        search,
        status: filter.status || "ALL",
        make,
        bodyType,
        fuelType,
        transmission,
        condition,
        minPrice,
        maxPrice,
        minYear,
        maxYear,
        sort,
      },
    });

    /* ======================================================
        RESPONSE
    ====================================================== */

    return NextResponse.json(
      {
        success: true,

        data: {
          cars,

          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage,
            hasPreviousPage,
          },
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Cars GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load cars",
      },
      {
        status: 500,
      },
    );
  }
}

/* ============================================================
   POST — CREATE CAR
============================================================ */

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    /* ======================================================
        BASIC TEXT
    ====================================================== */

    const make = body.make?.trim();

    const model = body.model?.trim();

    if (!make) {
      return NextResponse.json(
        {
          success: false,
          message: "Make is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!model) {
      return NextResponse.json(
        {
          success: false,
          message: "Model is required",
        },
        {
          status: 400,
        },
      );
    }

    /* ======================================================
        NUMBERS
    ====================================================== */

    const year = Number(body.year);

    const price = Number(body.price);

    const mileage = Number(body.mileage || 0);

    if (!Number.isInteger(year)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid year is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid price is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!Number.isFinite(mileage) || mileage < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid mileage",
        },
        {
          status: 400,
        },
      );
    }

    /* ======================================================
        CREATE
    ====================================================== */

    const car = await Car.create({
      stockNumber: body.stockNumber?.trim() || undefined,

      make,

      model,

      year,

      price,

      currency: body.currency?.trim().toUpperCase() || "USD",

      mileage,

      mileageUnit: body.mileageUnit === "miles" ? "miles" : "km",

      transmission: body.transmission || "Automatic",

      fuelType: body.fuelType || "Petrol",

      bodyType: body.bodyType || "Sedan",

      condition: body.condition || "Used",

      exteriorColor: body.exteriorColor?.trim() || "",

      interiorColor: body.interiorColor?.trim() || "",

      engine: body.engine?.trim() || "",

      description: body.description?.trim() || "",

      features: Array.isArray(body.features)
        ? body.features
            .filter((item) => typeof item === "string")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],

      images: Array.isArray(body.images) ? body.images : [],

      status: body.status || "Available",

      isFeatured: Boolean(body.isFeatured),
    });

    return NextResponse.json(
      {
        success: true,

        message: "Car created successfully",

        data: {
          car,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Cars POST error:", error);

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "That stock number already exists",
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create car",
      },
      {
        status: 500,
      },
    );
  }
}

/* ============================================================
   HELPERS
============================================================ */

function parseOptionalNumber(value) {
  if (value === null || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Car from "@/models/Car";

// export async function GET(request) {
//   try {
//     await connectDB();
//     console.log(1)
//     const { searchParams } = new URL(request.url);

//     const search =
//       searchParams.get("search")?.trim() || "";

//     const status =
//       searchParams.get("status")?.trim() || "";

//     const condition =
//       searchParams.get("condition")?.trim() || "";

//     const sort =
//       searchParams.get("sort")?.trim() ||
//       "newest";

//     const page = Math.max(
//       Number(searchParams.get("page")) || 1,
//       1
//     );
//     console.log(page,"age")
//     console.log(2)
//     const limit = Math.min(
//       Math.max(
//         Number(searchParams.get("limit")) || 2,
//         1
//       ),
//       50
//     );
// console.log(3)
//     const filter = {};

//     if (status) {
//       filter.status = status;
//     }

//     if (condition) {
//       filter.condition = condition;
//     }

//     if (search) {
//       const regex = {
//         $regex: escapeRegex(search),
//         $options: "i",
//       };

//       filter.$or = [
//         { make: regex },
//         { model: regex },
//         { stockNumber: regex },
//       ];
//     }
// console.log(4)
//     const sortOptions = {
//       newest: {
//         createdAt: -1,
//       },

//       oldest: {
//         createdAt: 1,
//       },

//       "price-low": {
//         price: 1,
//         createdAt: -1,
//       },

//       "price-high": {
//         price: -1,
//         createdAt: -1,
//       },

//       "year-new": {
//         year: -1,
//         createdAt: -1,
//       },

//       "year-old": {
//         year: 1,
//         createdAt: -1,
//       },
//     };

//     const sortQuery =
//       sortOptions[sort] || sortOptions.newest;

//     const skip = (page - 1) * limit;
// console.log(5)
//     const [cars, total] = await Promise.all([
//       Car.find(filter)
//         .select(
//           "stockNumber make model year price currency mileage mileageUnit transmission fuelType bodyType condition exteriorColor images status isFeatured createdAt updatedAt"
//         )
//         .sort(sortQuery)
//         .skip(skip)
//         .limit(limit)
//         .lean(),

//       Car.countDocuments(filter),
//     ]);

//     const totalPages = Math.ceil(
//       total / limit
//     );
// console.log(6)
//     return NextResponse.json({
//       success: true,
//       data: {
//         cars,
//         pagination: {
//           page,
//           limit,
//           total,
//           totalPages,
//           hasNextPage: page < totalPages,
//           hasPreviousPage: page > 1,
//         },
//       },
//     });
//   } catch (error) {
//     console.error(
//       "Admin cars GET error:",
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to load cars",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

// export async function POST(request) {
//   try {
//     await connectDB();

//     const body = await request.json();

//     const make = body.make?.trim();
//     const model = body.model?.trim();

//     if (!make) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Make is required",
//         },
//         { status: 400 }
//       );
//     }

//     if (!model) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Model is required",
//         },
//         { status: 400 }
//       );
//     }

//     const year = Number(body.year);
//     const price = Number(body.price);

//     if (!Number.isInteger(year)) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Valid year is required",
//         },
//         { status: 400 }
//       );
//     }

//     if (!Number.isFinite(price) || price < 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Valid price is required",
//         },
//         { status: 400 }
//       );
//     }

//     const mileage = Number(body.mileage || 0);

//     if (!Number.isFinite(mileage) || mileage < 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Invalid mileage",
//         },
//         { status: 400 }
//       );
//     }

//     const car = await Car.create({
//       stockNumber:
//         body.stockNumber?.trim() || undefined,

//       make,
//       model,
//       year,
//       price,

//       currency:
//         body.currency?.trim().toUpperCase() ||
//         "USD",

//       mileage,

//       mileageUnit:
//         body.mileageUnit === "miles"
//           ? "miles"
//           : "km",

//       transmission:
//         body.transmission || "Automatic",

//       fuelType:
//         body.fuelType || "Petrol",

//       bodyType:
//         body.bodyType || "Sedan",

//       condition:
//         body.condition || "Used",

//       exteriorColor:
//         body.exteriorColor?.trim() || "",

//       interiorColor:
//         body.interiorColor?.trim() || "",

//       engine:
//         body.engine?.trim() || "",

//       description:
//         body.description?.trim() || "",

//       features: Array.isArray(body.features)
//         ? body.features
//             .filter(
//               (item) =>
//                 typeof item === "string"
//             )
//             .map((item) => item.trim())
//             .filter(Boolean)
//         : [],

//       images: Array.isArray(body.images)
//         ? body.images
//         : [],

//       status:
//         body.status || "Available",

//       isFeatured:
//         Boolean(body.isFeatured),
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Car created successfully",
//         data: {
//           car,
//         },
//       },
//       {
//         status: 201,
//       }
//     );
//   } catch (error) {
//     console.error(
//       "Admin car POST error:",
//       error
//     );

//     if (error.code === 11000) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "That stock number already exists",
//         },
//         {
//           status: 409,
//         }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to create car",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

// function escapeRegex(value) {
//   return value.replace(
//     /[.*+?^${}()|[\]\\]/g,
//     "\\$&"
//   );
// }
