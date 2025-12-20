import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public (unprotected) routes
const isPublicRoute = createRouteMatcher([
  "/api/inngest",
  "/api/webhooks/clerk",
]);

export default clerkMiddleware((auth, req) => {
  // If NOT public, enforce auth
  if (!isPublicRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};