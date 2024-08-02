"use client"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from '@auth0/nextjs-auth0/client';

function Navbar() {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  const handleLogout = async () => {
    try {
      // Redirigir al endpoint de logout de Auth0
      window.location.href = '/api/auth/logout'; // Esto redirige al endpoint de logout de Auth0
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#4b0026] via-[#800020] to-[#a52a2a] border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image
            src="https://static.vecteezy.com/system/resources/previews/013/223/358/non_2x/wine-logo-template-design-with-wine-glasses-and-bottles-logo-for-nightclub-bar-and-wine-shop-free-vector.jpg"
            className="h-8"
            alt="Logo"
            width={30}
            height={30}
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            Dionysio Wine
          </span>
        </a>

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-transparent md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 items-center">
            <li>
              <Link href="/" className="block py-2 px-3 text-white rounded hover:bg-[#800020] md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/products" className="block py-2 px-3 text-white rounded hover:bg-[#800020] md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0">
                Productos
              </Link>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-white rounded hover:bg-[#800020] md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0">
                Servicios
              </a>
            </li>
            <li>
              <Link href="/about-us" className="block py-2 px-3 text-white rounded hover:bg-[#800020] md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0">
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-white rounded hover:bg-[#800020] md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0">
                Contacto
              </a>
            </li>
            <li>
            {user ? (
              <Link href="/user-dashboard" className="block py-2 px-3 text-white rounded hover:bg-[#800020] md:hover:bg-transparent md:border-0 md:hover:text-gray-400 md:p-0">
                Mi perfil
              </Link>
              ) : (
                <></>
            )}    
              </li>
              <li>
            <div className="flex items-center px-4">
              <Link href="/cart">
                <Image src="/carrito.png" alt="cart" width={30} height={30} className="cursor-pointer" />
              </Link>    
            </div>
            </li>
            <li>
            {user ? (
                
              <button
                onClick={handleLogout}
                className="text-white p-2 rounded hover:bg-[#800020]"
              >
                Logout
              </button>
             
            ) : (
              <Link className="text-white p-2 rounded hover:bg-[#800020]" href="/api/auth/login">
                Login
              </Link>
            )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;