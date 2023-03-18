import { ObjectId } from "mongodb"

export interface EventInterface {
    readonly _id: ObjectId
    organizer: Organizer
    title: string
    content: string
    location: string
    address: string
    date: Date
    category: string
    creationDate: number
    image: string
    price: number
    entries: number
    participants: Participants[]
    editionDate: number
    likes: Likes[]
    comments: Comments[]
    productId: string
}

export type Organizer = {
    readonly id: string
    name: string
    email: string
    image: string
}
export interface Participants {
    readonly _id: ObjectId
}
export interface Likes {
    readonly _id: ObjectId
}
export interface Comments {
    readonly _id: ObjectId
    eventTitle?: string
    viperId: ObjectId
    text: string
    likes: string[]
    replies: Reply[]
    timestamp: number
}

export interface Reply {
    readonly _id: Object
    viperId: string
    reply: string
    likes: string[]
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
