"use server";

import { auth } from "../auth";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";

export const signUp = async (email: string, password: string, name: string) => {
    try {
        const result = await auth.api.signUpEmail({
            body: { email, password, name, callbackURL: "/home" },
        });
        return { user: result.user, error: null };
    } catch (err) {
        if (err instanceof APIError) {
            if (err.body?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
                return { user: null, error: "An account with this email already exists." };
            }
            return { user: null, error: err.body?.message || "Something went wrong. Please try again." };
        }
        return { user: null, error: "Something went wrong. Please try again." };
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        const result = await auth.api.signInEmail({
            body: { email, password, callbackURL: "/home" },
        });
        return { user: result.user, error: null };
    } catch (err) {
        if (err instanceof APIError) {
            return { user: null, error: err.body?.message || "Invalid email or password." };
        }
        return { user: null, error: "Something went wrong. Please try again." };
    }
};

export const signOut = async () => {
    const result = await auth.api.signOut({ headers: await headers() });
    return result;
};