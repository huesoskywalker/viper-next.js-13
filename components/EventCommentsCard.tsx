import { Comments, getEventById } from "../lib/events"
import { getViperById } from "../lib/vipers"
import Image from "next/image"
import { cookies } from "next/headers"
import AddComment from "../app/[id]/AddComment"
import { AddLike } from "../app/[id]/AddLike"
import Link from "next/link"

export async function EventCommentsCard({
    eventId,
    viperId,
    commentId,
    text,
    commentLikes,
    commentReplies,
}: // comment,
{
    eventId: string
    viperId: string
    commentId: Object
    text: string
    commentLikes: number
    commentReplies: number
    // comment: Comments
}) {
    const viper = await getViperById(viperId)
    const stringifyCommentId = JSON.stringify(commentId)
    const comment_id = stringifyCommentId.replace(/['"]+/g, "")

    const likedCookie =
        cookies().get(`_${comment_id}_is_liked`)?.value || "none"
    return (
        <div className="space-y-2">
            <Link
                href={`/${eventId}/${viperId}/${comment_id}`}
                className="space-y-4"
            >
                {/* <div className="space-y-6"> */}
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
                {/* </div> */}
            </Link>

            <div className="flex justify-items-start space-x-4 space-y-1">
                <AddLike
                    eventId={eventId}
                    commentId={comment_id}
                    likes={commentLikes}
                    replyId={""}
                    likedCookie={likedCookie}
                    event={false}
                    reply={false}
                    blog={false}
                />

                <AddComment
                    id={eventId}
                    commentId={comment_id}
                    commentReplies={commentReplies}
                    // viperComment={comment.text}
                    // viperIdComment={comment.viperId}
                    event={false}
                    reply={true}
                    blog={false}
                />
            </div>
        </div>
    )
}
