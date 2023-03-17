import "server-only"

import { shopifyAdmin } from "./adminApi"
import { ApiVersion } from "@shopify/shopify-api"

const shop = process.env.SHOPIFY_HOST!
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!

export const storefrontClient = new shopifyAdmin.clients.Storefront({
    domain: shop,
    storefrontAccessToken,
    apiVersion: ApiVersion.January23,
})
