
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Car from "@/models/Car";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    /* ======================================================
        PAGINATION
    ====================================================== */

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(searchParams.get("limit")) || 12,
        1
      ),
      50
    );

    /* ======================================================
        BASIC FILTERS
    ====================================================== */

    const search =
      searchParams.get("search")?.trim() || "";

    const make =
      searchParams.get("make")?.trim() || "";

    const model =
      searchParams.get("model")?.trim() || "";

    const bodyType =
      searchParams.get("bodyType")?.trim() || "";

    const fuelType =
      searchParams.get("fuelType")?.trim() || "";

    const transmission =
      searchParams.get("transmission")?.trim() || "";

    const condition =
      searchParams.get("condition")?.trim() || "";

    const status =
      searchParams.get("status")?.trim() || "Available";

    const sort =
      searchParams.get("sort")?.trim() || "newest";

    /* ======================================================
        NUMBER FILTERS
        IMPORTANT:
        Missing params must become NaN, NOT 0
    ====================================================== */

    const minPriceParam =
      searchParams.get("minPrice");

    const maxPriceParam =
      searchParams.get("maxPrice");

    const minYearParam =
      searchParams.get("minYear");

    const maxYearParam =
      searchParams.get("maxYear");

    const minPrice =
      minPriceParam !== null && minPriceParam !== ""
        ? Number(minPriceParam)
        : NaN;

    const maxPrice =
      maxPriceParam !== null && maxPriceParam !== ""
        ? Number(maxPriceParam)
        : NaN;

    const minYear =
      minYearParam !== null && minYearParam !== ""
        ? Number(minYearParam)
        : NaN;

    const maxYear =
      maxYearParam !== null && maxYearParam !== ""
        ? Number(maxYearParam)
        : NaN;

    /* ======================================================
        FILTER
    ====================================================== */

    const filter = {};

    /* STATUS */

    if (status) {
      filter.status = status;
    }

    /* MAKE */

    if (make) {
      filter.make = {
        $regex: `^${escapeRegex(make)}$`,
        $options: "i",
      };
    }

    /* MODEL */

    if (model) {
      filter.model = {
        $regex: `^${escapeRegex(model)}$`,
        $options: "i",
      };
    }

    /* BODY TYPE */

    if (bodyType) {
      filter.bodyType = bodyType;
    }

    /* FUEL */

    if (fuelType) {
      filter.fuelType = fuelType;
    }

    /* TRANSMISSION */

    if (transmission) {
      filter.transmission = transmission;
    }

    /* CONDITION */

    if (condition) {
      filter.condition = condition;
    }

    /* ======================================================
        SEARCH
    ====================================================== */

    if (search) {
      const searchRegex = {
        $regex: escapeRegex(search),
        $options: "i",
      };

      filter.$or = [
        { make: searchRegex },
        { model: searchRegex },
        { description: searchRegex },
        { stockNumber: searchRegex },
      ];
    }

    /* ======================================================
        PRICE RANGE
    ====================================================== */

    if (
      Number.isFinite(minPrice) ||
      Number.isFinite(maxPrice)
    ) {
      filter.price = {};

      if (Number.isFinite(minPrice)) {
        filter.price.$gte = minPrice;
      }

      if (Number.isFinite(maxPrice)) {
        filter.price.$lte = maxPrice;
      }
    }

    /* ======================================================
        YEAR RANGE
    ====================================================== */

    if (
      Number.isFinite(minYear) ||
      Number.isFinite(maxYear)
    ) {
      filter.year = {};

      if (Number.isFinite(minYear)) {
        filter.year.$gte = minYear;
      }

      if (Number.isFinite(maxYear)) {
        filter.year.$lte = maxYear;
      }
    }

    /* ======================================================
        SORT
    ====================================================== */

    const sortOptions = {
      newest: {
        createdAt: -1,
        _id: -1,
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

      "mileage-low": {
        mileage: 1,
        createdAt: -1,
      },
    };

    const sortQuery =
      sortOptions[sort] ||
      sortOptions.newest;

    /* ======================================================
        PAGINATION CALCULATION
    ====================================================== */

    const skip = (page - 1) * limit;

    /* ======================================================
        DATABASE QUERY
    ====================================================== */

    const [cars, total] = await Promise.all([
      Car.find(filter)
        .select(
          [
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
            "stockNumber",
          ].join(" ")
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

    const totalPages = Math.ceil(total / limit);

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
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Cars API error:", error);

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

/* ============================================================
   ESCAPE REGEX
============================================================ */

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
