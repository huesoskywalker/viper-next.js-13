import {
    Address,
    Blog,
    Follow,
    MyEvents,
    Shopify,
    MyBlog,
    Viper,
    ExternalBlog,
    Created,
    Collection,
    Likes,
    ViperBasicProps,
} from "@/types/viper"

export type ID = {
    [key: string]: string
}

export const address: Address = {
    phone: null,
    address: "",
    city: "",
    province: "",
    zip: null,
    country: "",
}
export const likes: Likes = {
    _id: "",
}
export const myBlog: MyBlog = {
    _id: "",
    content: "",
    likes: [],
    comments: [],
    rePosts: [],
    timestamp: 0,
}

export const externalBlog: ExternalBlog = {
    _id: "",
    blogOwner_id: "",
    viper_id: "",
    timestamp: 0,
    comment: "",
}

export const blog: Blog = {
    myBlog: [],
    likes: [],
    commented: [],
    rePosts: [],
}

export const created: Created = {
    _id: "",
}
export const collection: Collection = {
    _id: "",
    checkoutId: "",
}

export const myEvents: MyEvents = {
    _id: "",
    created: [],
    collection: [],
    likes: [],
}

export const shopify: Shopify = {
    customerAccessToken: "",
    customerId: "",
}
export const followers: Follow = {
    _id: "",
}
const follows: Follow = {
    _id: "",
}

export const rawViper: Viper = {
    _id: "",
    address: address,
    backgroundImage: "",
    biography: "",
    blog: blog,
    email: "",
    emailVerified: null,
    name: "",
    image: "",
    location: "",
    shopify: shopify,
    myEvents: myEvents,
    followers: [],
    follows: [],
}

export const rawViperId: ID = {
    _id: "",
}

export const rawViperBasicProps: ViperBasicProps = {
    _id: "",
    name: "",
    image: "",
    backgroundImage: "",
    email: "",
    location: "",
    biography: "",
    followers: [],
    follows: [],
}
