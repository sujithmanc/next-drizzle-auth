"use client";

import { useActionState } from "react";
import { loginAction } from "./action";
import Link from "next/link";

export default function LoginForm() {

  const [state, formAction, isPending] = useActionState(loginAction, {
    success: false,
    errors: {},
    message: ""
  });

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
        <p className="text-slate-500 mt-2">Please enter your details to sign in</p>
      </div>

      <form action={formAction} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800"
          />
          {state.errors?.email && (
            <p className="text-red-500 text-xs mt-1">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
          </div>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800"
          />
          {state.errors?.password && (
            <p className="text-red-500 text-xs mt-1">{state.errors.password[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-md transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>

        {state.message && (
          <div className={`text-center p-3 rounded-md text-sm font-medium ${state.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
            {state.message}
          </div>
        )}
      </form>

      <p className="text-center text-sm text-slate-600 mt-8">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}