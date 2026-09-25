import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import Inquiry from "@/models/Inquiry";

const ALLOWED_STATUSES = [
  "New",
  "Contacted",
  "In Progress",
  "Closed",
];

export async function GET(
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
          message: "Invalid inquiry ID",
        },
        {
          status: 400,
        }
      );
    }

    const inquiry =
      await Inquiry.findById(id)
        .populate({
          path: "carId",
          select:
            "make model year price currency mileage mileageUnit images status",
        })
        .lean();

    if (!inquiry) {
      return NextResponse.json(
        {
          success: false,
          message: "Inquiry not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        inquiry,
      },
    });
  } catch (error) {
    console.error(
      "Admin inquiry GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load inquiry",
      },
      {
        status: 500,
      }
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

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid inquiry ID",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    if (
      !body.status ||
      !ALLOWED_STATUSES.includes(
        body.status
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid inquiry status",
        },
        {
          status: 400,
        }
      );
    }

    const inquiry =
      await Inquiry.findByIdAndUpdate(
        id,
        {
          $set: {
            status: body.status,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate({
          path: "carId",
          select:
            "make model year price currency images status",
        })
        .lean();

    if (!inquiry) {
      return NextResponse.json(
        {
          success: false,
          message: "Inquiry not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Inquiry status updated successfully",
      data: {
        inquiry,
      },
    });
  } catch (error) {
    console.error(
      "Admin inquiry PATCH error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update inquiry",
      },
      {
        status: 500,
      }
    );
  }
}