import { betterAuth } from "better-auth";
import { nextCookies } from 'better-auth/next-js'
import { Pool } from "@neondatabase/serverless";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [nextCookies()]
});
