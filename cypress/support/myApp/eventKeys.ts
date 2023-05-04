import { Comments, EventInterface, Organizer, Reply } from "@/types/event"
import { ProductInventory } from "./event"

export const organizerKeys: (keyof Organizer)[] = ["_id", "name", "email"]

export const commentKeys: (keyof Comments)[] = [
    "_id",
    "eventTitle",
    "viperId",
    "text",
    "likes",
    "replies",
    "timestamp",
]

export const replyKeys: (keyof Reply)[] = ["_id", "viperId", "reply", "likes", "timestamp"]

export const eventKeys: (keyof EventInterface)[] = [
    "_id",
    "organizer",
    "title",
    "content",
    "location",
    "address",
    "date",
    "category",
    "creationDate",
    "image",
    "price",
    "entries",
    "participants",
    "editionDate",
    "likes",
    "comments",
    "product",
]

export const productInventoryKeys: (keyof ProductInventory)[] = ["totalInventory"]
