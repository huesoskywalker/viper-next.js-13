import { Comments, getEventById, Reply } from "../lib/events"
import { getViperById } from "../lib/vipers"
import Image from "next/image"
import { cookies } from "next/headers"
import AddComment from "../app/[id]/AddComment"
import { AddLike } from "../app/[id]/AddLike"
import Link from "next/link"

export async function EventCommentsCard({
    comment,
    id,
}: {
    comment: Comments
    id: string
}) {
    const viper = await getViperById(comment.viperId)
    const stringifyCommentId = JSON.stringify(comment._id)
    const commentId = stringifyCommentId.replace(/['"]+/g, "")

    const eventId = await getEventById(id)

    const likedCookie = cookies().get(`_${commentId}_is_liked`)?.value || "none"
    return (
        <div className="space-y-2">
            <Link
                href={`/${eventId?._id}/${comment.viperId}/${commentId}`}
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
                <div className="text-gray-300 text-base font-light">
                    {comment.text}
                </div>
                {/* </div> */}
            </Link>

            <div className="flex justify-items-start space-x-4 space-y-1">
                <AddLike
                    eventId={id}
                    likes={comment.likes.length}
                    commentId={commentId}
                    comment={comment.text}
                    likedCookie={likedCookie}
                    event={false}
                />
                {/* {comment.likes?.map((viperId) => {
                        return <ViperInfo key={viperId} id={viperId} />
                    })} */}
                {/* </AddLike> */}
                <AddComment
                    id={id}
                    comments={comment.replies?.length}
                    viperComment={comment.text}
                    viperIdComment={comment.viperId}
                    event={false}
                />
                {/* {comment.replies?.map((reply) => {
                            return (
                                
                                <ReplyInfo
                                    key={reply.viperId}
                                    replyId={reply.viperId}
                                    replyText={reply.reply}
                                    // replyId={reply.viperId}
                                    // replyText={reply.reply}
                                />
                            )
                        })} */}
            </div>
        </div>
    )
}
