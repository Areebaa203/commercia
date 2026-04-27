import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { contentListQuerySchema } from "@/lib/validations/content";

function applyContentFilters(query, { q, type, status }) {
  let nextQuery = query;

  if (q) {
    nextQuery = nextQuery.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  if (type !== "All") {
    nextQuery = nextQuery.eq("type", type.toLowerCase());
  }

  if (status !== "All") {
    nextQuery = nextQuery.eq("status", status.toLowerCase());
  }

  return nextQuery;
}

export async function GET(request) {
  try {
    const rawQuery = Object.fromEntries(request.nextUrl.searchParams.entries());
    const result = contentListQuerySchema.safeParse(rawQuery);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid query parameters.",
          errors: result.error.fieldErrors,
        },
        { status: 422 }
      );
    }

    const filters = result.data;
    const { page, pageSize } = filters;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = await createClient();

    const contentQuery = applyContentFilters(
      supabase.from("content").select("id,title,description,type,status,thumbnail_url,views,likes,comments_count,published_at,created_at,author_id", {
        count: "exact",
      }),
      filters
    );

    const { data: contentRows, count: totalCount, error: contentError } = await contentQuery
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, to);

    if (contentError) {
      throw contentError;
    }

    const authorIds = [...new Set((contentRows || []).map((row) => row.author_id).filter(Boolean))];

    let authorMap = new Map();
    if (authorIds.length > 0) {
      const { data: profiles, error: profileError } = await supabase.from("profiles").select("id,full_name,email").in("id", authorIds);
      if (profileError) {
        throw profileError;
      }
      authorMap = new Map((profiles || []).map((p) => [p.id, p.full_name || p.email || "Unknown"]));
    }

    const content = (contentRows || []).map((row) => ({
      ...row,
      author_name: row.author_id ? authorMap.get(row.author_id) || "Unknown" : "Unknown",
    }));

    const { data: statRows, error: statsError } = await supabase
      .from("content")
      .select("status,views,likes,comments_count");

    if (statsError) {
      throw statsError;
    }

    const total = statRows?.length ?? 0;
    const totalViews = (statRows || []).reduce((sum, row) => sum + (row.views || 0), 0);
    const totalLikes = (statRows || []).reduce((sum, row) => sum + (row.likes || 0), 0);
    const totalComments = (statRows || []).reduce((sum, row) => sum + (row.comments_count || 0), 0);
    const pendingReview = (statRows || []).filter((row) => row.status === "draft").length;
    const engagementRate = totalViews > 0 ? (((totalLikes + totalComments) / totalViews) * 100).toFixed(1) : "0.0";

    return NextResponse.json(
      {
        success: true,
        data: {
          content,
          totalCount: totalCount ?? 0,
          page,
          pageSize,
          stats: {
            total,
            totalViews,
            engagementRate,
            pendingReview,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/content]", error);
    return NextResponse.json({ success: false, message: "Failed to fetch content." }, { status: 500 });
  }
}
