import { authOptions } from "./auth"
import { Session, getServerSession } from "next-auth"
import { cache } from "react"

export async function getSession(): Promise<Session | null> {
    return await getServerSession(authOptions)
}

export const preloadViperSession = () => {
    void getCurrentViper()
}
export const getCurrentViper = cache(async (): Promise<Session | null> => {
    const session: Session | null = await getSession()

    return session
})
