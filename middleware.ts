
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add custom logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Public routes that don't require authentication
        if (['/login', '/signup', '/'].includes(pathname)) {
          return true
        }
        
        // Protected routes require token
        if (pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN'
        }
        
        if (pathname.startsWith('/dashboard')) {
          return !!token && token.role === 'STUDENT'
        }
        
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*']
}
