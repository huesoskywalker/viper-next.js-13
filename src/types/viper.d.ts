import { ObjectId } from "mongodb"

// IN here i placed string as an option of the _id, mostly for cypress
export interface Viper {
    readonly _id: ObjectId | string
    address: Address
    backgroundImage: string
    biography: string
    blog: Blog
    email: string
    emailVerified: null
    name: string
    image: string
    location: string
    shopify: Shopify
    myEvents: MyEvents
    followers: Follow[]
    follows: Follow[]
}
export interface MyEvents {
    readonly _id: ObjectId | string
    created: Created[]
    collection: Collection[]
    likes: Likes[]
}
export interface Created {
    // mongodb ObjectId, fetch: returns id // this interface should be ... ?
    readonly _id: ObjectId | string
}
export interface Collection {
    readonly _id: ObjectId | string
    readonly checkoutId: string
}
export interface Likes {
    readonly _id: ObjectId | string
}
export interface Follow {
    readonly _id: ObjectId | string
}
export interface Address {
    phone: number | null | string
    address: string
    province: string
    country: string
    zip: number | null | string
    city: string
}

export interface Blog {
    myBlog: MyBlog[]
    likes: ExternalBlog[]
    commented: ExternalBlog[]
    rePosts: ExternalBlog[]
}

export interface MyBlog {
    readonly _id: ObjectId | string
    content: string
    likes: Likes[]
    comments: string[]
    rePosts: string[]
    timestamp: number
}
export interface ExternalBlog {
    readonly _id: ObjectId | string
    readonly blogOwner_id: ObjectId | string
    readonly viper_id: ObjectId | string
    comment?: string
    timestamp: number
}
// export interface CommentedBlog {
//     readonly bloggerId: ObjectId | string
//     readonly blogId: ObjectId | string
//     readonly viperId: ObjectId | string
//     comment: string
//     timestamp: number
// }

export interface Chats {
    readonly _id: ObjectId | string
    sender: string
    message: string
    timestamp: number
}

export interface Shopify {
    customerAccessToken: string
    customerId: string
}
