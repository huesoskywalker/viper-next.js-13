import Image from "next/image"
import { cookies } from "next/headers"
import { AddLike } from "../../AddLike"
import Link from "next/link"
import { getViperById } from "../../../../lib/vipers"

export async function ReplyCard({
    eventId,
    commentId,
    replyId,
    viperId,
    comment,
    likes,
}: {
    eventId: string
    commentId: string
    replyId: string
    viperId: string
    comment: string
    likes: number
}) {
    // console.log(likes)
    const viper = await getViperById(viperId)
    const stringifyCommentId = JSON.stringify(replyId)
    const reply_id = stringifyCommentId.replace(/['"]+/g, "")

    const likedCookie = cookies().get(`_${reply_id}_is_liked`)?.value || "none"
    return (
        <div className="space-y-2 lg:border-b lg:border-gray-800 pb-3 mr-10 mt-5">
            <Link href={`/vipers/${viperId}`} className="space-y-4">
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
                    <span className="text-sm text-white  ml-5">
                        {viper?.name}
                    </span>
                </div>
                <div className="text-gray-300 text-base font-light">
                    {comment}
                </div>
            </Link>

            <div className="flex justify-items-start space-x-4 space-y-1">
                <AddLike
                    eventId={eventId}
                    commentId={commentId}
                    replyId={reply_id}
                    likedCookie={likedCookie}
                    likes={likes}
                    event={false}
                    reply={true}
                />
            </div>
        </div>
    )
}
