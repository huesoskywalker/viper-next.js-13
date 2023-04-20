import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import Auth0Provider from "next-auth/providers/auth0"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "./mongodb"
import { getViperByUsername } from "./vipers"
import { randomBytes, randomUUID } from "crypto"

export const authOptions: NextAuthOptions = {
    providers: [
        Auth0Provider({
            clientId: process.env.AUTH0_CLIENT_ID!,
            clientSecret: process.env.AUTH0_CLIENT_SECRET!,
            issuer: process.env.AUTH0_ISSUER,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Cypress Testing",
            id: "1-test",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "viper",
                },
                password: { label: "Password", type: "password" },
            },
            // @ts-ignore
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const { username, password } = credentials as any
                const user = await getViperByUsername(username, password)
                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return user
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            },
        }),
    ],
    adapter: MongoDBAdapter(clientPromise as any),
    // Using jwt to manage cypress test, after that, get back to strategy: "database", or make both available
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,

        generateSessionToken: () => {
            return randomUUID?.() ?? randomBytes(32).toString("hex")
        },
    },
    jwt: {
        // The maximum age of the NextAuth.js issued JWT in seconds.
        // Defaults to `session.maxAge`.
        maxAge: 60 * 60 * 24 * 30,

        // You can define your own encode/decode functions for signing and encryption
        // async encode() {},
        // async decode() {},
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // console.log`---------signIn-user----------`
            // console.log(user)
            // console.log`---------signIn-account----------`
            // console.log(account)
            // console.log`---------signIn-profile----------`
            // console.log(profile)
            // console.log`---------signIn-email----------`
            // console.log(email)
            // console.log`---------signIn-credentials----------`
            // console.log(credentials)
            // if (account.provider === "google") {
            //     return (
            //         profile.email_verified &&
            //         profile.email.endsWith("@example.com")
            //     )
            // }

            // Setting a cookie with additional options

            // document.cookie = `next-auth.session-token=960cc3ca-583f-4351-8da1-2de786cc08b2; path=/; max-age=${
            //     60 * 60 * 24 * 30
            // }}`

            // cookies.set("next-auth.session-token", sessionToken, {
            //     expires: sessionExpiry,
            // })

            return true // Do different verification for other providers that don't have `email_verified`
        },
        async jwt({ token, user }) {
            // console.log`-----------jwt-token-------------------------------`
            // console.log(token)
            // console.log`-----------jwt-user--------------------------------`
            // console.log(user)

            return { ...token, ...user }
        },
        async session({ session, token, user }) {
            // console.log`---------session-session----------`
            // console.log(session)
            // console.log`---------session-token----------`
            // console.log(token)
            // console.log`---------session-user----------`
            // console.log(user)
            if (token) {
                session.user._id = token._id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.image
                session.user.location = token.location
                session.user.address = token.address
                session.user.shopify = token.shopify
                return session
            } else {
                session.user._id = user._id
                session.user.name = user.name
                session.user.email = user.email
                session.user.image = user.image
                session.user.location = user.location
                session.user.address = user.address
                session.user.shopify = user.shopify

                // session.user.emailVerified = user.emailVerified

                return session
            }
        },
        // TIP
        //Google also returns a email_verified boolean property in the OAuth profile.
        // You can use this property to restrict access to people with verified accounts at a particular domain.
    },
    events: {
        async signIn({ user, account, profile, isNewUser }) {
            // console.log`---------events-signIn-user----------`
            // console.log(user)
            // console.log`---------events-signIn-account----------`
            // console.log(account)
            // console.log`---------events-signIn-profile----------`
            // console.log(profile)
            // console.log`---------events-signIn-isNewUser----------`
            // console.log(isNewUser)
        },
        // async linkAccount({ user, account, profile }) {
        //     console.log`---------events-linkAccount-user----------`
        //     console.log(user)
        //     console.log`---------events-linkAccount-account----------`
        //     console.log(account)
        //     console.log`---------events-linkAccount-profile----------`
        //     console.log(profile)
        // },
        // async session({ session, token }) {
        //     console.log`---------events-session-session----------`
        //     console.log(session)
        //     console.log`---------events-session-token----------`
        //     console.log(token)
        // },
    },
}
