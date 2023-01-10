import { Comments } from "../lib/events"
import { getViperById } from "../lib/vipers"
import Image from "next/image"

export async function EventCommentsCard({ comment }: { comment: Comments }) {
    const viper = await getViperById(comment.viperId)
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-gray-700">
                        {" "}
                        <Image
                            src={`/vipers/${viper?.image}`}
                            alt={`/vipers/${viper?.image}`}
                            width={50}
                            height={50}
                            className="rounded-full col-start-1 "
                        />
                    </div>
                    <div className="text-sm text-white">{viper?.name}</div>
                </div>
            </div>

            <div className="text-gray-400 ">{comment.text}</div>
        </div>
    )
}
