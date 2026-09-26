import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Car from "@/models/Car";

export async function GET(request) {
  try {
    await connectDB();
    console.log(1)
    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search")?.trim() || "";

    const status =
      searchParams.get("status")?.trim() || "";

    const condition =
      searchParams.get("condition")?.trim() || "";

    const sort =
      searchParams.get("sort")?.trim() ||
      "newest";

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );
    console.log(page,"age")
    console.log(2)
    const limit = Math.min(
      Math.max(
        Number(searchParams.get("limit")) || 2,
        1
      ),
      50
    );
console.log(3)
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (condition) {
      filter.condition = condition;
    }

    if (search) {
      const regex = {
        $regex: escapeRegex(search),
        $options: "i",
      };

      filter.$or = [
        { make: regex },
        { model: regex },
        { stockNumber: regex },
      ];
    }
console.log(4)
    const sortOptions = {
      newest: {
        createdAt: -1,
      },

      oldest: {
        createdAt: 1,
      },

      "price-low": {
        price: 1,
        createdAt: -1,
      },

      "price-high": {
        price: -1,
        createdAt: -1,
      },

      "year-new": {
        year: -1,
        createdAt: -1,
      },

      "year-old": {
        year: 1,
        createdAt: -1,
      },
    };

    const sortQuery =
      sortOptions[sort] || sortOptions.newest;

    const skip = (page - 1) * limit;
console.log(5)
    const [cars, total] = await Promise.all([
      Car.find(filter)
        .select(
          "stockNumber make model year price currency mileage mileageUnit transmission fuelType bodyType condition exteriorColor images status isFeatured createdAt updatedAt"
        )
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),

      Car.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(
      total / limit
    );
console.log(6)
    return NextResponse.json({
      success: true,
      data: {
        cars,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error(
      "Admin cars GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load cars",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const make = body.make?.trim();
    const model = body.model?.trim();

    if (!make) {
      return NextResponse.json(
        {
          success: false,
          message: "Make is required",
        },
        { status: 400 }
      );
    }

    if (!model) {
      return NextResponse.json(
        {
          success: false,
          message: "Model is required",
        },
        { status: 400 }
      );
    }

    const year = Number(body.year);
    const price = Number(body.price);

    if (!Number.isInteger(year)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid year is required",
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid price is required",
        },
        { status: 400 }
      );
    }

    const mileage = Number(body.mileage || 0);

    if (!Number.isFinite(mileage) || mileage < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid mileage",
        },
        { status: 400 }
      );
    }

    const car = await Car.create({
      stockNumber:
        body.stockNumber?.trim() || undefined,

      make,
      model,
      year,
      price,

      currency:
        body.currency?.trim().toUpperCase() ||
        "USD",

      mileage,

      mileageUnit:
        body.mileageUnit === "miles"
          ? "miles"
          : "km",

      transmission:
        body.transmission || "Automatic",

      fuelType:
        body.fuelType || "Petrol",

      bodyType:
        body.bodyType || "Sedan",

      condition:
        body.condition || "Used",

      exteriorColor:
        body.exteriorColor?.trim() || "",

      interiorColor:
        body.interiorColor?.trim() || "",

      engine:
        body.engine?.trim() || "",

      description:
        body.description?.trim() || "",

      features: Array.isArray(body.features)
        ? body.features
            .filter(
              (item) =>
                typeof item === "string"
            )
            .map((item) => item.trim())
            .filter(Boolean)
        : [],

      images: Array.isArray(body.images)
        ? body.images
        : [],

      status:
        body.status || "Available",

      isFeatured:
        Boolean(body.isFeatured),
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
      }
    );
  } catch (error) {
    console.error(
      "Admin car POST error:",
      error
    );

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "That stock number already exists",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create car",
      },
      {
        status: 500,
      }
    );
  }
}

function escapeRegex(value) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}