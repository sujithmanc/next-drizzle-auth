"use server";

import { comparePasswords } from "@/auth/password";
import { createUserSession } from "@/auth/session";
import { db2 } from "@/drizzle/db";
import { userRoles, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { set, z } from "zod";
import crypto from "crypto"
import { redisClient } from "@/redis/redis";


const SESSION_EXPIRATION_SECONDS = 60;
const COOKIE_SESSION_KEY = "session-id"

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const sessionSchema = z.object({
    id: z.string(),
    role: z.enum(userRoles),
});

export async function loginActionOut(prevState, formData) {
    const rawData = Object.fromEntries(formData.entries());
    const cookiesObj = await cookies();

    //const sessionId = crypto.randomBytes(100).toString("hex").normalize()
    setCookie(cookiesObj);

    return { success: true, message: "Logged in successfully!" };
}

function setCookie(cookiesObj) {
    const sessionId = crypto.randomBytes(100).toString("hex").normalize()
    cookiesObj.set('session-id', sessionId, { path: '/' });
}

export async function loginAction(prevState, formData) {

    // 1. Extract and validate form data
    const rawData = Object.fromEntries(formData.entries());

    // 2. Log the raw data for debugging
    const validated = loginSchema.safeParse(rawData);

    console.log('[Login Action] Validation Result:', JSON.stringify(validated, null, 2));

    // 3. Handle validation errors
    if (!validated.success) {
        return {
            success: false,
            errors: validated.error.flatten().fieldErrors,
        };
    }
    console.info('[Login Action] Validated Data:', validated.data);

    try {
        // 4. USER LOOKUP
        const user = await db2.query.users.findFirst({
            where: eq(users.email, validated.data.email),
        });

        console.log('[Login Action] User Lookup Result:', JSON.stringify(user, null, 2));

        // 5. USER EXISTENCE CHECK
        if (!user) {
            return { success: false, message: "Invalid email or password." };
        }
        console.info('[Login Action] User Found:', JSON.stringify(user, null, 2));

        // 6. PASSWORD VERIFICATION
        const isValid = await comparePasswords({
            password: validated.data.password,
            salt: user.salt,
            hashedPassword: user.password,
        });

        // 7. Log the password verification result
        console.info('[Login Action] Password Validation Result:', isValid);
        if (!isValid) {
            return { success: false, message: "Invalid email or password." };
        }

        user.id = user.id.toString();

        // 8. SESSION CREATION
        console.info(`[Login Action] Creating session for user ID: ${user.id}`);
        const sessionId = crypto.randomBytes(100).toString("hex").normalize();

        console.info(`[Session] Generated session ID: ${sessionId}`);
        // 9. Store session in Redis
        await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
            ex: SESSION_EXPIRATION_SECONDS, // 1 week in seconds
        })

        // 10. Set cookie with session ID
        const cookiesObj = await cookies();

        cookiesObj.set(COOKIE_SESSION_KEY, sessionId, {
            secure: true,
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: SESSION_EXPIRATION_SECONDS * 1000,
        })

        console.info(`[Session] Set session cookie with key: ${COOKIE_SESSION_KEY}`)
        // Set up session END

        return { success: true, message: "Logged in successfully!" };

        // Create session or token here if needed
    } catch (error) {
        console.error('[Login Action] Error during login process:', error);
        return { success: false, message: "Server error. Please try again later." };
    }
}