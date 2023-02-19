import { getViperById } from "../../../../lib/vipers"
import Image from "next/image"
import { cookies } from "next/headers"
import AddComment from "../../AddComment"
import { AddLike } from "../../AddLike"
import Link from "next/link"
import RePostBlog from "../../../../components/RePostBlog"
import ShowViper from "../../ShowViper"
import ShowFollows from "../../../profile/ShowFollows"
import ViperInfo from "../../../profile/ViperInfo"
import OrganizerInfo from "../../OrganizerInfo"
import { EventDate } from "../../EventDate"
import { firstLogin } from "../../../../lib/utils"

export async function CommentCard({
    eventId,
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
    showComment,
}: {
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
    showComment: string
}) {
    const blogger_id = eventId.replace(/['"]+/g, "")
    const blogger = await getViperById(blogger_id)
    const viper_id = viperId.replace(/['"]+/g, "")
    const viper = await getViperById(viper_id)
    const comment_id = commentId.replace(/[\W]+/g, "")

    const likedCookie = cookies().get(`_${timestamp}_is_liked`)?.value || "none"
    const commentCookie =
        cookies().get(`_${timestamp}_is_commented`)?.value || "none"
    const rePostCookie =
        cookies().get(`_${timestamp}_is_rePosted`)?.value || "none"

    return (
        <div className="space-y-2 lg:border-b lg:border-gray-800 pb-3 ml-5">
            <div className="flex items-center w-full max-w-lg  mx-auto ">
                {/* <div className="relative w-full max-w-lg p-4 mx-auto rounded-xl shadow-lg h-[9rem]"> */}
                <div className=" text-center sm:ml-4 sm:text-left">
                    <div className="grid grid-cols-9 gap-3 space-x-4">
                        <div className="col-start-1 col-span-1 ">
                            <Link href={`/dashboard/vipers/${viper_id}`}>
                                <Image
                                    src={`${
                                        firstLogin(blogger!.image)
                                            ? blogger?.image
                                            : `/vipers/${blogger?.image}`
                                    }`}
                                    alt={`/vipers/${blogger?.image}`}
                                    width={50}
                                    height={50}
                                    className="rounded-full "
                                />
                            </Link>
                        </div>
                        <div className="col-start-2 col-span-7 border-[1px] border-yellow-600/60  rounded-xl bg-gray-700/50 p-1 h-[7rem] w-full space-y-2">
                            {/* <Link href={`/dashboard/vipers/${viper_id}`}> */}
                            <div className=" col-start-1 col-span-2 max-h-auto">
                                <ShowViper
                                    viperName={blogger!.name}
                                    event={false}
                                    blog={blog}
                                    // viperImage={viper!.image}
                                >
                                    {/* @ts-expect-error Async Server Component */}
                                    <OrganizerInfo
                                        key={JSON.stringify(blogger?._id)}
                                        id={JSON.stringify(blogger?._id)}
                                        eventId={eventId}
                                    />
                                    <div className="mt-5 space-x-8 text-gray-300 text-xs">
                                        <ShowFollows
                                            follows={blogger!.follows?.length}
                                            followers={false}
                                            profile={false}
                                        >
                                            {blogger!.follows?.map(
                                                (followsId) => {
                                                    return (
                                                        /* @ts-expect-error Async Server Component */
                                                        <ViperInfo
                                                            key={JSON.stringify(
                                                                followsId
                                                            )}
                                                            id={JSON.stringify(
                                                                followsId
                                                            )}
                                                        />
                                                    )
                                                }
                                            )}
                                        </ShowFollows>

                                        <ShowFollows
                                            follows={blogger!.followers?.length}
                                            followers={true}
                                            profile={false}
                                        >
                                            {blogger!.followers?.map(
                                                (followersId) => {
                                                    return (
                                                        /* @ts-expect-error Async Server Component */
                                                        <ViperInfo
                                                            key={JSON.stringify(
                                                                followersId
                                                            )}
                                                            id={JSON.stringify(
                                                                followersId
                                                            )}
                                                        />
                                                    )
                                                }
                                            )}
                                        </ShowFollows>
                                    </div>
                                </ShowViper>
                            </div>
                            {/* <span className="text-gray-300 text-xs hover:text-gray-500-80 ">
                                        {viper?.name}
                                    </span> */}
                            {/* </Link> */}

                            <Link
                                href={`/dashboard/vipers/${blogger_id}`}
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
                                            {blogger?.name}
                                        </span>
                                    </span>
                                ) : (
                                    <div className="flex justify-between">
                                        <span className="flex justify-start text-yellow-500/80 text-xs ml-[5px]">
                                            {blogger?.name}
                                        </span>
                                        <EventDate date={timestamp} />
                                    </div>
                                )}
                                <span className="flex justify-start text-gray-300 text-sm mx-2  ">
                                    {text}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </div>

            <div className=" flex justify-items-start space-x-4 space-y-1 ml-24">
                <AddLike
                    eventId={blogger_id}
                    commentId={comment_id}
                    replyId={viper_id}
                    likes={likes}
                    timestamp={timestamp}
                    event={false}
                    reply={reply}
                    blog={blog}
                    likedCookie={likedCookie}
                />
                <AddComment
                    id={eventId}
                    commentId={comment_id}
                    commentReplies={replies}
                    // rePosts={rePosts}
                    viperIdImage={viper!.image}
                    viperIdName={viper!.name}
                    bloggerIdName={blogger!.name}
                    timestamp={timestamp}
                    rePostCookie={rePostCookie}
                    commentCookie={commentCookie}
                    event={event}
                    reply={reply}
                    blog={blog}
                    showComment={showComment}
                />

                <RePostBlog
                    bloggerId={eventId}
                    blogId={comment_id}
                    viperId={viperId}
                    rePosts={rePosts}
                    timestamp={timestamp}
                    rePostCookie={rePostCookie}
                />
            </div>
        </div>
    )
}
