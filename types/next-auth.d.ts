import { ObjectId } from "mongodb"
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id?: string
            userRole?: string
        } & DefaultSession["user"]
    }

    interface User {
        userRole?: string
        address?: string
    }
}

// I WANT TO MAKE THIS WORKS
