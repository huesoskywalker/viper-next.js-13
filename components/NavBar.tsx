"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"

export default function NavBar() {
    const { data: session, status } = useSession()
    if (status === "loading") {
        return (
            <div>
                <h1>We are generating the navigator, meanwhile, coffe</h1>
            </div>
        )
    }

    if (status === "unauthenticated") {
        return (
            <div>
                <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="#" onClick={() => signIn()}>
                            Sign in
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }

    return (
        <nav className="bg-slate-900">
            <ul>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/events">Events</Link>
                </li>
                <li>
                    <Link href="/vipers">Vipers</Link>
                </li>
                <li>
                    <Link href="/blog">Blog</Link>
                </li>
                <li className="bg-slate-900">
                    <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link href="/admin">Admin</Link>
                </li>

                {session ? (
                    <li>
                        <Link href="#" onClick={() => signOut()}>
                            Sign out
                        </Link>
                    </li>
                ) : (
                    <li>
                        <Link href="#" onClick={() => signIn()}>
                            Sign in
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}
