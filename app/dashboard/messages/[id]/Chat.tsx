import { Chats, getViperById } from "../../../../lib/vipers"
import { formatDistanceToNow } from "date-fns"

export default async function Chat({ sender, message, time }: Chats) {
    const viper = await getViperById(sender)

    return (
        <div key={sender} className="mr-20 my-2">
            <h1>{viper?.name}</h1>
            <div className="bg-blue-400/75 rounded-[14px]">
                <p className="py-1.5 px-2 text-gray-50">{message}</p>
            </div>
            <p className="text-[13px]"> {formatDistanceToNow(time)} ago</p>
        </div>
    )
}
