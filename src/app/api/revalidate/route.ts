import { revalidateTag, revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tag, path } = body;

        // ✅ Handle tags (can be string or array)
        if (tag) {
            const tags = Array.isArray(tag) ? tag : [tag];
            tags.forEach((t) => {
                revalidateTag(t);
            });
        }

        // ✅ Handle paths (can be string or array)
        if (path) {
            const paths = Array.isArray(path) ? path : [path];
            paths.forEach((p) => {
                revalidatePath(p);
            });
        }

        return NextResponse.json({
            revalidated: true,
            now: Date.now(),
            tags: Array.isArray(tag) ? tag : [tag],
            paths: Array.isArray(path) ? path : [path],
        });
    } catch (err) {
        console.error("Revalidation error:", err);
        return NextResponse.json(
            {
                revalidated: false,
                error: "Error revalidating",
                details: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
