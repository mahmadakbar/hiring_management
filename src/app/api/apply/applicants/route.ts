import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@lib/superbase/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Helper function to transform database row to camelCase (for response)
function transformApplicationData(dbApp: any) {
  return {
    id: dbApp.id,
    userId: dbApp.user_id,
    jobId: dbApp.job_id,
    photoProfile: dbApp.photoprofile,
    fullName: dbApp.fullname,
    dateOfBirth: dbApp.dateofbirth,
    gender: dbApp.gender,
    domicile: dbApp.domicile,
    phoneNumber: dbApp.phonenumber,
    countryCode: dbApp.countrycode,
    email: dbApp.email,
    linkedinLink: dbApp.linkedinlink,
    createdAt: dbApp.createdat,
  };
}

// GET endpoint to fetch all applicants for a specific job (admin view)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    // TODO: Add role check for admin access
    // For now, we'll allow any authenticated user, but you should add role verification

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Fetch all applications for this job
    const { data, error } = await supabase
      .from("user_apply")
      .select("*")
      .eq("job_id", jobId)
      .order("createdat", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch applicants", details: error.message },
        { status: 500 }
      );
    }

    // Transform the data to camelCase for frontend
    const transformedApplications = data?.map(transformApplicationData) || [];

    return NextResponse.json(
      {
        applicants: transformedApplications,
        count: transformedApplications.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
