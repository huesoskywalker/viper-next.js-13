import { Organizer } from "@/types/event"

export type ProfileEdit = {
    name: string
    biography: string
    image: string
    backgroundImage: string
    location: string
}

export type CreateEventRequest = {
    title: string
    content: string
    category: string
    date: string
    location: string
    address: string
    price: number | string
    entries: number | string
    organizer: Organizer
    image: JQuery<string> | string
    productId: JQuery<string> | string
}

export type EditEventRequest = {
    title: string
    content: string
    location: string
    price: number
}

export type BlogRequest = {
    _id: string
    content: string
}

export type LikeBlog = {
    _id: string
    blogOwner_id: string
    viper_id: string
}
