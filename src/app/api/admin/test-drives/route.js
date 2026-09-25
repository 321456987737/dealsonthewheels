import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import TestDrive from "@/models/TestDrive";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const search =
      searchParams.get("search")?.trim() || "";

    const status =
      searchParams.get("status")?.trim() || "";

    const date =
      searchParams.get("date")?.trim() || "";

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

    if (date) {
      filter.date = date;
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
        {
          date: regex,
        },
        {
          time: regex,
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [testDrives, total] =
      await Promise.all([
        TestDrive.find(filter)
          .populate({
            path: "carId",
            select:
              "make model year price currency images status",
          })
          .sort({
            date: 1,
            time: 1,
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit)
          .lean(),

        TestDrive.countDocuments(filter),
      ]);

    const totalPages = Math.ceil(
      total / limit
    );

    return NextResponse.json({
      success: true,
      data: {
        testDrives,
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
      "Admin test drives GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load test drives",
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