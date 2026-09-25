import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Car from "@/models/Car";

export async function GET() {
  try {
    await connectDB();

    const [featuredCars, latestCars] = await Promise.all([
      Car.find({
        status: "Available",
        isFeatured: true,
      })
        .select(
          "make model year price currency mileage mileageUnit transmission fuelType bodyType condition exteriorColor images status isFeatured"
        )
        .sort({
          createdAt: -1,
        })
        .limit(8)
        .lean(),

      Car.find({
        status: "Available",
      })
        .select(
          "make model year price currency mileage mileageUnit transmission fuelType bodyType condition exteriorColor images status isFeatured"
        )
        .sort({
          createdAt: -1,
        })
        .limit(8)
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        featuredCars,
        latestCars,
      },
    });
  } catch (error) {
    console.error("Homepage API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load homepage data",
      },
      {
        status: 500,
      }
    );
  }
}