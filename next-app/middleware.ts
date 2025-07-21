import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if the path matches /[id] pattern
  const idMatch = pathname.match(/^\/(\d+)$/);
  
  if (idMatch) {
    const id = parseInt(idMatch[1]);
    
    // Validate that it's a positive number
    if (isNaN(id) || id <= 0) {
      return NextResponse.redirect(new URL('/404', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/:id*',
}; 