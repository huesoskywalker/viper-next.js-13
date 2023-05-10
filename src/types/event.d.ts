import { ObjectId } from "mongodb"

export interface EventInterface {
    readonly _id: ObjectId | string
    organizer: Organizer
    title: string
    content: string
    location: string
    address: string
    date: string
    category: string
    creationDate: number
    image: string
    price: number
    entries: number
    participants: Participants[]
    editionDate: number
    likes: Likes[]
    comments: Comments[]
    product: Product
    // productId: string
}

// Check here why string, Probably:
// 1- to go through components as strings instead of Object,
// 2 - no need to place and Object Id, probably won't be a search query.
// Recheck even
export type Organizer = {
    _id: string
    name: string
    email: string
}
export interface Participants {
    readonly _id: ObjectId | string
}
export interface Likes {
    readonly _id: ObjectId | string
}
export interface Comments {
    readonly _id: ObjectId | string
    viperId: ObjectId | string
    text: string
    likes: Likes[]
    replies: Reply[]
    timestamp: number
}

export interface Reply {
    readonly _id: Object
    viperId: string
    reply: string
    likes: likes[]
    timestamp: number
}

export interface EditEvent {
    title: string
    content: string
    location: string
    date: string
    category: string
    price: string
    image: string
}

export interface Product {
    _id: string
    variant_id: string
}
