import { NextResponse } from "next/server";
import { getProjects, updateProjects } from "@/lib/storage";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ ok: true, projects: await getProjects() });
}

export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  const projects = await req.json();
  await updateProjects(projects);
  return NextResponse.json({ ok: true });
}
