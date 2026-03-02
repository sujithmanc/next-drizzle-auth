"use server";

import { generateSalt, hashPassword } from "@/auth/password";
import { createUserSession } from "@/auth/session";
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
    salt: z.string().min(1, "Salt is required"),
});

export async function signupAction(prevState, formData) {
    const rawData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        role: formData.get("role"),
        password: formData.get("password"),
    };

    rawData.salt = generateSalt();

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
        // Encrypt password

        validated.data.password = await hashPassword(validated.data.password, validated.data.salt);
        console.info('[Signup Action] Hashed Password and salt:', validated);

        const result = await db2.insert(users).values(validated.data);
        console.log('[Signup Action] Insert Result:', result);

        // Create a session or token here if needed
        createUserSession({ id: result.insertId, role: validated.data.role }, formData.cookies);

        revalidatePath("/");
        return { success: true, message: "User registered successfully!" };
    } catch (error) {
        // Extrat simple text/info from the error object for better logging
        console.log('[Signup Action] Error Details:', JSON.stringify(error, null, 2));

        if (error.cause.sqlMessage.includes("Duplicate entry")) {
            return { success: false, message: "This email is already registered." };
        }
        return { success: false, message: "Something went wrong. Please try again." };
    }
}   