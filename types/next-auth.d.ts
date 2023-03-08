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
            location: string
            address: Address
            customerAccessToken: string
            // backgroundImage: string
            // emailVerified: null
            // participated: string[]
            // followers: string[]
            // follows: string[]
            // userRole?: string
        }
    }

    interface User {
        name: string
        email: string
        image: string
        location: string
        shopify: Shopify
        address: Address
        // backgroundImage: string
        // emailVerified: null
        // participated: string[]
        // followers: string[]
        // follows: string[]
    }

    type Shopify = {
        customerAccessToken: string
        customerId: string
    }

    type Address = {
        phone: number
        address: string
        province: string
        country: string
        zip: number
        city: string
    }
}
