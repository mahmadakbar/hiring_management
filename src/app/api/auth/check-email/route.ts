import { createClient } from "@lib/superbase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate required field
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from("user")
      .select("email, id")
      .eq("email", email)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected
      console.error("Error checking email:", checkError);
      return NextResponse.json(
        { error: "Failed to check email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        exists: !!existingUser,
        message: existingUser ? "Email exists" : "Email not found",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
