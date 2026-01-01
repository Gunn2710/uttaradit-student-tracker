import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
    const { userId } = await auth();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background p-4">
            <h1 className="text-4xl font-bold text-foreground text-center">
                Uttaradit Student Tracker
            </h1>
            <p className="text-muted-foreground text-lg text-center">
                Track student attendance with ease
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
                <SignedOut>
                    <SignInButton mode="modal">
                        <Button variant="default">Sign In</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <Button variant="outline">Sign Up</Button>
                    </SignUpButton>
                    <Link href="/dashboard">
                        <Button variant="secondary">Continue as Guest</Button>
                    </Link>
                </SignedOut>
                <SignedIn>
                    <Link href="/dashboard">
                        <Button>Go to Dashboard</Button>
                    </Link>
                </SignedIn>
            </div>
        </div>
    );
}
