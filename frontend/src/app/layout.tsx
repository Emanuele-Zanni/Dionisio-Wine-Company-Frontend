import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";

import { UserProvider } from "@auth0/nextjs-auth0/client";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DW Ecommerce",
  description: "Generated by create next app",
  icons: {
    icon: "/logooo.jpg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar/>
          <main className="flex flex-grow justify-center py-5 ">{children} </main>
          <Footer/>
          </div>
        </body>
      </UserProvider>

    </html>
  );
}
