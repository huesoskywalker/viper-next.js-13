import { authOptions } from "./auth"
import { Session, getServerSession } from "next-auth"
import { cache } from "react"

export const preloadViperSession = () => {
    void getCurrentViper()
}
export const getCurrentViper = cache(async (): Promise<Session | null> => {
    const session: Session | null = await getServerSession(authOptions)
    return session
})

// no cache in here
// export const getCurrentViper = async (): Promise<Session | null> => {
//     const session: Session | null = await getServerSession(authOptions)
//     return session
// }
