import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log("[MIDDLEWARE] Starting middleware check for path:", request.nextUrl.pathname);
  
  // Kiểm tra nếu đường dẫn là lecture hoặc quiz
  if (
    request.nextUrl.pathname.includes('/courses/') &&
    (request.nextUrl.pathname.includes('/curricula/lecture/') || 
     request.nextUrl.pathname.includes('/curricula/quiz/'))
  ) {
    // Lấy courseId từ URL
    const urlParts = request.nextUrl.pathname.split('/');
    const courseId = urlParts[2]; // /courses/[courseId]/curricula/...
    console.log("[MIDDLEWARE] Detected courseId:", courseId);
    
    // Kiểm tra authorization header thay vì cookies
    // Middleware không thể truy cập localStorage, nhưng có thể kiểm tra header
    const authHeader = request.headers.get('authorization');
    console.log("[MIDDLEWARE] Authorization header:", authHeader);
    
    // Kiểm tra cookie cho trường hợp token được lưu ở cookie
    const accessToken = request.cookies.get('accessToken')?.value;
    const token = request.cookies.get('token')?.value;
    console.log("[MIDDLEWARE] Access token from cookie exists:", !!accessToken);
    console.log("[MIDDLEWARE] Token from cookie exists:", !!token);
    
    // Thêm log để debug
    console.log("[MIDDLEWARE] Request headers:", Object.fromEntries(request.headers.entries()));
    console.log("[MIDDLEWARE] All cookies:", Array.from(request.cookies.getAll()).map(c => `${c.name}=${c.value.substring(0, 10)}...`));
    
    // Cho phép truy cập tạm thời để debug và để xử lý lại ở client-side
    console.log("[MIDDLEWARE] Allowing access to check authentication at client-side");
    
    // Cập nhật URL với cờ requireAuth để trang client xử lý việc kiểm tra quyền truy cập
    const newUrl = new URL(request.nextUrl.pathname, request.url);
    newUrl.searchParams.set('requireAuth', 'true');
    
    // Copy tất cả các query params khác
    for (const [key, value] of request.nextUrl.searchParams.entries()) {
      if (key !== 'requireAuth') {
        newUrl.searchParams.set(key, value);
      }
    }
    
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

// Xác định các đường dẫn áp dụng middleware
export const config = {
  matcher: ['/courses/:courseId/curricula/:path*'],
};