import { NextResponse } from "next/server";
import { getTestimonials, updateTestimonials } from "@/lib/storage";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ ok: true, testimonials: await getTestimonials() });
}

export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  const testimonials = await req.json();
  await updateTestimonials(testimonials);
  return NextResponse.json({ ok: true });
}
