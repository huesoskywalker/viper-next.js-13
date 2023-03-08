import { unstable_getServerSession } from "next-auth/next"

import { authOptions } from "./auth"

export async function getSession() {
    return await unstable_getServerSession(authOptions)
}

export async function getCurrentViper() {
    const session = await getSession()

    return session?.user
}
