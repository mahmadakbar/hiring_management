import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@lib/superbase/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Helper function to transform frontend data to database format (lowercase)
function transformToDbFormat(frontendData: any, userId: string, jobId: string) {
  return {
    user_id: userId,
    job_id: jobId,
    photoprofile: frontendData.photoProfile || null,
    fullname: frontendData.fullName,
    dateofbirth: frontendData.dateOfBirth
      ? new Date(frontendData.dateOfBirth).toISOString().split("T")[0]
      : null,
    gender: frontendData.gender || null,
    domicile: frontendData.domicile || null,
    phonenumber: frontendData.phoneNumber?.number || null,
    countrycode: frontendData.phoneNumber?.countryCode || "+62",
    email: frontendData.email,
    linkedinlink: frontendData.linkedinLink || null,
  };
}

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

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { jobId, ...applicationData } = body;

    // Validate required fields
    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Check if user has already applied to this job
    const { data: existingApplication, error: checkError } = await supabase
      .from("user_apply")
      .select("id")
      .eq("user_id", userId)
      .eq("job_id", jobId)
      .single();

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 409 }
      );
    }

    // Transform data to database format
    const dbData = transformToDbFormat(applicationData, userId, jobId);

    // Insert into database
    const { data, error } = await supabase
      .from("user_apply")
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to submit application", details: error.message },
        { status: 500 }
      );
    }

    // Update user_applied_list table (create or update)
    try {
      // Convert jobId to number (it comes as string from query param)
      const jobIdNumber = parseInt(jobId);

      if (isNaN(jobIdNumber)) {
        console.error("Invalid jobId format:", jobId);
        throw new Error("Invalid job ID format");
      }

      // Check if user_applied_list record exists for this user
      const { data: existingList, error: listCheckError } = await supabase
        .from("user_applied_list")
        .select("id, appliedjobs")
        .eq("user_id", userId)
        .single();

      if (existingList) {
        // User record exists - update the appliedjobs array
        let currentJobs: number[] = [];

        // Parse appliedjobs - handle both string and array formats
        if (typeof existingList.appliedjobs === "string") {
          try {
            const parsed = JSON.parse(existingList.appliedjobs);
            currentJobs = Array.isArray(parsed)
              ? parsed.map(Number)
              : [Number(parsed)].filter(n => !isNaN(n));
          } catch {
            currentJobs = [];
          }
        } else if (Array.isArray(existingList.appliedjobs)) {
          currentJobs = existingList.appliedjobs
            .map(Number)
            .filter(n => !isNaN(n));
        }

        // Add new jobId if not already in the array
        if (!currentJobs.includes(jobIdNumber)) {
          currentJobs.push(jobIdNumber);
        }

        // Update the record with new array as JSON string with numeric values
        const { error: updateError } = await supabase
          .from("user_applied_list")
          .update({ appliedjobs: JSON.stringify(currentJobs) })
          .eq("user_id", userId);

        if (updateError) {
          console.error("Failed to update user_applied_list:", updateError);
          console.error("Update error details:", updateError.message);
        } else {
          console.log(
            "Successfully updated user_applied_list with jobs:",
            currentJobs
          );
        }
      } else {
        // User record doesn't exist - create new record
        const newRecord = {
          user_id: userId,
          appliedjobs: JSON.stringify([jobIdNumber]),
        };

        console.log("Inserting new user_applied_list record:", newRecord);

        const { error: insertError, data: insertData } = await supabase
          .from("user_applied_list")
          .insert([newRecord])
          .select();

        if (insertError) {
          console.error(
            "Failed to insert into user_applied_list:",
            insertError
          );
          console.error("Insert error details:", insertError.message);
          console.error("Insert error hint:", insertError.hint);
        } else {
          console.log("Successfully inserted user_applied_list:", insertData);
        }
      }
    } catch (listError) {
      // Log error but don't fail the main application submission
      console.error("Error managing user_applied_list:", listError);
    }

    // Transform response to camelCase
    const transformedApplication = transformApplicationData(data);

    return NextResponse.json(
      {
        application: transformedApplication,
        message: "Application submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch user's applications
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

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    let query = supabase.from("user_apply").select("*").eq("user_id", userId);

    if (jobId) {
      query = query.eq("job_id", jobId);
    }

    query = query.order("createdat", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch applications", details: error.message },
        { status: 500 }
      );
    }

    // Transform the data to camelCase for frontend
    const transformedApplications = data?.map(transformApplicationData) || [];

    return NextResponse.json(
      { applications: transformedApplications },
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
