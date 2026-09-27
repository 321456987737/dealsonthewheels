import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import {connectDB} from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      password,
      setupKey,
    } = body;

    if (!name || !email || !password || !setupKey) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid setup key.",
        },
        {
          status: 403,
        }
      );
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Name must contain at least 2 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must contain at least 8 characters.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const existingAdmin = await User.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin account has already been created.",
        },
        {
          status: 403,
        }
      );
    }

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      role: "admin",
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin account created successfully.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("ADMIN SIGNUP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating the admin account.",
      },
      {
        status: 500,
      }
    );
  }
}