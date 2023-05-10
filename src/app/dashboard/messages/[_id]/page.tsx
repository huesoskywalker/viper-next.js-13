import { Suspense } from "react"
import { PageProps } from "@/lib/getCategories"
import { getCurrentViper } from "@/lib/session"
import { Chats, Message } from "@/types/viper"
import { DisplayChat } from "./DisplayChat"
import { Session } from "next-auth"

export default async function chatIdPage({ params }: PageProps) {
    const viperSession: Session | null = await getCurrentViper()
    if (!viperSession) throw new Error("No Viper bro")
    const viper = viperSession.user
    const _id: string = params._id
    const messengerData = await fetch(`http://localhost:3000/api/messages/${_id}`, {
        method: "POST",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
            viper: { _id: viper._id },
        }),
        cache: "no-cache",
        next: { revalidate: 10 },
    })
    const messenger: Promise<Chats | null> = messengerData.json()

    return (
        <div className="flex h-[20.5rem]">
            <Suspense
                fallback={<div className="text-yellow-400 text-sm">Suspense fromm chat page</div>}
            >
                {/* @ts-expect-error Async Server Component */}
                <DisplayChat chatPromise={messenger} />
            </Suspense>
        </div>
    )
}
