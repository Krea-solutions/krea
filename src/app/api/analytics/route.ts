import { NextResponse } from "next/server";
import { getSettings } from "@/lib/storage";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });

  const settings = await getSettings();
  const { yandexMetrikaId, yandexMetrikaToken } = settings;

  if (!yandexMetrikaId || !yandexMetrikaToken) {
    return NextResponse.json({ ok: false, error: "not_configured" });
  }

  try {
    const url = new URL("https://api-metrika.yandex.net/stat/v1/data");
    url.searchParams.set("ids", yandexMetrikaId);
    url.searchParams.set(
      "metrics",
      "ym:s:visits,ym:s:users,ym:s:pageviews,ym:s:bounceRate,ym:s:avgVisitDurationSeconds",
    );
    url.searchParams.set("date1", "7daysAgo");
    url.searchParams.set("date2", "today");
    url.searchParams.set("accuracy", "full");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `OAuth ${yandexMetrikaToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ ok: false, error: `yandex_${res.status}`, detail: text });
    }

    const data = await res.json();
    const totals = data?.totals || [];
    return NextResponse.json({
      ok: true,
      data: {
        visits: totals[0] ?? 0,
        users: totals[1] ?? 0,
        pageviews: totals[2] ?? 0,
        bounceRate: totals[3] ?? 0,
        avgDuration: totals[4] ?? 0,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "fetch_error" });
  }
}
