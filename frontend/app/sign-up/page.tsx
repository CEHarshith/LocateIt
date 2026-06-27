"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useState } from "react";
import { signUp } from "@/lib/actions/auth-actions";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignUp(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const result = await signUp(email, password, name);
            if(!result.user){
                setError("Failed to create account");
            }else{
                router.push("/");
                authClient.$store.notify("$sessionSignal");
            }
        } catch(err){
            setError(err instanceof Error ? err.message : "An unexpected error occured");
        } finally{
            setLoading(false);
        }
    }

    return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
        <Card className="w-full max-w-md shadow-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-black">
                    Sign Up
                </CardTitle>
                <CardDescription>
                    Create an account to start finding locations.
                </CardDescription>    
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}/>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                        {loading ? "Creating account..." : "Sign Up"}
                    </Button>
                    <p className="text-center">
                        Already have an account? <Link href="/sign-in" className="font-medium text-primary hover:underline">Sign In</Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    </div>
}
