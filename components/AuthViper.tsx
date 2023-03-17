"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"

export default function Auth({ children }: { children: React.ReactNode }) {
    const router: AppRouterInstance = useRouter()
    const { data: session, status } = useSession()
    const isUser = session?.user
    useEffect(() => {
        if (status === "loading") return
        if (!isUser) router.push("/")
    }, [isUser, status])

    return children
}
