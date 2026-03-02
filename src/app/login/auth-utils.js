import { userRoles } from "@/drizzle/schema";
import { redisClient } from "@/redis/redis";
import crypto from "crypto";
import { cookies } from "next/headers";
import z from "zod";

const SESSION_EXPIRATION_SECONDS = 60 * 5; // 5 Minutes
const COOKIE_SESSION_KEY = "session-id";

const sessionSchema = z.object({
    id: z.string(),
    role: z.enum(userRoles),
});

export async function createSessionForUser(user) {
    // Generate a secure random ID
    const sessionId = generateSessionId();

    // Store session in Redis
    await setRedisSession(sessionId, user);

    // Set cookie with session ID
    await setSessionCookie(sessionId);
    
    return sessionId;
}

export function generateSessionId() {
    return crypto.randomBytes(100).toString("hex").normalize();
}

export async function setSessionCookie(sessionId) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_SESSION_KEY, sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // maxAge correctly uses seconds
        maxAge: SESSION_EXPIRATION_SECONDS,
    });
}

export async function setRedisSession(sessionId, user) {
    // Ensure the user object matches the schema before saving
    const validatedUser = sessionSchema.parse({
        ...user,
        id: user.id.toString(), // Ensure ID is a string for Zod
    });

    await redisClient.set(`session:${sessionId}`, validatedUser, {
        ex: SESSION_EXPIRATION_SECONDS,
    });
}

export function formatZodErrors(error) {
    return error.flatten().fieldErrors;
}