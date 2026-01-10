'use client'
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const path = usePathname();
    const isAdminRoute = path.startsWith("/admin");
    const isWelcomeRoute = path === "/";

    return (
        <>
            {!isAdminRoute && !isWelcomeRoute && <Navbar />}
            {children}
            {!isAdminRoute && !isWelcomeRoute && <Footer />}
        </>
    );
}