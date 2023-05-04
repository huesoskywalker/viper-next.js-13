import {
    Address,
    Blog,
    MyEvents,
    Shopify,
    MyBlog,
    Viper,
    ExternalBlog,
    Collection,
} from "@/types/viper"

import { ID } from "./viper"

export const _idKey: (keyof ID)[] = ["_id"]

export const addressKeys: (keyof Address)[] = [
    "phone",
    "address",
    "city",
    "province",
    "zip",
    "country",
]

export const myBlogKeys: (keyof MyBlog)[] = [
    "_id",
    "content",
    "likes",
    "comments",
    "rePosts",
    "timestamp",
]

export const externalBlogKeys: (keyof ExternalBlog)[] = [
    "_id",
    "blogOwner_id",
    "timestamp",
    "viper_id",
]

export const blogKeys: (keyof Blog)[] = ["myBlog", "likes", "commented", "rePosts"]

export const viperKeys: (keyof Viper)[] = [
    "_id",
    "address",
    "backgroundImage",
    "biography",
    "blog",
    "email",
    "emailVerified",
    "name",
    "image",
    "location",
    "shopify",
    "myEvents",
    "followers",
    "follows",
]

export const collectionKeys: (keyof Collection)[] = ["_id", "checkoutId"]

export const myEventsKeys: (keyof MyEvents)[] = ["_id", "created", "collection", "likes"]

export const shopifyKeys: (keyof Shopify)[] = ["customerAccessToken", "customerId"]
