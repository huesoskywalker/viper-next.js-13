import { getEventById, Comments } from "../../../../lib/events"
import { getViperById } from "../../../../lib/vipers"
import Image from "next/image"
import { cookies } from "next/headers"
import AddComment from "../../AddComment"
import { AddLike } from "../../AddLike"
import Link from "next/link"

export async function CommentCard({
    eventId,
    commentId,
    viperId,
    text,
    likes,
    replies,
}: {
    eventId: string
    commentId: string
    viperId: string
    text: string
    likes: number
    replies: number
}) {
    const viper = await getViperById(viperId)
    const stringifyCommentId = JSON.stringify(commentId)
    const comment_id = stringifyCommentId.replace(/['"]+/g, "")

    const likedCookie =
        cookies().get(`_${comment_id}_is_liked`)?.value || "none"
    return (
        <div className="space-y-2">
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
                    <span className="text-sm text-white mt-5 ml-5">
                        {viper?.name}
                    </span>
                </div>
                <div className="text-gray-300 text-base font-light">{text}</div>
            </Link>

            <div className=" flex justify-items-start space-x-4 space-y-1">
                <AddLike
                    eventId={eventId}
                    likes={likes}
                    commentId={comment_id}
                    replyId={""}
                    likedCookie={likedCookie}
                    event={false}
                    reply={false}
                />
                <AddComment
                    id={eventId}
                    commentId={""}
                    commentReplies={replies}
                    // viperIdComment={viperId}
                    // viperComment={text}
                    event={false}
                    reply={true}
                />
                {/* <span className="text-sm text-gray-400 flex justify-start self-end ml-2">
                    Replies: {replies}
                </span> */}
            </div>
        </div>
    )
}
