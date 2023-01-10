import { PageProps } from "../../../../lib/getCategories"
import { getCurrentViper } from "../../../../lib/session"
import { getVipersMessenger } from "../../../../lib/vipers"
import Chat from "./Chat"

export default async function chatIdPage({ params }: PageProps) {
    const viper = await getCurrentViper()
    const viperId = viper?.id
    const id: string = params.id

    const messenger = await getVipersMessenger(id, viperId!)

    const messages = messenger.map((property) => {
        return property.messages
    })

    return (
        <div className="flex h-[20.5rem]">
            <div className="overflow-y-scroll  text-gray-300 text-sm w-full max-h-[20.5rem] ">
                {messages?.map((message) => {
                    return (
                        /* @ts-expect-error Async Server Component */
                        <Chat
                            sender={message.sender}
                            message={message.message}
                            time={message.time}
                        />
                    )
                })}
            </div>
        </div>
    )
}
