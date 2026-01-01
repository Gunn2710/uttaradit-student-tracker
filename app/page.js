import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();
  
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background">
      <h1 className="text-4xl font-bold text-foreground">
        Uttaradit Student Tracker
      </h1>
      <p className="text-muted-foreground text-lg">
        Track student attendance with ease
      </p>
      <div className="flex gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="default">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="outline">Sign Up</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <Button onClick={() => redirect('/dashboard')}>
            Go to Dashboard
          </Button>
        </SignedIn>
      </div>
    </div>
  );
}
