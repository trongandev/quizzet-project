import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // ✅ 1. Static assets caching
    if (request.nextUrl.pathname.startsWith("/_next/static/")) {
        response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
        return response;
    }

    // ✅ 2. API routes caching
    if (request.nextUrl.pathname.startsWith("/api/")) {
        // Cache API responses
        response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
        return response;
    }

    // ✅ 3. Flashcard pages caching
    if (request.nextUrl.pathname.startsWith("/flashcard/")) {
        response.headers.set("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=3600");
        return response;
    }

    // ✅ 4. Quiz pages caching
    if (request.nextUrl.pathname.startsWith("/quiz/")) {
        response.headers.set("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=3600");
        return response;
    }

    // ✅ 5. General page caching
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

    return response;
}

// ✅ 6. Configure matcher để tránh unnecessary runs
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
