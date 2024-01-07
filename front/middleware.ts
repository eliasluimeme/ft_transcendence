import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose'

export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  }

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;

    if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/chat' || request.nextUrl.pathname === '/game' || request.nextUrl.pathname === '/settings') {
      try {
        await jwtVerify(token!, new TextEncoder().encode(process.env.JWT_SECRET));

        return NextResponse.next();
      } catch (error) {
        //(error);
        return NextResponse.redirect(process.env.FRONTEND_URL +  'Login');
      }
  }

  if (request.nextUrl.pathname === '/Login') {
    try {
      await jwtVerify(token!, new TextEncoder().encode(process.env.JWT_SECRET));
      return NextResponse.redirect(process.env.FRONTEND_URL + '');
    } catch (error) {
        //(error);
        return NextResponse.next();
    }
  }

  // if (request.nextUrl.pathname === '/Login') {
  //   try {
  //     await jwtVerify(token!, new TextEncoder().encode(process.env.JWT_SECRET));
  //     return NextResponse.redirect('process.env.FRONTEND_URL +  '');
  //   } catch (error) {
  //       //(error);
  //       return NextResponse.next();
  //   }
  // }
  return NextResponse.next();
}
