import { NextResponse } from "next/server"
// import { shopifyFetch } from "../../lib/shopifyFetch"

// find shopifyFetch from Next.js guide

export const config = {
    runtime: "experimental-edge",
}
const gql = String.raw
export default async function GET(req: Request) {
    return NextResponse.json({ a: "hello" })
}
