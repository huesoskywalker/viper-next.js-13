"use client"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SkeletonCard } from "./SkeletonCard"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"
import { Session } from "next-auth"

export default function Auth({ children }: { children: React.ReactNode }) {
    const router: AppRouterInstance = useRouter()
    const { data: session, status } = useSession()
    const isUser = session?.user
    useEffect(() => {
        if (status === "loading") return
        if (!isUser) router.push("/")
    }, [isUser, status])

    // if (!isUser) {
    //     return (
    //         <div className="text-yellow-400 text-xl">
    //             No user from AuthViper, let's do something
    //         </div>
    //     )
    // }
    return children
}
