import { ObjectId } from "mongodb"

export interface Viper {
    readonly _id: ObjectId
    name: string
    email: string
    image: string
    emailVerified: null
    backgroundImage: string
    biography: string
    location: string
    address: Address
    customerAccessToken: string
    collection: Collection[]
    followers: Follow[]
    follows: Follow[]
    likes: Likes[]
    blog: Blog[]
    blogLikes: ExternalBlog[]
    blogCommented: CommentBlog[]
    blogRePosts: ExternalBlog[]
}
export interface Follow {
    readonly _id: ObjectId
}
export interface Address {
    phone: number
    address: string
    province: string
    country: string
    zip: number
    city: string
}
export interface Collection {
    readonly _id: ObjectId
    readonly checkoutId: string
}
export interface Likes {
    readonly _id: ObjectId
}
export interface Blog {
    readonly _id: ObjectId
    content: string
    likes: string[]
    comments: string[]
    rePosts: string[]
    timestamp: number
}

export interface ExternalBlog {
    readonly bloggerId: Object
    readonly blogId: Object
    readonly viperId: Object
    timestamp: number
}
export interface CommentBlog {
    readonly bloggerId: Object
    readonly blogId: Object
    readonly viperId: Object
    comment: string
    timestamp: number
}

export interface Chats {
    readonly _id: ObjectId
    sender: string
    message: string
    timestamp: number
}
