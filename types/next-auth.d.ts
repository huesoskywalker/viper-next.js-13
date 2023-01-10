import { ObjectId } from "mongodb"
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string
            name: string
            email: string
            image: string
            // backgroundImage: string
            emailVerified: null
            // participated: string[]
            // location: string
            // followers: string[]
            // follows: string[]
            // userRole?: string
        }
    }

    interface User {
        name: string
        email: string
        image: string
        backgroundImage: string
        emailVerified: null
        participated: string[]
        location: string
        followers: string[]
        follows: string[]
    }
}
