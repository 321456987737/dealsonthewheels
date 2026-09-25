import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_FILES = 15;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const CLOUDINARY_UPLOAD_ATTEMPTS = 3;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function POST(request) {
  const uploadedPublicIds = [];

  try {
    const formData = await request.formData();

    const files = formData
      .getAll("files")
      .filter(
        (file) =>
          file &&
          typeof file.arrayBuffer === "function"
      );

    if (files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please select at least one image",
        },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        {
          success: false,
          message: `You can upload a maximum of ${MAX_FILES} images`,
        },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Only JPG, PNG and WebP images are allowed",
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Each image must be smaller than 10MB",
          },
          { status: 400 }
        );
      }
    }

    const uploadedImages = [];

    for (const file of files) {
      const buffer = Buffer.from(
        await file.arrayBuffer()
      );

      const result = await uploadToCloudinary(
        buffer,
        file.name
      );

      uploadedPublicIds.push(
        result.public_id
      );

      uploadedImages.push({
        url: result.secure_url,

        publicId:
          result.public_id,

        width: result.width,

        height: result.height,

        format: result.format,

        alt: file.name,
      });
    }

    return NextResponse.json({
      success: true,
      message:
        "Images uploaded successfully",

      data: {
        images: uploadedImages,
      },
    });
  } catch (error) {
    console.error(
      "Cloudinary upload error:",
      error
    );

    /*
     * If one upload fails after some images were
     * already uploaded, clean those assets up.
     */
    if (
      uploadedPublicIds.length > 0
    ) {
      try {
        await deleteCloudinaryImages(
          uploadedPublicIds
        );
      } catch (cleanupError) {
        console.error(
          "Cloudinary cleanup error:",
          cleanupError
        );
      }
    }

    const message = getCloudinaryErrorMessage(error);

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();

    const publicIds = Array.isArray(
      body.publicIds
    )
      ? body.publicIds.filter(
          (publicId) =>
            typeof publicId === "string" &&
            publicId.trim()
        )
      : [];

    if (publicIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No image public IDs were provided",
        },
        { status: 400 }
      );
    }

    if (publicIds.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You can delete a maximum of 100 images at once",
        },
        { status: 400 }
      );
    }

    await deleteCloudinaryImages(
      publicIds
    );

    return NextResponse.json({
      success: true,
      message:
        "Images deleted successfully",
    });
  } catch (error) {
    console.error(
      "Cloudinary delete error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete images",
      },
      { status: 500 }
    );
  }
}

function uploadToCloudinary(
  buffer,
  originalName
) {
  const filename = originalName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase();

  return uploadWithRetry(buffer, filename);
}

async function uploadWithRetry(buffer, filename) {
  let lastError;

  for (let attempt = 1; attempt <= CLOUDINARY_UPLOAD_ATTEMPTS; attempt += 1) {
    try {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "car-dealership/cars",
            resource_type: "image",
            use_filename: true,
            unique_filename: true,
            filename_override: filename,
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(result);
          }
        );

        uploadStream.end(buffer);
      });
    } catch (error) {
      lastError = error;

      if (
        attempt < CLOUDINARY_UPLOAD_ATTEMPTS &&
        isRetryableCloudinaryError(error)
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, 500 * attempt)
        );
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

function isRetryableCloudinaryError(error) {
  return [
    "ENOTFOUND",
    "EAI_AGAIN",
    "ECONNRESET",
    "ETIMEDOUT",
    "ECONNREFUSED",
  ].includes(error?.code);
}

function getCloudinaryErrorMessage(error) {
  if (error?.code === "ENOTFOUND" || error?.code === "EAI_AGAIN") {
    return "Cloudinary could not be reached because DNS lookup failed. Check your internet connection or DNS settings and try again.";
  }

  return error?.message || "Failed to upload images";
}

async function deleteCloudinaryImages(
  publicIds
) {
  for (const publicId of publicIds) {
    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "image",
        type: "upload",
        invalidate: true,
      }
    );
  }
}
// import { NextResponse } from "next/server";
// import cloudinary from "@/lib/cloudinary";

// export const runtime = "nodejs";

// const MAX_FILES = 15;
// const MAX_FILE_SIZE = 10 * 1024 * 1024;

// const ALLOWED_TYPES = [
//   "image/jpeg",
//   "image/png",
//   "image/webp",
// ];

// export async function POST(request) {
//   try {
//     const formData = await request.formData();

//     const files = formData
//       .getAll("files")
//       .filter(
//         (file) =>
//           file &&
//           typeof file.arrayBuffer === "function"
//       );

//     if (files.length === 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Please select at least one image",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     if (files.length > MAX_FILES) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: `You can upload a maximum of ${MAX_FILES} images at once`,
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     for (const file of files) {
//       if (!ALLOWED_TYPES.includes(file.type)) {
//         return NextResponse.json(
//           {
//             success: false,
//             message:
//               "Only JPG, PNG and WebP images are allowed",
//           },
//           {
//             status: 400,
//           }
//         );
//       }

//       if (file.size > MAX_FILE_SIZE) {
//         return NextResponse.json(
//           {
//             success: false,
//             message:
//               "Each image must be smaller than 10MB",
//           },
//           {
//             status: 400,
//           }
//         );
//       }
//     }

//     const uploadedImages = [];

//     for (const file of files) {
//       const buffer = Buffer.from(
//         await file.arrayBuffer()
//       );

//       const result =
//         await uploadToCloudinary(
//           buffer,
//           file.name
//         );

//       uploadedImages.push({
//         url: result.secure_url,
//         publicId: result.public_id,
//         width: result.width,
//         height: result.height,
//         format: result.format,
//         alt: file.name,
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Images uploaded successfully",
//       data: {
//         images: uploadedImages,
//       },
//     });
//   } catch (error) {
//     console.error(
//       "Cloudinary upload error:",
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           "Failed to upload images",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

// function uploadToCloudinary(
//   buffer,
//   originalName
// ) {
//   return new Promise(
//     (resolve, reject) => {
//       const filename =
//         originalName
//           .replace(
//             /\.[^/.]+$/,
//             ""
//           )
//           .replace(
//             /[^a-zA-Z0-9-_]/g,
//             "-"
//           )
//           .toLowerCase();

//       const uploadStream =
//         cloudinary.uploader.upload_stream(
//           {
//             folder:
//               "car-dealership/cars",

//             resource_type: "image",

//             use_filename: true,

//             unique_filename: true,

//             filename_override:
//               filename,
//           },
//           (error, result) => {
//             if (error) {
//               reject(error);
//               return;
//             }

//             resolve(result);
//           }
//         );

//       uploadStream.end(buffer);
//     }
//   );
// }