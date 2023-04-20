import { Shopify } from "@/types/viper"

type SessionViper = {
    _id: string
    name: string
    image: string
    email: string
    location: string
    address: string
    shopify: Shopify
}

export const sessionViper: SessionViper = {
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
