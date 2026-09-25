import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import Car from "@/models/Car";
import cloudinary from "@/lib/cloudinary";
export async function GET(
  request,
  { params }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid car ID",
        },
        { status: 400 }
      );
    }

    const car = await Car.findById(id).lean();

    if (!car) {
      return NextResponse.json(
        {
          success: false,
          message: "Car not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        car,
      },
    });
  } catch (error) {
    console.error(
      "Admin car GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load car",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request,
  { params }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid car ID",
        },
        { status: 400 }
      );
    }

    const existingCar = await Car.findById(id);

    if (!existingCar) {
      return NextResponse.json(
        {
          success: false,
          message: "Car not found",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const allowedFields = [
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
      "description",
      "features",
      "images",
      "status",
      "isFeatured",
    ];

    for (const field of allowedFields) {
      if (body[field] === undefined) {
        continue;
      }

      if (
        [
          "make",
          "model",
          "currency",
          "exteriorColor",
          "interiorColor",
          "engine",
          "description",
        ].includes(field)
      ) {
        existingCar[field] =
          String(body[field]).trim();

        continue;
      }

      if (field === "stockNumber") {
        existingCar.stockNumber =
          body[field]
            ? String(body[field]).trim()
            : undefined;

        continue;
      }

      if (
        ["year", "price", "mileage"].includes(
          field
        )
      ) {
        const value = Number(body[field]);

        if (!Number.isFinite(value)) {
          return NextResponse.json(
            {
              success: false,
              message: `Invalid ${field}`,
            },
            { status: 400 }
          );
        }

        existingCar[field] = value;
        continue;
      }

      if (field === "features") {
        if (!Array.isArray(body[field])) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Features must be an array",
            },
            { status: 400 }
          );
        }

        existingCar.features = body[field]
          .filter(
            (item) =>
              typeof item === "string"
          )
          .map((item) => item.trim())
          .filter(Boolean);

        continue;
      }

      if (field === "images") {
        if (!Array.isArray(body[field])) {
          return NextResponse.json(
            {
              success: false,
              message: "Images must be an array",
            },
            { status: 400 }
          );
        }

        existingCar.images = body[field];

        continue;
      }

      existingCar[field] = body[field];
    }

    await existingCar.save();

    return NextResponse.json({
      success: true,
      message: "Car updated successfully",
      data: {
        car: existingCar,
      },
    });
  } catch (error) {
    console.error(
      "Admin car PATCH error:",
      error
    );

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "That stock number already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update car",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request,
  { params }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid car ID",
        },
        { status: 400 }
      );
    }

    const car = await Car.findById(id);

    if (!car) {
      return NextResponse.json(
        {
          success: false,
          message: "Car not found",
        },
        { status: 404 }
      );
    }

    const publicIds =
      Array.isArray(car.images)
        ? car.images
            .map(
              (image) =>
                image.publicId
            )
            .filter(Boolean)
        : [];

    await Car.deleteOne({
      _id: car._id,
    });

    /*
     * Delete the corresponding Cloudinary
     * assets after removing the car.
     */
    let imageCleanupWarning = "";

    if (publicIds.length > 0) {
      try {
        for (const publicId of publicIds) {
          await cloudinary.uploader.destroy(
            publicId,
            {
              resource_type:
                "image",

              type: "upload",

              invalidate: true,
            }
          );
        }
      } catch (cleanupError) {
        console.error(
          "Car image cleanup error:",
          cleanupError
        );

        imageCleanupWarning =
          " Car deleted, but some Cloudinary images could not be removed.";
      }
    }

    return NextResponse.json({
      success: true,

      message: `Car deleted successfully.${imageCleanupWarning}`,
    });
  } catch (error) {
    console.error(
      "Admin car DELETE error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete car",
      },
      { status: 500 }
    );
  }
}
