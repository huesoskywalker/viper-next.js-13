import { Shopify } from "@/types/viper"

export type Session = {
    _id: string
    name: string
    image: string
    email: string
    location: string
    address: string
    shopify: Shopify
}

export const rawSession: Session = {
    _id: "",
    name: "",
    email: "",
    image: "",
    location: "",
    address: "",
    shopify: {
        customerAccessToken: "",
        customerId: "",
    },
}
