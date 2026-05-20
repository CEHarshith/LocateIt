"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useState } from "react";

export default function SignUp(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.ChangeEvent) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            
        } catch(err){
            setError("An unexpected error occured");
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
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Sign Up</Button>
                    <p className="text-center">
                        Already have an account? <Link href="/sign-in" className="font-medium text-primary hover:underline">Sign In</Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    </div>
}
