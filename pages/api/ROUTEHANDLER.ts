import { NextResponse } from "next/server"
import { shopifyFetch } from "../../lib/shopifyFetch"

// find shopifyFetch from Next.js guide

export const config = {
    runtime: "edge",
}
const gql = String.raw
export default async function handler(req: Request) {
    const a = await shopifyFetch({
        query: gql`
            {
                products(sortKey: TITLE, first: 100) {
                    edges {
                        node {
                            # id
                            # title
                            # description
                            totalInventory
                        }
                    }
                }
            }
        `,
    })
    console.log(a)

    return NextResponse.json({ a: a })
}
