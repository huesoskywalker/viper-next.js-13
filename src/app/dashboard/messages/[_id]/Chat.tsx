import { getViperBasicProps } from "@/lib/vipers"
import { differenceInHours, formatDistance, formatRelative } from "date-fns"
import { ViperBasicProps } from "@/types/viper"
import { getCurrentViper } from "@/lib/session"

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

    const viper: ViperBasicProps | null = await getViperBasicProps(senderId)
    const currentViper = await getCurrentViper()
    if (!viper) throw new Error("No Viper bro")
    const isCurrentViper = currentViper?.user.name === viper?.name
    return (
        <div
            key={messageId}
            className={`flex flex-col relative space-x-1 space-y-1 px-3 py-1 ${
                isCurrentViper ? "text-right" : "text-left"
            }`}
        >
            {!isCurrentViper && <span data-test="viper-name">{viper.name}</span>}
            <div className="">
                <span
                    data-test="viper-message"
                    className={`inline-flex rounded-xl space-x-2 items-start p-2 text-white ${
                        isCurrentViper ? "bg-blue-400/75" : "bg-gray-700"
                    } `}
                >
                    {message}
                </span>
            </div>
            <p data-test="chat-timestamp" className="text-[12px]">
                {" "}
                {differenceInHours(new Date(), new Date(timestamp)) >= 1
                    ? formatRelative(new Date(timestamp), new Date())
                    : formatDistance(new Date(timestamp), new Date(), {
                          addSuffix: true,
                      })}
            </p>
        </div>
    )
}
