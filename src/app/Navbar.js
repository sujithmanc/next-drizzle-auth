"use client";

import LogoutButton from "@/features/auth/components/LogoutButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ user }) {
    const pathname = usePathname();

    // Helper to apply active styles
    const linkStyles = (path) => {
        const isActive = pathname === path;
        return `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`;
    };

    return (
        <nav className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Brand/Logo */}
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    AppLogo
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-2">
                    {user ? (
                        <>
                            {/* User Email Badge */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full mr-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Online" />
                                <span className="text-xs font-medium text-slate-600 truncate max-w-[150px]">
                                    {user.email}
                                </span>
                            </div>

                            <Link href="/profile" className={linkStyles("/profile")}>
                                Profile
                            </Link>
                            <Link href="/settings" className={linkStyles("/settings")}>
                                Settings
                            </Link>

                            <div className="h-6 w-[1px] bg-slate-200 mx-2" />
                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={linkStyles("/login")}>
                                Login
                            </Link>
                            <Link href="/signup" className={linkStyles("/signup")}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}