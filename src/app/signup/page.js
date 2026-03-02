"use client";

import { useActionState } from "react";
import { signupAction } from "./action";

export default function SignupForm() {
    const [state, formAction, isPending] = useActionState(signupAction, {
        success: false,
        errors: {},
        message: ""
    });

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Create Account</h2>

            <form action={formAction} className="space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700">First Name</label>
                        <input
                            name="firstName"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        {state.errors?.firstName && <p className="text-red-500 text-xs mt-1">{state.errors.firstName}</p>}
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700">Last Name</label>
                        <input
                            name="lastName"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        {state.errors?.lastName && <p className="text-red-500 text-xs mt-1">{state.errors.lastName}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">Email Address</label>
                    <input
                        name="email"
                        type="email"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    {state.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <input
                        name="password"
                        type="password"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    {state.errors?.password && <p className="text-red-500 text-xs mt-1">{state.errors.password}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">Role</label>
                    <select
                        name="role"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="guest">Guest</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                    {isPending ? "Creating..." : "Register"}
                </button>

                {state.message && (
                    <div className={`p-3 rounded text-sm ${state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {state.message}
                    </div>
                )}
            </form>
        </div>
    );
}