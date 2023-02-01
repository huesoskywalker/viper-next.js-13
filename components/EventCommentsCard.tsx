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
    timestamp,
}: {
    eventId: string
    viperId: string
    commentId: string
    text: string
    commentLikes: number
    commentReplies: number
    timestamp: number
}) {
    const viper_id = viperId.replace(/['"]+/g, "")
    const stringifyCommentId = JSON.stringify(commentId)
    const comment_id = stringifyCommentId.replace(/['"]+/g, "")
    const viper = await getViperById(viper_id)
    const event = await getEventById(eventId)

    const likedCookie =
        cookies().get(`_${comment_id}_is_liked`)?.value || "none"
    return (
        <div className="space-y-2 lg:border-b lg:border-gray-800 pb-3 ml-5">
            <div className="flex items-center  ">
                <div className="relative w-full max-w-lg p-4 mx-auto bg-gray-800/70 rounded-xl shadow-lg h-[9rem]">
                    <div className=" text-center sm:ml-4 sm:text-left">
                        <div className="grid grid-cols-9 gap-3">
                            <div className="col-start-1 col-span-1 ">
                                <Link href={`/dashboard/vipers/${viper_id}`}>
                                    <Image
                                        src={`/vipers/${viper?.image}`}
                                        alt={`/vipers/${viper?.image}`}
                                        width={50}
                                        height={50}
                                        className="rounded-full "
                                    />
                                </Link>
                            </div>
                            <div className="col-start-2 col-span-7 border-[1px] border-slate-600 rounded-xl bg-gray-700/50 p-2 h-[7rem] w-full space-y-2">
                                <Link href={`/dashboard/vipers/${viper_id}`}>
                                    <span className="text-gray-300 text-xs hover:text-gray-500-80 ">
                                        {viper?.name}
                                    </span>
                                </Link>
                                <Link
                                    href={`/${eventId}/${comment_id}/${viper_id}`}
                                    className="space-y-4 "
                                >
                                    <span className="text-gray-400/70 text-xs flex align-top">
                                        Commenting on{" "}
                                        <span className="text-blue-500/80 text-xs ml-[5px]">
                                            {" "}
                                            {event?.title}
                                        </span>
                                    </span>
                                    <span className="flex justify-start text-gray-300 text-sm mx-2 mt-2 ">
                                        {text}
                                    </span>
                                </Link>
                            </div>
                        </div>
                        {/* <div className="items-center gap-2 mt-3 grid grid-cols-6 "></div> */}
                    </div>
                </div>
            </div>

            <div className="flex justify-items-start space-x-4 space-y-1 ml-5">
                <AddLike
                    eventId={eventId}
                    commentId={comment_id}
                    replyId={""}
                    likes={commentLikes}
                    timestamp={0}
                    event={false}
                    reply={false}
                    blog={false}
                    likedCookie={likedCookie}
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
