
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import Car from "@/models/Car";
import Inquiry from "@/models/Inquiry";
import TestDrive from "@/models/TestDrive";

export async function GET() {
  try {
    await connectDB();

    const [
      totalCars,
      availableCars,
      reservedCars,
      soldCars,
      totalUsers,
      totalInquiries,
      newInquiries,
      totalTestDrives,
      pendingTestDrives,
      confirmedTestDrives,
      recentCars,
      recentInquiries,
      recentTestDrives,
    ] = await Promise.all([
      Car.countDocuments(),

      Car.countDocuments({
        status: "Available",
      }),

      Car.countDocuments({
        status: "Reserved",
      }),

      Car.countDocuments({
        status: "Sold",
      }),

      /*
       * User model doesn't exist yet.
       * Return 0 for now.
       */
      Promise.resolve(0),

      Inquiry.countDocuments(),

      Inquiry.countDocuments({
        status: "New",
      }),

      TestDrive.countDocuments(),

      TestDrive.countDocuments({
        status: "Pending",
      }),

      TestDrive.countDocuments({
        status: "Confirmed",
      }),

      Car.find()
        .select(
          "make model year price currency status images createdAt"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .lean(),

      Inquiry.find()
        .select(
          "customerName phone email carId message status createdAt"
        )
        .populate({
          path: "carId",
          select: "make model year",
        })
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .lean(),

      TestDrive.find()
        .select(
          "customerName phone carId date time status createdAt"
        )
        .populate({
          path: "carId",
          select: "make model year",
        })
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .lean(),
    ]);

    return NextResponse.json({
      success: true,

      data: {
        stats: {
          totalCars,
          availableCars,
          reservedCars,
          soldCars,
          totalUsers,
          totalInquiries,
          newInquiries,
          totalTestDrives,
          pendingTestDrives,
          confirmedTestDrives,
        },

        recentCars,
        recentInquiries,
        recentTestDrives,
      },
    });
  } catch (error) {
    console.error(
      "Admin dashboard API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load admin dashboard",
      },
      {
        status: 500,
      }
    );
  }
}

// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";

// import Business from "@/models/Business";
// import Car from "@/models/Car";
// import Inquiry from "@/models/Inquiry";
// import TestDrive from "@/models/TestDrive";

// export async function GET() {
//   try {
//     await connectDB();

//     const [
//       totalCars,
//       availableCars,
//       reservedCars,
//       soldCars,
//       totalBusinesses,
//       totalUsers,
//       totalInquiries,
//       newInquiries,
//       totalTestDrives,
//       pendingTestDrives,
//       confirmedTestDrives,
//       recentCars,
//       recentInquiries,
//       recentTestDrives,
//     ] = await Promise.all([
//       Car.countDocuments(),

//       Car.countDocuments({
//         status: "Available",
//       }),

//       Car.countDocuments({
//         status: "Reserved",
//       }),

//       Car.countDocuments({
//         status: "Sold",
//       }),

//       Business.countDocuments(),

//       /*
//        * User model doesn't exist yet in the customer-side
//        * implementation, so return 0 for now.
//        *
//        * We'll connect this when the Users section is built.
//        */
//       Promise.resolve(0),

//       Inquiry.countDocuments(),

//       Inquiry.countDocuments({
//         status: "New",
//       }),

//       TestDrive.countDocuments(),

//       TestDrive.countDocuments({
//         status: "Pending",
//       }),

//       TestDrive.countDocuments({
//         status: "Confirmed",
//       }),

//       Car.find()
//         .select(
//           "make model year price currency status images createdAt"
//         )
//         .sort({
//           createdAt: -1,
//         })
//         .limit(5)
//         .lean(),

//       Inquiry.find()
//         .select(
//           "customerName phone email carId message status createdAt"
//         )
//         .populate({
//           path: "carId",
//           select: "make model year",
//         })
//         .sort({
//           createdAt: -1,
//         })
//         .limit(5)
//         .lean(),

//       TestDrive.find()
//         .select(
//           "customerName phone carId date time status createdAt"
//         )
//         .populate({
//           path: "carId",
//           select: "make model year",
//         })
//         .sort({
//           createdAt: -1,
//         })
//         .limit(5)
//         .lean(),
//     ]);

//     return NextResponse.json({
//       success: true,

//       data: {
//         stats: {
//           totalCars,
//           availableCars,
//           reservedCars,
//           soldCars,
//           totalBusinesses,
//           totalUsers,
//           totalInquiries,
//           newInquiries,
//           totalTestDrives,
//           pendingTestDrives,
//           confirmedTestDrives,
//         },

//         recentCars,
//         recentInquiries,
//         recentTestDrives,
//       },
//     });
//   } catch (error) {
//     console.error(
//       "Admin dashboard API error:",
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           "Failed to load admin dashboard",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }