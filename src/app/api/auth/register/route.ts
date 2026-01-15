import { NextRequest, NextResponse } from "next/server";
import {
  generateVerificationToken,
  sendVerificationEmail,
} from "@/lib/nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("=== REGISTRATION DEBUG START ===");
    console.log("Request body received:", body);

    // Validate required fields
    if (
      !body.name ||
      !body.email ||
      !body.password ||
      !body.password_confirmation
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, email, password, and password confirmation are required.",
          errors: {
            name: !body.name ? ["Name is required"] : [],
            email: !body.email ? ["Email is required"] : [],
            password: !body.password ? ["Password is required"] : [],
            password_confirmation: !body.password_confirmation
              ? ["Password confirmation is required"]
              : [],
          },
        },
        { status: 400 }
      );
    }

    // Password validation
    if (body.password !== body.password_confirmation) {
      console.log("Password confirmation mismatch");
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match.",
          errors: {
            password_confirmation: [
              "The password confirmation does not match.",
            ],
          },
        },
        { status: 400 }
      );
    }

    if (body.password.length < 8) {
      console.log("Password too short");
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long.",
          errors: {
            password: ["The password must be at least 8 characters."],
          },
        },
        { status: 400 }
      );
    }

    // Phone validation
    if (body.phone && body.phone.length !== 11) {
      console.log("Invalid phone number length");
      return NextResponse.json(
        {
          success: false,
          message: "Phone number must be exactly 11 digits.",
          errors: {
            phone: ["Phone number must be exactly 11 digits."],
          },
        },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const fullUrl = `${apiUrl}/api/auth/register`;

    console.log("Attempting to connect to Laravel API at:", fullUrl);

    const requestData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || "",
      password: body.password,
      password_confirmation: body.password_confirmation,
      verification_token: verificationToken,
      verification_token_expiry: verificationTokenExpiry.toISOString(),
      email_verified: false,
    };

    console.log("Sending data to Laravel:", {
      ...requestData,
      password: "[HIDDEN]",
      password_confirmation: "[HIDDEN]",
    });

    // Send to Laravel backend
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestData),
    });

    console.log("Laravel API response status:", response.status);

    let data;
    const responseText = await response.text();
    console.log("Laravel API raw response:", responseText);

    try {
      data = JSON.parse(responseText);
      console.log("Laravel API parsed response:", data);
    } catch (parseError) {
      console.error("Failed to parse Laravel response as JSON:", parseError);

      return NextResponse.json(
        {
          success: false,
          message: "Invalid response from server.",
          error: "Invalid JSON response",
          rawResponse: responseText.substring(0, 500),
        },
        { status: 502 }
      );
    }

    // Check if Laravel registration was successful
    if (!response.ok) {
      console.log("Laravel API returned error");
      console.log("Error details:", JSON.stringify(data, null, 2));

      // Extract validation error messages
      let errorMessage = data.message || "Registration failed.";

      // If there are specific validation errors, create a readable message
      if (data.errors && Object.keys(data.errors).length > 0) {
        const errorMessages = Object.entries(data.errors)
          .map(([field, messages]) => {
            const messageArray = Array.isArray(messages)
              ? messages
              : [messages];
            return `${field}: ${messageArray.join(", ")}`;
          })
          .join("; ");
        errorMessage = errorMessages;
      }

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
          errors: data.errors || {},
        },
        { status: 200 } // Return 200 so frontend can handle it properly
      );
    }

    // Registration successful, send verification email
    try {
      await sendVerificationEmail(
        requestData.email,
        requestData.name,
        verificationToken
      );
      console.log("Verification email sent successfully");

      console.log("=== REGISTRATION DEBUG END ===");

      return NextResponse.json(
        {
          success: true,
          message:
            "Registration successful! Please check your email to verify your account.",
          data: data.data || data,
          emailSent: true,
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);

      console.log("=== REGISTRATION DEBUG END ===");

      // Still return success but note the email issue
      return NextResponse.json(
        {
          success: true,
          message:
            "Account created but verification email failed to send. Please contact support.",
          data: data.data || data,
          emailSent: false,
        },
        { status: 200 }
      );
    }
  } catch (error: unknown) {
    console.error("=== REGISTRATION ERROR ===");

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Stack trace:", error.stack);
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot connect to the server. Please make sure your Laravel backend is running.",
          error: "Connection failed to Laravel backend",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed. Please try again later.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
