"use client"

import { SessionProvider, useSession } from "next-auth/react"
import { PageProps } from "../lib/utils"

const Auth = ({ children }: PageProps) => {
    const { data: session } = useSession()
    console.log(session)
    return <>{children}</>
}
export default function AuthProvider({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            <Auth>{children}</Auth>
        </SessionProvider>
    )
}
