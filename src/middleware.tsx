import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Check if the request is for an admin route
    if (pathname.startsWith('/management/secure-gateway/4f3d5b6e-12c8-11e9-ab14-d663bd873d93')) {
        // Check for an authentication cookie
        const authCookie = req.cookies.get('auth');

        if (!authCookie) {
            // If no auth cookie, redirect to login page
            return NextResponse.redirect(new URL('/auth/user/secure-login/98a7c3d2b1f4e5', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/management/secure-gateway/4f3d5b6e-12c8-11e9-ab14-d663bd873d93/:path*'], // Specify the paths where the middleware should run
};

