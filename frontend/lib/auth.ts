/*import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaClient } from "@/lib/generated/prisma/client";
import { nextCookies } from 'better-auth/next-js'
import { PrismaNeon } from "@prisma/adapter-neon"

const adapter = new PrismaNeon({ 
    connectionString: process.env.DATABASE_URL 
})

const prisma = new PrismaClient({ adapter })
export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [nextCookies()]
}
); */

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
