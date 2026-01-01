import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that require authentication (admin only)
const isProtectedRoute = createRouteMatcher([
    "/dashboard/admin(.*)",
    "/api/admin(.*)",
]);

// Public routes that guests can access
const isPublicRoute = createRouteMatcher([
    "/",
    "/dashboard(.*)",
    "/api/grade(.*)",
    "/api/student(.*)",
    "/api/attendance(.*)",
    "/api/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    // Only protect admin routes - require authentication
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
    // All other dashboard routes are public (guest viewable)
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
