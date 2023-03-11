import { PageProps } from "../../../../lib/getCategories"
import { getCurrentViper } from "../../../../lib/session"
import { Chats, getVipersMessenger } from "../../../../lib/vipers"
import Chat from "./Chat"

export default async function chatIdPage({ params }: PageProps) {
    const viper = await getCurrentViper()
    if (!viper) return
    const id: string = params.id
    const messenger: Chats[] = await getVipersMessenger(id, viper.id)

    return (
        <div className="flex h-[20.5rem]">
            <div className="overflow-y-scroll  text-gray-300 text-sm w-full max-h-[20.5rem] ">
                {messenger.map((message: Chats) => {
                    return (
                        /* @ts-expect-error Async Server Component */
                        <Chat
                            key={JSON.stringify(message._id)}
                            messageId={JSON.stringify(message._id)}
                            sender={JSON.stringify(message.sender)}
                            message={message.message}
                            timestamp={message.timestamp}
                        />
                    )
                })}
            </div>
        </div>
    )
}
