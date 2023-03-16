import { Suspense } from "react"
import { PageProps } from "../../../../lib/getCategories"
import { getCurrentViper } from "../../../../lib/session"
import { getVipersMessenger } from "../../../../lib/vipers"
import { Chats } from "../../../../types/viper"
import { DisplayChat } from "./DisplayChat"

export default async function chatIdPage({ params }: PageProps) {
    const viper = await getCurrentViper()
    if (!viper) throw new Error("No Viper bro")
    const id: string = params.id
    const messenger: Promise<Chats[]> = getVipersMessenger(id, viper.id)

    return (
        <div className="flex h-[20.5rem]">
            <Suspense
                fallback={
                    <div className="text-yellow-400 text-sm">
                        Suspense fromm chat page
                    </div>
                }
            >
                {/* @ts-expect-error Async Server Component */}
                <DisplayChat chatPromise={messenger} />
            </Suspense>
        </div>
    )
}
