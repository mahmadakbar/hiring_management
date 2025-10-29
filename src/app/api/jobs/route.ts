import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@lib/superbase/server";

// Helper function to transform database row to camelCase
function transformJobData(dbJob: any) {
  return {
    id: dbJob.id,
    jobName: dbJob.jobname,
    jobType: dbJob.jobtype,
    jobDescription: dbJob.jobdescription,
    numberOfCandidatesNeeded: dbJob.numberofcandidatesneeded,
    minimumSalary: dbJob.minimumsalary,
    maximumSalary: dbJob.maximumsalary,
    location: dbJob.location,
    minimumProfileInformation: dbJob.minimumprofileinformation,
    createdAt: dbJob.createdat,
    status: dbJob.status,
  };
}

// Helper function to transform frontend data to database format
function transformToDbFormat(frontendData: any) {
  return {
    jobid: frontendData.jobId || crypto.randomUUID(),
    jobname: frontendData.jobName,
    jobtype: frontendData.jobType,
    jobdescription: frontendData.jobDescription,
    numberofcandidatesneeded: frontendData.numberOfCandidatesNeeded,
    minimumsalary: frontendData.minimumSalary,
    maximumsalary: frontendData.maximumSalary,
    location: frontendData.location,
    minimumprofileinformation: frontendData.minimumProfileInformation,
    status: frontendData.status,
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get query parameters for filtering, pagination, etc.
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build query - use lowercase column names
    let query = supabase.from("job_list").select("*");

    // Apply filters if provided
    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(
        `jobname.ilike.%${search}%,jobdescription.ilike.%${search}%,location.ilike.%${search}%`
      );
    }

    // Order by creation date (newest first) - use lowercase
    query = query.order("createdat", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch jobs", details: error.message },
        { status: 500 }
      );
    }

    // Transform the data to camelCase for frontend
    const transformedJobs = data?.map(transformJobData) || [];

    return NextResponse.json({ jobs: transformedJobs }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Generate UUID for jobid
    const jobId = crypto.randomUUID();
    const jobData = transformToDbFormat({
      ...body,
      jobId: jobId,
    });

    // Insert into database (id will auto-increment, jobid is the UUID)
    const { data, error } = await supabase
      .from("job_list")
      .insert([jobData])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create job", details: error.message },
        { status: 500 }
      );
    }

    // Transform response to camelCase
    const transformedJob = transformJobData(data);

    return NextResponse.json(
      { job: transformedJob, message: "Job created successfully" },
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
