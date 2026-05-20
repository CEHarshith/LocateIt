"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function SignUp(){
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
            <form className="space-y-4">
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" type="text" placeholder="Your Name" required />
                    </div>
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
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Sign Up</Button>
                    <p className="text-center">
                        Already have an account? <Link href="/sign-in" className="font-medium text-primary hover:underline">Sign In</Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    </div>
}
