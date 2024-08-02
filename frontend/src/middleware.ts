import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

export async function middleware(request: NextRequest) {
  const jwt = request.headers.get('Authorization')?.replace('Bearer ', '');
  const authCookie = request.cookies.get('auth0.is.authenticated')?.value;

  if (jwt) {
    try {
      const decodedToken = JSON.parse(atob(jwt.split('.')[1]));
      const isAdmin = decodedToken.isAdmin;

      if (isAdmin && !request.nextUrl.pathname.startsWith('/admin-dashboard')) {
        return NextResponse.redirect(new URL('/admin-dashboard', request.url));
      } else if (!isAdmin && !request.nextUrl.pathname.startsWith('/user-dashboard')) {
        return NextResponse.redirect(new URL('/user-dashboard', request.url));
      }
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return NextResponse.next();
    }
  } else if (authCookie) {
    try {
      const response = await axios.post('/api-vinos/auth/user', {
        // Aquí asume que tienes acceso a los datos del usuario desde la cookie o de algún otro medio
        // Si necesitas pasar más datos, ajusta esto de acuerdo a tu backend
        id: request.cookies.get('sub')?.value,
        name: request.cookies.get('name')?.value,
        email: request.cookies.get('email')?.value,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authCookie}`,
        }
      });

      const newJwt = response.data.token;

      // Guardar el nuevo JWT en localStorage
      request.headers.set('Authorization', `Bearer ${newJwt}`);

      const decodedToken = JSON.parse(atob(newJwt.split('.')[1]));
      const isAdmin = decodedToken.isAdmin;

      if (isAdmin && !request.nextUrl.pathname.startsWith('/admin-dashboard')) {
        return NextResponse.redirect(new URL('/admin-dashboard', request.url));
      } else if (!isAdmin && !request.nextUrl.pathname.startsWith('/user-dashboard')) {
        return NextResponse.redirect(new URL('/user-dashboard', request.url));
      }
    } catch (error) {
      console.error('Error posting user:', error);
      return NextResponse.next();
    }
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/user-dashboard', '/admin-dashboard'],
};



//OTRA OPCION

/*

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const jwt = request.headers.get('Authorization')?.replace('Bearer ', '');
  const authCookie = request.cookies.get('auth0.is.authenticated')?.value;

  // Verificar si hay JWT en localStorage
  if (jwt) {
    try {
      // Aquí puedes agregar lógica para verificar el JWT si es necesario
      const decodedToken = JSON.parse(atob(jwt.split('.')[1]));
      const isAdmin = decodedToken.isAdmin;

      // Redirigir según el rol de usuario
      if (isAdmin && !request.nextUrl.pathname.startsWith('/admin-dashboard')) {
        return NextResponse.redirect(new URL('/admin-dashboard', request.url));
      } else if (!isAdmin && !request.nextUrl.pathname.startsWith('/user-dashboard')) {
        return NextResponse.redirect(new URL('/user-dashboard', request.url));
      }
    } catch (error) {
      // Manejo de errores de decodificación del JWT
      console.error('Error decoding JWT:', error);
      return NextResponse.next();
    }
  } else if (authCookie) {
    // Si no hay JWT en localStorage pero hay una cookie de Auth0, hacer un POST para obtener el JWT
    const userResponse = await fetch('https://tu-endpoint-de-backend.com/auth/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authCookie}`
      },
      body: JSON.stringify({ authCookie })
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      const newJwt = userData.token;

      // Guardar el nuevo JWT en localStorage
      request.headers.set('Authorization', `Bearer ${newJwt}`);

      // Redirigir según el rol de usuario
      const decodedToken = JSON.parse(atob(newJwt.split('.')[1]));
      const isAdmin = decodedToken.isAdmin;

      if (isAdmin && !request.nextUrl.pathname.startsWith('/admin-dashboard')) {
        return NextResponse.redirect(new URL('/admin-dashboard', request.url));
      } else if (!isAdmin && !request.nextUrl.pathname.startsWith('/user-dashboard')) {
        return NextResponse.redirect(new URL('/user-dashboard', request.url));
      }
    } else {
      return NextResponse.next();
    }
  } else {
    // Si no hay JWT ni cookie, permitir que el usuario permanezca en la página
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/user-dashboard', '/admin-dashboard'],
};

*/