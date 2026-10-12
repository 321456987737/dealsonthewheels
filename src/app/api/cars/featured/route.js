
import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Car from "@/models/Car";

export async function GET() {
  try {
    await connectDB();

    const cars = await Car.find({
      isFeatured: true,
      status: "Available",
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .select(
        "make model year price currency mileage mileageUnit transmission fuelType bodyType condition images"
      )
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: cars,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Featured cars API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load featured vehicles.",
      },
      {
        status: 500,
      }
    );
  }
}
