"use server";

import { db2 } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const signupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    role: z.enum(['guest', 'user', 'admin']).default('guest'),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signupAction(prevState, formData) {
    const rawData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        role: formData.get("role"),
        password: formData.get("password"),
    };

    console.log('[Signup Action] Raw Data:', rawData);

    const validated = signupSchema.safeParse(rawData);

    console.log('[Signup Action] Validation Result:', validated);

    if (!validated.success) {
        console.error('[Signup Action] Validation Errors:', validated.error.flatten().fieldErrors);
        return {
            success: false,
            errors: validated.error.flatten().fieldErrors,
        };
    }

    console.info('[Signup Action] Validated Data:', validated.data);

    try {
        await db2.insert(users).values(validated.data);

        revalidatePath("/");
        return { success: true, message: "User registered successfully!" };
    } catch (error) {
        console.error('[Signup Action] Database Error:', error);
        if (error.message.includes("Duplicate entry")) {
            return { success: false, message: "This email is already registered." };
        }
        return { success: false, message: "Something went wrong. Please try again." };
    }
}