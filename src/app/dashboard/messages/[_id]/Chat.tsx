import { getViperById } from "@/lib/vipers"
import { formatDistanceToNow } from "date-fns"
import { Viper } from "@/types/viper"

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
    const senderId: string = sender.replace(/['"]+/g, "")

    const viper: Viper | null = await getViperById(senderId)
    if (!viper) throw new Error("No Viper bro")
    return (
        <div key={messageId} className="mr-20 my-2">
            <h1 data-test="viper-name">{viper.name}</h1>
            <div className="bg-blue-400/75 rounded-[14px]">
                <p data-test="viper-message" className="py-1.5 px-2 text-gray-50">
                    {message}
                </p>
            </div>
            <p data-test="chat-timestamp" className="text-[13px]">
                {" "}
                {formatDistanceToNow(new Date(timestamp))} ago
            </p>
        </div>
    )
}
