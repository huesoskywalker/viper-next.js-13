import { getViperById } from "../../lib/vipers"
import Image from "next/image"
import { cookies } from "next/headers"
import AddComment from "../../components/AddComment"
import { AddLike } from "../../components/AddLike"
import Link from "next/link"
import RePostBlog from "./RePostBlog"
import ShowViper from "../[id]/ShowViper"
import OrganizerInfo from "../[id]/OrganizerInfo"
import { EventDate } from "../[id]/EventDate"
import { firstLogin } from "../../lib/utils"
import { Viper } from "../../types/viper"

export async function CommentCardTest({
    // eventId,
    viperId,
    commentId,
    text,
    timestamp,
    likes,
    replies,
    rePosts,
    event,
    blog,
    reply,
}: // showComment,
{
    eventId: string
    commentId: string
    viperId: string
    text: string
    timestamp: number
    likes: number
    replies: number
    rePosts: number
    event: boolean
    blog: boolean
    reply: boolean
    // showComment: string
}) {
    console.log(`---------------commentCard-----`)
    console.log(
        // eventId,
        viperId,
        commentId,
        text,
        timestamp,
        likes,
        replies,
        rePosts,
        blog,
        reply
        // showComment
    )

    const viper_id: string = viperId.replace(/['"]+/g, "")
    // const blogger_id: string = eventId.replace(/['"]+/g, "")
    const comment_id: string = commentId.replace(/[\W]+/g, "")
    const viper: Viper | null = await getViperById(viper_id)
    // const blogger: Viper | null = await getViperById(blogger_id)
    if (!viper) throw new Error("No viper bro")
    // if (!blogger) throw new Error("No blogger bro")

    const likedCookie: string =
        cookies().get(`_${timestamp}_is_liked`)?.value || "none"
    const commentCookie =
        cookies().get(`_${timestamp}_is_commented`)?.value || "none"
    const rePostCookie: string =
        cookies().get(`_${timestamp}_is_rePosted`)?.value || "none"
    return (
        <div className="space-y-2 lg:border-b lg:border-gray-800 pb-3 ml-5">
            <div className="flex items-center w-full max-w-lg  mx-auto ">
                <div className=" text-center sm:ml-4 sm:text-left">
                    <div className="grid grid-cols-9 gap-3 space-x-4">
                        <div className="col-start-1 col-span-1 ">
                            <Link href={`/dashboard/vipers/${viper_id}`}>
                                <Image
                                    src={`${
                                        firstLogin(viper.image)
                                            ? viper.image
                                            : `/vipers/${viper.image}`
                                    }`}
                                    alt={`/vipers/${viper.image}`}
                                    width={50}
                                    height={50}
                                    className="rounded-full "
                                />
                            </Link>
                        </div>
                        <div className="col-start-2 col-span-7 border-[1px] border-yellow-600/60  rounded-xl bg-gray-700/50 p-2 h-[8rem] w-[22rem] space-y-2">
                            <div className=" col-start-1 col-span-2 max-h-auto">
                                <ShowViper
                                    viperName={viper.name}
                                    event={event}
                                    blog={blog}
                                    // viperImage={viper!.image}
                                >
                                    {/* @ts-expect-error Async Server Component */}
                                    <OrganizerInfo
                                        key={JSON.stringify(viper._id)}
                                        organizerId={JSON.stringify(viper._id)}
                                        event={event}
                                    />
                                </ShowViper>
                            </div>
                            <Link
                                href={`/dashboard/vipers/${viperId}`}
                                className="space-y-2"
                            >
                                {blog && reply ? (
                                    <span className="text-gray-400/70 text-xs flex align-top">
                                        {likedCookie !== "none"
                                            ? "Liked "
                                            : commentCookie !== "none"
                                            ? "Replying to"
                                            : rePostCookie !== "none"
                                            ? "Re posted from"
                                            : "Talking"}
                                        <span className="text-yellow-500/80 text-xs ml-[5px]">
                                            {viper.name}
                                        </span>
                                    </span>
                                ) : (
                                    <div className="flex justify-between">
                                        <span className="flex justify-start text-yellow-500/80 text-xs ml-[5px]">
                                            {viper.name}
                                        </span>
                                        <EventDate
                                            date={timestamp}
                                            collection={false}
                                        />
                                    </div>
                                )}
                                <span className="flex justify-start text-gray-300 text-sm mx-2  ">
                                    {text}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className=" flex justify-items-start space-x-4 space-y-1 ml-24">
                {/* @ts-expect-error Server Component */}
                <AddLike
                    eventId={viperId}
                    commentId={comment_id}
                    replyId={viper_id}
                    likes={likes}
                    timestamp={timestamp}
                    event={event}
                    reply={reply}
                    blog={blog}
                    likedCookie={likedCookie}
                />
                <AddComment
                    id={viperId}
                    commentId={comment_id}
                    commentReplies={replies}
                    viperIdImage={viper.image}
                    viperIdName={viper.name}
                    bloggerIdName={viper.name}
                    timestamp={timestamp}
                    commentCookie={commentCookie}
                    event={event}
                    reply={reply}
                    blog={blog}
                    // showComment={showComment}
                />

                {/* <RePostBlog
                    bloggerId={eventId}
                    blogId={comment_id}
                    viperId={viperId}
                    rePosts={rePosts}
                    timestamp={timestamp}
                    rePostCookie={rePostCookie}
                /> */}
            </div>
        </div>
    )
}
