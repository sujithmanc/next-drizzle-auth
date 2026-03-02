import { mysqlTable as table } from "drizzle-orm/mysql-core";
import * as t from "drizzle-orm/mysql-core";


export const userRoles = ["guest", "user", "admin"];
export const userRoleEnum = t.mysqlEnum("role", userRoles).default("guest");

export const users = table(
    "users",
    {
        id: t.int().primaryKey().autoincrement(),
        firstName: t.varchar("first_name", { length: 256 }),
        lastName: t.varchar("last_name", { length: 256 }),
        email: t.varchar({ length: 256 }).notNull(),
        password: t.varchar({ length: 256 }).notNull(),
        salt: t.varchar({ length: 256 }).notNull(),
        invitee: t.int().references(() => users.id),
        role: userRoleEnum,
    },
    (table) => [
        t.uniqueIndex("email_idx").on(table.email)
    ]
);

export const posts = table(
    "posts",
    {
        id: t.int().primaryKey().autoincrement(),
        slug: t.varchar({ length: 256 }).$default(() => generateUniqueString(16)),
        title: t.varchar({ length: 256 }),
        ownerId: t.int("owner_id").references(() => users.id),
    },
    (table) => [
        t.uniqueIndex("slug_idx").on(table.slug),
        t.index("title_idx").on(table.title),
    ]
);

export const comments = table("comments", {
    id: t.int().primaryKey().autoincrement(),
    text: t.varchar({ length: 256 }),
    postId: t.int("post_id").references(() => posts.id),
    ownerId: t.int("owner_id").references(() => users.id),
});

function generateUniqueString(length) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uniqueString = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueString += characters[randomIndex];
    }
    return uniqueString;
}