import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Business from "@/models/Business";

export async function GET() {
  try {
    await connectDB();

    let business = await Business.findOne({
      isActive: true,
    }).lean();

    /*
     * If the dealership document does not exist yet,
     * create a basic one so the settings page can be
     * used immediately.
     */
    if (!business) {
      business = await Business.create({
        name: "Your Dealership",
        slug: "your-dealership",
        isActive: true,
      });

      business = business.toObject();
    }

    return NextResponse.json({
      success: true,
      data: {
        business,
      },
    });
  } catch (error) {
    console.error(
      "Admin settings GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load dealership settings",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const body = await request.json();

    let business = await Business.findOne({
      isActive: true,
    });

    if (!business) {
      business = new Business({
        name: "Your Dealership",
        slug: "your-dealership",
        isActive: true,
      });
    }

    if (body.name !== undefined) {
      const name = String(body.name).trim();

      if (!name) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Dealership name is required",
          },
          { status: 400 }
        );
      }

      business.name = name;
    }

    if (body.logo !== undefined) {
      business.logo =
        String(body.logo || "").trim();
    }

    if (body.heroImage !== undefined) {
      business.heroImage =
        String(body.heroImage || "").trim();
    }

    if (body.description !== undefined) {
      business.description =
        String(body.description || "").trim();
    }

    if (body.phone !== undefined) {
      business.phone =
        String(body.phone || "").trim();
    }

    if (body.whatsapp !== undefined) {
      business.whatsapp =
        String(body.whatsapp || "").trim();
    }

    if (body.email !== undefined) {
      const email =
        String(body.email || "")
          .trim()
          .toLowerCase();

      if (email) {
        const emailRegex =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Please enter a valid email address",
            },
            { status: 400 }
          );
        }
      }

      business.email = email;
    }

    if (body.website !== undefined) {
      business.website =
        String(body.website || "").trim();
    }

    if (body.address !== undefined) {
      business.address =
        String(body.address || "").trim();
    }

    if (body.city !== undefined) {
      business.city =
        String(body.city || "").trim();
    }

    if (body.country !== undefined) {
      business.country =
        String(body.country || "").trim();
    }

    if (body.postalCode !== undefined) {
      business.postalCode =
        String(body.postalCode || "").trim();
    }

    if (body.location !== undefined) {
      const lat = Number(
        body.location?.lat
      );

      const lng = Number(
        body.location?.lng
      );

      if (
        body.location?.lat === null &&
        body.location?.lng === null
      ) {
        business.location = {
          lat: null,
          lng: null,
        };
      } else if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Location coordinates must be valid numbers",
          },
          { status: 400 }
        );
      } else {
        business.location = {
          lat,
          lng,
        };
      }
    }

    if (body.openingHours !== undefined) {
      const openingHours =
        body.openingHours || {};

      business.openingHours = {
        monday:
          String(
            openingHours.monday || ""
          ).trim(),

        tuesday:
          String(
            openingHours.tuesday || ""
          ).trim(),

        wednesday:
          String(
            openingHours.wednesday || ""
          ).trim(),

        thursday:
          String(
            openingHours.thursday || ""
          ).trim(),

        friday:
          String(
            openingHours.friday || ""
          ).trim(),

        saturday:
          String(
            openingHours.saturday || ""
          ).trim(),

        sunday:
          String(
            openingHours.sunday || ""
          ).trim(),
      };
    }

    if (body.services !== undefined) {
      if (!Array.isArray(body.services)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Services must be an array",
          },
          { status: 400 }
        );
      }

      business.services = body.services
        .filter(
          (service) =>
            typeof service === "string"
        )
        .map((service) => service.trim())
        .filter(Boolean);
    }

    if (body.socialLinks !== undefined) {
      const socialLinks =
        body.socialLinks || {};

      business.socialLinks = {
        instagram:
          String(
            socialLinks.instagram || ""
          ).trim(),

        facebook:
          String(
            socialLinks.facebook || ""
          ).trim(),

        tiktok:
          String(
            socialLinks.tiktok || ""
          ).trim(),
      };
    }

    business.isActive = true;

    /*
     * slug is kept in the database because the schema
     * requires it, but it is not used in the public URL.
     */
    if (!business.slug) {
      business.slug =
        generateSlug(business.name);
    }

    await business.save();

    return NextResponse.json({
      success: true,
      message:
        "Dealership settings updated successfully",
      data: {
        business,
      },
    });
  } catch (error) {
    console.error(
      "Admin settings PATCH error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update dealership settings",
      },
      {
        status: 500,
      }
    );
  }
}

function generateSlug(name) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") ||
    "dealership"
  );
}