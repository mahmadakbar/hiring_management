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
  const dbData: any = {};

  if (frontendData.jobName !== undefined) dbData.jobname = frontendData.jobName;
  if (frontendData.jobType !== undefined) dbData.jobtype = frontendData.jobType;
  if (frontendData.jobDescription !== undefined)
    dbData.jobdescription = frontendData.jobDescription;
  if (frontendData.numberOfCandidatesNeeded !== undefined)
    dbData.numberofcandidatesneeded = frontendData.numberOfCandidatesNeeded;
  if (frontendData.minimumSalary !== undefined)
    dbData.minimumsalary = frontendData.minimumSalary;
  if (frontendData.maximumSalary !== undefined)
    dbData.maximumsalary = frontendData.maximumSalary;
  if (frontendData.location !== undefined)
    dbData.location = frontendData.location;
  if (frontendData.minimumProfileInformation !== undefined)
    dbData.minimumprofileinformation = frontendData.minimumProfileInformation;
  if (frontendData.status !== undefined) dbData.status = frontendData.status;

  return dbData;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("job_list")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Job not found", details: error.message },
        { status: 404 }
      );
    }

    const transformedJob = transformJobData(data);

    return NextResponse.json({ job: transformedJob }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    // Transform frontend data to database format
    const updateData = transformToDbFormat(body);

    // Update in database
    const { data, error } = await supabase
      .from("job_list")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to update job", details: error.message },
        { status: 500 }
      );
    }

    // Transform response to camelCase
    const transformedJob = transformJobData(data);

    return NextResponse.json(
      { job: transformedJob, message: "Job updated successfully" },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { error } = await supabase.from("job_list").delete().eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to delete job", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Job deleted successfully" },
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
