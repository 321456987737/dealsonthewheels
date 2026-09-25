import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Business from "@/models/Business";

export async function GET() {
  try {
    await connectDB();

    const business = await Business.findOne({
      isActive: true,
    })
      .select(
        "name logo heroImage description phone whatsapp email website address city country postalCode location openingHours services socialLinks"
      )
      .lean();

    if (!business) {
      return NextResponse.json(
        {
          success: false,
          message: "Dealership not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: business,
    });
  } catch (error) {
    console.error("Business API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dealership",
      },
      {
        status: 500,
      }
    );
  }
}