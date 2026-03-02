import { mysqlTable, mysqlSchema, AnyMySqlColumn, foreignKey, primaryKey, int, varchar, unique, index, mysqlEnum } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const comments = mysqlTable("comments", {
    id: int().autoincrement().notNull(),
    text: varchar({ length: 256 }),
    postId: int("post_id").references(() => posts.id),
    ownerId: int("owner_id").references(() => users.id),
},
    (table) => [
        primaryKey({ columns: [table.id], name: "comments_id" }),
    ]);

export const emp = mysqlTable("emp", {
    empId: int("emp_id").notNull(),
    name: varchar({ length: 30 }).notNull(),
    email: varchar({ length: 50 }).notNull(),
    username: varchar({ length: 20 }).notNull(),
    password: varchar({ length: 20 }).notNull(),
},
    (table) => [
        primaryKey({ columns: [table.id], name: "emp_id" }),
        unique("username_UNIQUE").on(table.username),
        unique("email_UNIQUE").on(table.email),
    ]);

export const posts = mysqlTable("posts", {
    id: int().autoincrement().notNull(),
    slug: varchar({ length: 256 }),
    title: varchar({ length: 256 }),
    ownerId: int("owner_id").references(() => users.id),
},
    (table) => [
        index("title_idx").on(table.title),
        primaryKey({ columns: [table.id], name: "posts_id" }),
        unique("slug_idx").on(table.slug),
    ]);

export const users = mysqlTable("users", {
    id: int().autoincrement().notNull(),
    firstName: varchar("first_name", { length: 256 }),
    lastName: varchar("last_name", { length: 256 }),
    email: varchar({ length: 256 }).notNull(),
    invitee: int(),
    role: mysqlEnum(['guest', 'user', 'admin']).default('guest'),
    age: int(),
},
    (table) => [
        foreignKey({
            columns: [table.invitee],
            foreignColumns: [table.id],
            name: "users_invitee_users_id_fk"
        }),
        primaryKey({ columns: [table.id], name: "users_id" }),
        unique("email_idx").on(table.email),
    ]);
