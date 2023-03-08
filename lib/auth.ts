import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "./mongodb"

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    adapter: MongoDBAdapter(clientPromise as any),
    session: {
        strategy: "database",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token, user }) {
            session.user.id = user.id
            session.user.name = user.name
            session.user.email = user.email
            // user.image = session.user.image
            session.user.image = user.image
            session.user.location = user.location
            session.user.address = user.address
            session.user.customerAccessToken = user.shopify?.customerAccessToken
            // session.user.emailVerified = user.emailVerified

            return session
        },
    },
}
