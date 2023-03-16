import { authOptions } from "./auth"
import { Session, getServerSession } from "next-auth"

export async function getSession(): Promise<Session | null> {
    return await getServerSession(authOptions)
}

// Will have to make this properly at some point
export async function getCurrentViper() {
    const session: Session | null = await getSession()

    return session?.user
}
