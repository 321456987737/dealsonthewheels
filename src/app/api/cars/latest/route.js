
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Car from "@/models/Car";

export async function GET() {
  try {
    await connectDB();

    const latestCars = await Car.find({
      status: "Available",
    })
      .select(
        "stockNumber make model year price currency mileage mileageUnit transmission fuelType bodyType condition exteriorColor images status isFeatured createdAt"
      )
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .limit(8)
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: latestCars,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Latest arrivals API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load latest arrivals",
      },
      {
        status: 500,
      }
    );
  }
}