import { Chats, getViperById } from "../../../../lib/vipers"
import { formatDistanceToNow } from "date-fns"

export default async function Chat({
    messageId,
    sender,
    message,
    timestamp,
}: {
    messageId: string
    sender: string
    message: string
    timestamp: number
}) {
    const senderId = sender.replace(/['"]+/g, "")

    const viper = await getViperById(senderId)

    return (
        <div key={messageId} className="mr-20 my-2">
            <h1>{viper?.name}</h1>
            <div className="bg-blue-400/75 rounded-[14px]">
                <p className="py-1.5 px-2 text-gray-50">{message}</p>
            </div>
            <p className="text-[13px]">
                {" "}
                {formatDistanceToNow(new Date(timestamp))} ago
            </p>
        </div>
    )
}
