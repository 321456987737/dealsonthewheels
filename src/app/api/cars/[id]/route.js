import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Car from "@/models/Car";
// import Business from "@/models/Business";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid car ID",
        },
        {
          status: 400,
        }
      );
    }

    const car = await Car.findById(id)
      .select(
        "stockNumber make model year price currency mileage mileageUnit transmission fuelType bodyType condition exteriorColor interiorColor engine description features images status isFeatured createdAt"
      )
      .lean();

    if (!car) {
      return NextResponse.json(
        {
          success: false,
          message: "Car not found",
        },
        {
          status: 404,
        }
      );
    }

    // const business = await Business.findOne({
    //   isActive: true,
    // })
    //   .select(
    //     "name logo phone whatsapp email address city country postalCode location openingHours socialLinks"
    //   )
    //   .lean();

    // if (!business) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Dealership not found",
    //     },
    //     {
    //       status: 404,
    //     }
    //   );
    // }

    const relatedCars = await Car.find({
      _id: {
        $ne: car._id,
      },
      status: "Available",
      $or: [
        { make: car.make },
        { bodyType: car.bodyType },
      ],
    })
      .select(
        "make model year price currency mileage mileageUnit transmission fuelType bodyType images status isFeatured"
      )
      .sort({
        createdAt: -1,
      })
      .limit(4)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        car,
        // business,
        relatedCars,
      },
    });
  } catch (error) {
    console.error("Car details API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load car",
      },
      {
        status: 500,
      }
    );
  }
}