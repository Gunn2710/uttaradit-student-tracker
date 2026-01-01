import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    const { userId } = await auth();

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:pl-16 bg-background">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-0 max-w-6xl w-full">
                {/* Left - Photo */}
                <div className="flex-1 flex justify-center md:pr-8">
                    <div className="relative w-full max-w-xl aspect-video rounded-xl overflow-hidden shadow-xl">
                        <Image 
                            src="/home-photo.jpg" 
                            alt="โรงเรียนอุตรดิตถ์ / Uttaradit School"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-80 bg-border"></div>
                <div className="md:hidden w-full h-px bg-border"></div>

                {/* Right - Sign In */}
                <div className="flex-1 flex flex-col items-center md:items-start gap-6 md:pl-8">
                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-3xl font-bold text-foreground">
                            ระบบติดตามนักเรียนอุตรดิตถ์
                        </h1>
                        <h2 className="text-xl text-foreground">
                            Uttaradit Student Tracker
                        </h2>
                        <p className="text-muted-foreground">
                            ติดตามการเข้าเรียนของนักเรียนได้อย่างง่ายดาย<br/>
                            Track student attendance with ease
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button variant="default" size="lg" className="w-full">
                                    เข้าสู่ระบบ/Sign In
                                </Button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button variant="outline" size="lg" className="w-full">
                                    ลงทะเบียน/Sign Up
                                </Button>
                            </SignUpButton>
                            <Link href="/dashboard" className="w-full">
                                <Button variant="secondary" size="lg" className="w-full">
                                    เข้าชมแบบแขก/Continue as Guest
                                </Button>
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link href="/dashboard" className="w-full">
                                <Button size="lg" className="w-full">
                                    ไปที่แดชบอร์ด/Go to Dashboard
                                </Button>
                            </Link>
                        </SignedIn>
                    </div>
                </div>
            </div>
        </div>
    );
}
