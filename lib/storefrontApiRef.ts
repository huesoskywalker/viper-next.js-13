import "@shopify/shopify-api/adapters/node"
import { shopifyApi, LATEST_API_VERSION, Session } from "@shopify/shopify-api"
import { restResources } from "@shopify/shopify-api/rest/admin/2023-01"

export const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY!,
    apiSecretKey: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!, // Note: this is the API access token, NOT the API Secret Key
    apiVersion: LATEST_API_VERSION,
    isCustomStoreApp: true, // this MUST be set to true (default is false)
    scopes: [],
    isEmbeddedApp: false,
    hostName: process.env.SHOPIFY_STORE_DOMAIN || "",
    // Mount REST resources.
    restResources,

    privateAppStorefrontAccessToken:
        process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
})

// export async function getProductById() {
// Load the access token as per instructions above
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!
// Shop from which we're fetching data
const shop = process.env.SHOPIFY_STORE_DOMAIN!

// StorefrontClient takes in the shop url and the Storefront Access Token for that shop.
export const storefrontClient = new shopify.clients.Storefront({
    domain: shop,
    storefrontAccessToken,
    apiVersion: LATEST_API_VERSION,
})

// const gql = String.raw

// // Use client.query and pass your query as `data`
export const products = await storefrontClient.query({
    extraHeaders: {
        "Content-Type": "application/json",
    },
    data: `{
            products (first: 3) {
              edges {
                node {
                  id
                  title
                }
              }
            }
          }`,
})
// return JSON.stringify({ products })
// }
