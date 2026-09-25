import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: null,
  });
}

export async function PATCH() {
  return NextResponse.json({
    success: true,
    message: "Settings endpoint is not currently in use",
    data: null,
  });
}

// import { NextResponse } from "next/server";

// import { connectDB } from "@/lib/db";
// import Settings from "@/models/Settings";

// export async function GET() {
//   try {
//     await connectDB();

//     let settings = await Settings.findOne().lean();

//     /*
//      * Create default dealership settings if they
//      * don't exist yet.
//      */
//     if (!settings) {
//       settings = await Settings.create({
//         name: "Your Dealership",
//         isActive: true,
//       });

//       settings = settings.toObject();
//     }

//     return NextResponse.json({
//       success: true,
//       data: {
//         settings,
//       },
//     });
//   } catch (error) {
//     console.error("Admin settings GET error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to load dealership settings",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

// export async function PATCH(request) {
//   try {
//     await connectDB();

//     const body = await request.json();

//     let settings = await Settings.findOne();

//     if (!settings) {
//       settings = new Settings({
//         name: "Your Dealership",
//         isActive: true,
//       });
//     }

//     if (body.name !== undefined) {
//       const name = String(body.name).trim();

//       if (!name) {
//         return NextResponse.json(
//           {
//             success: false,
//             message: "Dealership name is required",
//           },
//           { status: 400 }
//         );
//       }

//       settings.name = name;
//     }

//     if (body.logo !== undefined) {
//       settings.logo = String(body.logo || "").trim();
//     }

//     if (body.heroImage !== undefined) {
//       settings.heroImage = String(
//         body.heroImage || ""
//       ).trim();
//     }

//     if (body.description !== undefined) {
//       settings.description = String(
//         body.description || ""
//       ).trim();
//     }

//     if (body.phone !== undefined) {
//       settings.phone = String(
//         body.phone || ""
//       ).trim();
//     }

//     if (body.whatsapp !== undefined) {
//       settings.whatsapp = String(
//         body.whatsapp || ""
//       ).trim();
//     }

//     if (body.email !== undefined) {
//       const email = String(body.email || "")
//         .trim()
//         .toLowerCase();

//       if (email) {
//         const emailRegex =
//           /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//         if (!emailRegex.test(email)) {
//           return NextResponse.json(
//             {
//               success: false,
//               message:
//                 "Please enter a valid email address",
//             },
//             { status: 400 }
//           );
//         }
//       }

//       settings.email = email;
//     }

//     if (body.website !== undefined) {
//       settings.website = String(
//         body.website || ""
//       ).trim();
//     }

//     if (body.address !== undefined) {
//       settings.address = String(
//         body.address || ""
//       ).trim();
//     }

//     if (body.city !== undefined) {
//       settings.city = String(
//         body.city || ""
//       ).trim();
//     }

//     if (body.country !== undefined) {
//       settings.country = String(
//         body.country || ""
//       ).trim();
//     }

//     if (body.postalCode !== undefined) {
//       settings.postalCode = String(
//         body.postalCode || ""
//       ).trim();
//     }

//     if (body.location !== undefined) {
//       const lat = Number(body.location?.lat);
//       const lng = Number(body.location?.lng);

//       if (
//         body.location?.lat === null &&
//         body.location?.lng === null
//       ) {
//         settings.location = {
//           lat: null,
//           lng: null,
//         };
//       } else if (
//         !Number.isFinite(lat) ||
//         !Number.isFinite(lng)
//       ) {
//         return NextResponse.json(
//           {
//             success: false,
//             message:
//               "Location coordinates must be valid numbers",
//           },
//           { status: 400 }
//         );
//       } else {
//         settings.location = {
//           lat,
//           lng,
//         };
//       }
//     }

//     if (body.openingHours !== undefined) {
//       const openingHours =
//         body.openingHours || {};

//       settings.openingHours = {
//         monday: String(
//           openingHours.monday || ""
//         ).trim(),

//         tuesday: String(
//           openingHours.tuesday || ""
//         ).trim(),

//         wednesday: String(
//           openingHours.wednesday || ""
//         ).trim(),

//         thursday: String(
//           openingHours.thursday || ""
//         ).trim(),

//         friday: String(
//           openingHours.friday || ""
//         ).trim(),

//         saturday: String(
//           openingHours.saturday || ""
//         ).trim(),

//         sunday: String(
//           openingHours.sunday || ""
//         ).trim(),
//       };
//     }

//     if (body.services !== undefined) {
//       if (!Array.isArray(body.services)) {
//         return NextResponse.json(
//           {
//             success: false,
//             message: "Services must be an array",
//           },
//           { status: 400 }
//         );
//       }

//       settings.services = body.services
//         .filter(
//           (service) =>
//             typeof service === "string"
//         )
//         .map((service) => service.trim())
//         .filter(Boolean);
//     }

//     if (body.socialLinks !== undefined) {
//       const socialLinks =
//         body.socialLinks || {};

//       settings.socialLinks = {
//         instagram: String(
//           socialLinks.instagram || ""
//         ).trim(),

//         facebook: String(
//           socialLinks.facebook || ""
//         ).trim(),

//         tiktok: String(
//           socialLinks.tiktok || ""
//         ).trim(),
//       };
//     }

//     settings.isActive = true;

//     await settings.save();

//     return NextResponse.json({
//       success: true,
//       message:
//         "Dealership settings updated successfully",

//       data: {
//         settings,
//       },
//     });
//   } catch (error) {
//     console.error(
//       "Admin settings PATCH error:",
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           "Failed to update dealership settings",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }