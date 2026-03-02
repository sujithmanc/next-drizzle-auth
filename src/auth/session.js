
import { z } from "zod"
import crypto from "crypto"
import { redisClient } from "@/redis/redis"
import { userRoles } from "@/drizzle/schema"

// Seven days in seconds
const SESSION_EXPIRATION_SECONDS = 60 * 5
const COOKIE_SESSION_KEY = "session-id"

const sessionSchema = z.object({
    id: z.string(),
    role: z.enum(userRoles),
})

export function getUserFromSession(cookies) {

    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    console.log(`[Session] Retrieved session ID from cookie: ${sessionId}`)
    if (sessionId == null) return null

    return getUserSessionById(sessionId)
}

export async function updateUserSessionData(user, cookies) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null

    await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
        ex: SESSION_EXPIRATION_SECONDS,
    })
}

export async function createUserSession(user, cookies) {
    // 8. SESSION CREATION
    console.info(`[Login Action] Creating session for user ID: ${user.id}`);
    const sessionId = crypto.randomBytes(100).toString("hex").normalize();

    console.info(`[Session] Generated session ID: ${sessionId}`);
    // 9. Store session in Redis
    await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
        ex: SESSION_EXPIRATION_SECONDS, // 1 week in seconds
    })

    // 10. Set cookie with session ID

    cookies.set(COOKIE_SESSION_KEY, sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_EXPIRATION_SECONDS * 1000,
    })
}

export async function updateUserSessionExpiration(cookies) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null

    const user = await getUserSessionById(sessionId)
    if (user == null) return

    await redisClient.set(`session:${sessionId}`, user, {
        ex: SESSION_EXPIRATION_SECONDS,
    })
    setCookie(sessionId, cookies)
}

export async function removeUserFromSession(cookies) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null

    await redisClient.del(`session:${sessionId}`)
    cookies.delete(COOKIE_SESSION_KEY)
}

function setCookieOut(sessionId, cookies) {
    console.log(`[Session] Set cookie with session ID START`)

    cookieStore.set(COOKIE_SESSION_KEY, sessionId, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    })


    console.log(`[Session] Set cookie with session ID END`)
}

function setCookie(sessionId, cookieStore) {
    console.log(`[Session] Attempting to set cookie...`, { sessionId });
    cookieStore.set(COOKIE_SESSION_KEY, sessionId, {
        httpOnly: true,
        path: "/"
    });

    // 2. Verification Check
    const check = cookieStore.get(COOKIE_SESSION_KEY);

    if (!check || check.value !== sessionId) {
        console.error(`[Session] Failed to verify cookie after setting!`);
        throw new Error("Failed to set session cookie. Please check if this function is called inside a Server Action or Route Handler.");
    }

    console.log(`[Session] Cookie verified successfully.`);
}

async function getUserSessionById(sessionId) {
    const rawUser = await redisClient.get(`session:${sessionId}`)
    console.log(`[Session] Retrieved session data from Redis for session ID ${sessionId}:`, rawUser)
    const { success, data: user } = sessionSchema.safeParse(rawUser)

    return success ? user : null
}