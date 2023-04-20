import { Comments, EventInterface, Likes, Organizer, Participants, Reply } from "@/types/event"

export const organizer: Organizer = {
    _id: "",
    name: "",
    email: "",
}

export const participant: Participants = {
    _id: "",
}

export const like: Likes = {
    _id: "",
}

export const comment: Comments = {
    _id: "",
    eventTitle: "",
    viperId: "",
    text: "",
    likes: [like],
    replies: [],
    timestamp: 0,
}

export const reply: Reply = {
    _id: "",
    viperId: "",
    reply: "",
    likes: [like],
    timestamp: 0,
}

export const event: EventInterface = {
    _id: "",
    organizer: organizer,
    title: "",
    content: "",
    location: "",
    address: "",
    date: "",
    category: "",
    creationDate: 0,
    image: "",
    price: 0,
    entries: 0,
    participants: [participant],
    editionDate: 0,
    likes: [like],
    comments: [comment],
    productId: "",
}
type ProductInventory = {
    totalInventory: JQuery<number> | undefined
}
export const productInventory: ProductInventory = {
    totalInventory: undefined,
}
