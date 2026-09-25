import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Inquiry from "@/models/Inquiry";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const search =
      searchParams.get("search")?.trim() || "";

    const status =
      searchParams.get("status")?.trim() || "";

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(searchParams.get("limit")) || 15,
        1
      ),
      50
    );

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      const regex = {
        $regex: escapeRegex(search),
        $options: "i",
      };

      filter.$or = [
        {
          customerName: regex,
        },
        {
          phone: regex,
        },
        {
          email: regex,
        },
        {
          message: regex,
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [inquiries, total] =
      await Promise.all([
        Inquiry.find(filter)
          .populate({
            path: "carId",
            select:
              "make model year price currency images status",
          })
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit)
          .lean(),

        Inquiry.countDocuments(filter),
      ]);

    const totalPages = Math.ceil(
      total / limit
    );

    return NextResponse.json({
      success: true,
      data: {
        inquiries,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage:
            page < totalPages,
          hasPreviousPage:
            page > 1,
        },
      },
    });
  } catch (error) {
    console.error(
      "Admin inquiries GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load inquiries",
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