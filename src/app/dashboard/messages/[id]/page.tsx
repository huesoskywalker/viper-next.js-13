import { Suspense } from "react"
import { PageProps } from "@/lib/getCategories"
import { getCurrentViper } from "@/lib/session"
import { Chats } from "@/types/viper"
import { DisplayChat } from "./DisplayChat"
import { Session } from "next-auth"

export default async function chatIdPage({ params }: PageProps) {
    const viperSession: Session | null = await getCurrentViper()
    if (!viperSession) throw new Error("No Viper bro")
    const viper = viperSession?.user
    const id: string = params.id
    const messengerData = await fetch(`http://localhost:3000/api/messages/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id,
            viperId: viper._id,
        }),
        next: { revalidate: 10 },
    })
    const messenger: Promise<Chats[]> = messengerData.json()

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
