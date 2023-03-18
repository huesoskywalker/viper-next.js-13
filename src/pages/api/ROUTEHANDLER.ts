import { NextResponse } from "next/server"

export const config = {
    runtime: "experimental-edge",
}
export default async function GET(req: Request) {
    return NextResponse.json({ a: "hello" })
}
