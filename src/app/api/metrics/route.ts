import { NextResponse } from "next/server";
import { getMetrics, updateMetrics } from "@/lib/storage";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ ok: true, metrics: await getMetrics() });
}

export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  const metrics = await req.json();
  await updateMetrics(metrics);
  return NextResponse.json({ ok: true });
}
