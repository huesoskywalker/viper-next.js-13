import { Chats } from "../../../../types/viper"
import Chat from "./Chat"

export async function DisplayChat({
    chatPromise,
}: {
    chatPromise: Promise<Chats[]>
}) {
    const messenger: Chats[] = await chatPromise
    return (
        <>
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
        </>
    )
}
