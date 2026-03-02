"use client";

import { useActionState } from "react";
import { logoutAction } from "../actions";

export default function LogoutButton() {
    // [state, action, isPending]
    const [state, formAction, isPending] = useActionState(logoutAction, null);

    return (
        <form action={formAction}>
            <button
                type="submit"
                disabled={isPending}
                className="group relative flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Logging out...</span>
                    </>
                ) : (
                    <>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 transition-transform group-hover:-translate-x-1" 
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </>
                )}
            </button>
            {state?.message && <p className="text-red-500 text-xs mt-2">{state.message}</p>}
        </form>
    );
}