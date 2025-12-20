'use client'
import { type Metadata } from "next";
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'

import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/navbar";
import { usePathname } from "next/navigation";
import Footer from "@/components/footer";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});




export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const path = usePathname();
    let isAdminRoute: boolean;
    let isWelcomeRoute: boolean;
    if (path.startsWith("/admin")) {
        isAdminRoute = true;
    }
    else {
        isAdminRoute = false;
    }
    if (path === "/") {
        isWelcomeRoute = true;
    }
    else {
        isWelcomeRoute = false;
    }
    return (
        <ClerkProvider>
            <html lang="en" className="dark">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <Toaster/>
                    {!isAdminRoute && !isWelcomeRoute && <Navbar />}
                    {children}
                    {!isAdminRoute && !isWelcomeRoute && <Footer />}

                </body>
            </html>
        </ClerkProvider>
    );
}
