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
import LayoutWrapper from "@/components/layout-wrapper";
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
    return (
        <ClerkProvider>
            <html lang="en" className="dark">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <Toaster/>
                    <LayoutWrapper>{children}</LayoutWrapper>
                </body>
            </html>
        </ClerkProvider>
    );
}
