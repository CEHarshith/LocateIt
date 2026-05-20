"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function SignIn(){
    return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
        <Card className="w-full max-w-md shadow-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-black">
                    Sign In
                </CardTitle>
                <CardDescription>
                    Enter your credentials to access your account.
                </CardDescription>    
            </CardHeader>
            <form className="space-y-4">
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required className="focus:ring-profile"/>
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required minLength={8}/>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Sign In</Button>
                    <p className="text-center">
                        Don't have an account? <Link href="/sign-up" className="font-medium text-primary hover:underline">Sign Up</Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    </div>
}