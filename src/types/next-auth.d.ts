import { ObjectId } from "mongodb"
import NextAuth, { DefaultSession } from "next-auth"
import { Address, Shopify } from "./viper"

declare module "next-auth" {
    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     */
    interface Session {
        user: {
            _id: string
            name: string
            email: string
            image: string
            location: string
            address: Address
            shopify: Shopify
            // we are not using the accessToken,, yet
            accessToken: string
            // customerAccessToken: string
        }
    }
    /**
     * Usually contains information about the provider being used
     * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
     */
    interface Account {}
    /** The OAuth profile returned from your provider */
    interface Profile {}
    interface Token {
        _id: string
        name: string
        email: string
        image: string
        location: string
        address: Address
        shopify: Shopify
        // we are not using the accessToken,, yet
        accessToken: string
    }

    interface User {
        _id: string
        name: string
        email: string
        image: string
        location: string
        shopify: Shopify
        address: Address
        // we are not using the accessToken,, yet
    }
}
