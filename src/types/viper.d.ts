import { ObjectId } from "mongodb"

// IN here i placed string as an option of the _id, mostly for cypress
export interface Viper {
    readonly _id: ObjectId | Hex24String | ""
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
    readonly _id: ObjectId | Hex24String | ""
    created: Created[]
    collection: Collection[]
    likes: Likes[]
}
export interface Created {
    // mongodb ObjectId, fetch: returns id // this interface should be ... ?
    readonly _id: ObjectId | Hex24String | ""
}
export interface Collection {
    readonly _id: ObjectId | Hex24String | ""
    readonly checkoutId: string
}
export interface Likes {
    readonly _id: ObjectId | Hex24String | ""
}
export interface Follow {
    readonly _id: ObjectId | Hex24String | ""
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
    readonly _id: ObjectId | Hex24String | ""
    content: string
    likes: Likes[]
    comments: string[]
    rePosts: string[]
    timestamp: number
}
export interface ExternalBlog {
    readonly _id: ObjectId | Hex24String | ""
    readonly blogOwner_id: ObjectId | Hex24String | ""
    readonly viper_id: ObjectId | Hex24String | ""
    comment?: string
    timestamp: number
}

export interface Chats {
    readonly _id: ObjectId | Hex24String | ""
    members: (ObjectId | Hex24String | "")[]
    messages: Message[]
}
export interface Message {
    readonly _id: ObjectId | Hex24String | ""
    sender: ObjectId | Hex24String | ""
    message: string
    timestamp: number
}

export interface Shopify {
    customerAccessToken: string
    customerId: string
}

export type ViperBasicProps = Pick<
    Viper,
    | "_id"
    | "name"
    | "image"
    | "backgroundImage"
    | "email"
    | "location"
    | "biography"
    | "followers"
    | "follows"
>

export type Hex24String = `${
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "a"
    | "b"
    | "c"
    | "d"
    | "e"
    | "f"}{24}`

export type _ID = ObjectId | Hex24String
