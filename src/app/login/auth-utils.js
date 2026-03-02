import { userRoles } from "@/drizzle/schema";
import { userService } from "@/drizzle/user-service";
import { redisClient } from "@/redis/redis";
import crypto from "crypto";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import z from "zod";
import { fi } from "zod/v4/locales";

const SESSION_EXPIRATION_SECONDS = 60 * 5; // 5 Minutes
const COOKIE_SESSION_KEY = "session-id";

const sessionSchema = z.object({
    id: z.string(),
    role: z.enum(userRoles),
});

export async function getCurrentUser({
    redirectIfNotFound = true,
}) {
    const user = await getUserFromSession();
    if (user == null) {
        if (redirectIfNotFound) {
            redirect("/login");
        }
        return null;
    };

    const loggedInUser = await userService.getOne(user.id);
    if (loggedInUser == null) {
        if (redirectIfNotFound) {
            redirect("/login");
        }
        return null;
    };

    return {
        id: loggedInUser.id,
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        email: loggedInUser.email,
        role: loggedInUser.role,
    };
}

export async function getUserFromSession() {
    const cookiesObj = await cookies();
    const sessionId = cookiesObj.get(COOKIE_SESSION_KEY)?.value
    console.log(`[Session] Retrieved session ID from cookie: ${sessionId}`)
    if (sessionId == null) return null

    return getUserSessionById(sessionId)
}

async function getUserSessionById(sessionId) {
    const rawUser = await redisClient.get(`session:${sessionId}`)
    console.log(`[Session] Retrieved session data from Redis for session ID ${sessionId}:`, rawUser);
    const parsed = sessionSchema.safeParse(rawUser);
    console.log(`[Session] Parsed session data for session ID ${sessionId}:`, JSON.stringify(parsed, null, 2));
    const { success, data: user } = parsed;
    console.info(`[Session] Session retrieval success: ${success} for session ID ${JSON.stringify(user, null, 2)}`);
    return success ? user : null
}

export async function removeUserFromSession() {
    const cookiesObj = await cookies();
    const sessionId = cookiesObj.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null

    await redisClient.del(`session:${sessionId}`)
    cookiesObj.delete(COOKIE_SESSION_KEY)
}

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