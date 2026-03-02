import { userRoles } from "@/drizzle/schema"
import { z } from "zod"
import crypto from "crypto"
import { redisClient } from "@/redis/redis"

// Seven days in seconds
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7
const COOKIE_SESSION_KEY = "session-id"

const sessionSchema = z.object({
    id: z.string(),
    role: z.enum(userRoles),
})

export function getUserFromSession(cookies) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
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
    const sessionId = crypto.randomBytes(512).toString("hex").normalize()
    await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
        ex: SESSION_EXPIRATION_SECONDS,
    })

    setCookie(sessionId, cookies)
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

function setCookie(sessionId, cookies) {
    cookies.set(COOKIE_SESSION_KEY, sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
    })
}

async function getUserSessionById(sessionId) {
    const rawUser = await redisClient.get(`session:${sessionId}`)

    const { success, data: user } = sessionSchema.safeParse(rawUser)

    return success ? user : null
}