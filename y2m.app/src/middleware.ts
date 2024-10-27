import { NextRequest, NextResponse } from 'next/server';

// Helper function to extract the subdomain from the host
function getSubdomainFromHost(host: string): string | null {
  const parts = host.split('.');

  // If there's no subdomain (like localhost) or only the main domain, return null
  if (parts.length === 1 || parts[0] === 'localhost') {
    return null; // No subdomain, meaning it's the main domain
  }

  return parts[0]; // Return the subdomain, e.g., 'test1' for 'test1.localhost'
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone(); // Clone the URL for rewrites
  const host = req.headers.get('host') || ''; // Get the host, which includes subdomain
  const subdomain = getSubdomainFromHost(host); // Extract the subdomain

  if (subdomain) {
    // Store the subdomain in a cookie called 'tenant' for use across the app
    const response = NextResponse.rewrite(url);

    // Set a cookie that expires in 7 days (adjust maxAge as needed)
    response.cookies.set('tenant', subdomain, { maxAge: 60 * 60 * 24 * 7 }); // 7 days expiration

    return response; // Return the response with the subdomain stored in a cookie
  }

  // If no subdomain is present, proceed as normal
  return NextResponse.rewrite(url); // Always rewrite to the main website's content
}

export const config = {
  matcher: ['/:path*'], // Apply this middleware to all routes
};
