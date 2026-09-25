import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import Car from "@/models/Car";
import TestDrive from "@/models/TestDrive";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const customerName = body.customerName?.trim();
    const phone = body.phone?.trim();
    const email = body.email?.trim().toLowerCase() || "";
    const date = body.date?.trim();
    const time = body.time?.trim();
    const message = body.message?.trim() || "";
    const carId = body.carId?.trim();

    // -------------------------
    // VALIDATION
    // -------------------------

    if (!customerName) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your name",
        },
        { status: 400 }
      );
    }

    if (customerName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Name must be at least 2 characters",
        },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your phone number",
        },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a date",
        },
        { status: 400 }
      );
    }

    if (!time) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a time",
        },
        { status: 400 }
      );
    }

    if (!carId) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehicle is required",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid vehicle",
        },
        { status: 400 }
      );
    }

    // -------------------------
    // EMAIL VALIDATION
    // -------------------------

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return NextResponse.json(
          {
            success: false,
            message: "Please enter a valid email address",
          },
          { status: 400 }
        );
      }
    }

    // -------------------------
    // FIND VEHICLE
    // -------------------------

    const car = await Car.findById(carId)
      .select("_id make model year status")
      .lean();

    if (!car) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehicle not found",
        },
        { status: 404 }
      );
    }

    // -------------------------
    // CHECK VEHICLE STATUS
    // -------------------------

    if (car.status === "Sold") {
      return NextResponse.json(
        {
          success: false,
          message:
            "This vehicle is no longer available for a test drive",
        },
        { status: 400 }
      );
    }

    // -------------------------
    // PREVENT DUPLICATE SLOT
    // -------------------------

    const existingBooking = await TestDrive.findOne({
      carId: car._id,
      date,
      time,
      status: {
        $in: ["Pending", "Confirmed"],
      },
    })
      .select("_id")
      .lean();

    if (existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message:
            "That time is already requested for this vehicle. Please choose another time.",
        },
        { status: 409 }
      );
    }

    // -------------------------
    // CREATE TEST DRIVE
    // -------------------------

    const testDrive = await TestDrive.create({
      carId: car._id,
      customerName,
      phone,
      email,
      date,
      time,
      message,
      source: "Website",
    });

    // -------------------------
    // SUCCESS
    // -------------------------

    return NextResponse.json(
      {
        success: true,
        message:
          "Your test drive request has been submitted successfully.",
        data: {
          testDriveId: testDrive._id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create test drive error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import { connectDB } from "@/lib/db";
// import Business from "@/models/Business";
// import Car from "@/models/Car";
// import TestDrive from "@/models/TestDrive";

// export async function POST(request) {
//   try {
//     await connectDB();

//     const body = await request.json();

//     const customerName =
//       body.customerName?.trim();

//     const phone = body.phone?.trim();

//     const email =
//       body.email?.trim().toLowerCase() || "";

//     const date = body.date?.trim();

//     const time = body.time?.trim();

//     const message =
//       body.message?.trim() || "";

//     const carId = body.carId?.trim();

//     if (!customerName) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Please enter your name",
//         },
//         { status: 400 }
//       );
//     }

//     if (customerName.length < 2) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Name must be at least 2 characters",
//         },
//         { status: 400 }
//       );
//     }

//     if (!phone) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Please enter your phone number",
//         },
//         { status: 400 }
//       );
//     }

//     if (!date) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Please select a date",
//         },
//         { status: 400 }
//       );
//     }

//     if (!time) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Please select a time",
//         },
//         { status: 400 }
//       );
//     }

//     if (!carId) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Vehicle is required",
//         },
//         { status: 400 }
//       );
//     }

//     if (!mongoose.Types.ObjectId.isValid(carId)) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Invalid vehicle",
//         },
//         { status: 400 }
//       );
//     }

//     if (email) {
//       const emailRegex =
//         /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//       if (!emailRegex.test(email)) {
//         return NextResponse.json(
//           {
//             success: false,
//             message:
//               "Please enter a valid email address",
//           },
//           { status: 400 }
//         );
//       }
//     }

//     const business = await Business.findOne({
//       isActive: true,
//     })
//       .select("_id")
//       .lean();

//     if (!business) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Dealership not found",
//         },
//         { status: 404 }
//       );
//     }

//     const car = await Car.findOne({
//       _id: carId,
//       businessId: business._id,
//     })
//       .select(
//         "_id make model year status"
//       )
//       .lean();

//     if (!car) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Vehicle not found",
//         },
//         { status: 404 }
//       );
//     }

//     if (car.status === "Sold") {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "This vehicle is no longer available for a test drive",
//         },
//         { status: 400 }
//       );
//     }

//     /*
//      * Prevent the exact same time slot from being
//      * requested twice while the first request is pending
//      * or confirmed.
//      */
//     const existingBooking =
//       await TestDrive.findOne({
//         businessId: business._id,
//         carId: car._id,
//         date,
//         time,
//         status: {
//           $in: ["Pending", "Confirmed"],
//         },
//       })
//         .select("_id")
//         .lean();

//     if (existingBooking) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "That time is already requested for this vehicle. Please choose another time.",
//         },
//         { status: 409 }
//       );
//     }

//     const testDrive = await TestDrive.create({
//       businessId: business._id,
//       carId: car._id,
//       customerName,
//       phone,
//       email,
//       date,
//       time,
//       message,
//       source: "Website",
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message:
//           "Your test drive request has been submitted successfully.",
//         data: {
//           testDriveId: testDrive._id,
//         },
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error(
//       "Create test drive error:",
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           "Something went wrong. Please try again.",
//       },
//       { status: 500 }
//     );
//   }
// }