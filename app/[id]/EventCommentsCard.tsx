import { Comments, getEventById } from "../../lib/events"
import { getViperById } from "../../lib/vipers"
import Image from "next/image"
import { cookies } from "next/headers"
import AddComment from "./AddComment"
import { AddLike } from "./AddLike"
import Link from "next/link"
import { firstLogin } from "../../lib/utils"
import ShowFollows from "../profile/ShowFollows"
import OrganizerInfo from "./OrganizerInfo"
import ShowViper from "./ShowViper"
import ViperInfo from "../profile/ViperInfo"
import { EventDate } from "./EventDate"

export async function EventCommentsCard({
    eventId,
    viperId,
    commentId,
    viperCommentId,
    text,
    commentLikes,
    commentReplies,
    replyId,
    timestamp,
    event,
    reply,
    blog,
}: {
    eventId: string
    viperId: string
    commentId: string
    viperCommentId: string
    text: string
    commentLikes: number
    commentReplies: number
    replyId: string
    timestamp: number
    event: boolean
    reply: boolean
    blog: boolean
}) {
    const viper_id = viperId.replace(/['"]+/g, "")
    const comment_id = commentId.replace(/['"]+/g, "")
    const viperComment = await getViperById(viperCommentId)
    const viper = await getViperById(viper_id)
    const fullEvent = await getEventById(eventId)
    const likedCookie =
        cookies().get(`_${reply ? replyId : comment_id}_is_liked`)?.value ||
        "none"
    return (
        <div className=" space-y-2 lg:border-b lg:border-gray-800 pb-3 ml-5">
            <div className="flex items-center w-full max-w-lg  mx-auto ">
                {/* <div className="relative w-full max-w-lg p-4 mx-auto rounded-xl shadow-lg h-[9rem]"> */}
                <div className=" text-center sm:ml-4 sm:text-left">
                    <div className="grid grid-cols-9 gap-3 space-x-4">
                        <div className="col-start-1 col-span-1 ">
                            <Link href={`/dashboard/vipers/${viper_id}`}>
                                <Image
                                    src={`${
                                        firstLogin(viper!.image)
                                            ? viper?.image
                                            : `/vipers/${viper?.image}`
                                    }`}
                                    alt={`/vipers/${viper?.image}`}
                                    width={50}
                                    height={50}
                                    className="rounded-full "
                                />
                            </Link>
                        </div>
                        <div className="col-start-2 col-span-7 border-[1px] border-slate-600 rounded-xl bg-gray-700/50 p-[6px] h-[7rem] w-[22rem]  space-y-2">
                            {/* <Link href={`/dashboard/vipers/${viper_id}`}> */}
                            <div className="flex justify-between  max-h-auto">
                                <ShowViper
                                    viperName={viper!.name}
                                    event={false}
                                    blog={blog}
                                    // viperImage={viper!.image}
                                >
                                    {/* @ts-expect-error Async Server Component */}
                                    <OrganizerInfo
                                        key={JSON.stringify(viper?._id)}
                                        id={JSON.stringify(viper?._id)}
                                        event={true}
                                    />
                                    <div className="mt-5 space-x-8 text-gray-300 text-xs">
                                        <ShowFollows
                                            follows={viper!.follows?.length}
                                            followers={false}
                                            profile={false}
                                        >
                                            {viper!.follows?.map(
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
                                            follows={viper!.followers?.length}
                                            followers={true}
                                            profile={false}
                                        >
                                            {viper!.followers?.map(
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
                                <EventDate date={timestamp} />
                            </div>
                            {/* <span className="text-gray-300 text-xs hover:text-gray-500-80 ">
                                        {viper?.name}
                                    </span> */}
                            {/* </Link> */}

                            <Link
                                href={`/${eventId}/${comment_id}/${viper_id}`}
                                className="space-y-2"
                            >
                                {!reply ? (
                                    <span className="text-gray-400/70 text-xs flex align-top">
                                        Commenting on{" "}
                                        <span className="text-blue-500/80 text-xs ml-[5px]">
                                            {" "}
                                            {fullEvent?.title}
                                        </span>
                                    </span>
                                ) : (
                                    <span className="text-gray-400/70 text-xs flex align-top">
                                        Replying to{" "}
                                        <span className="text-blue-500/80 text-xs ml-[5px]">
                                            {viperComment?.name}
                                        </span>
                                    </span>
                                )}
                                <span className="flex justify-start text-gray-300 text-xs mx-2  ">
                                    {text}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </div>
            <div className="flex justify-items-start space-x-4 space-y-1 ml-32">
                <AddLike
                    eventId={eventId}
                    commentId={comment_id}
                    replyId={replyId}
                    likes={commentLikes}
                    timestamp={0}
                    event={event}
                    reply={reply}
                    blog={blog}
                    likedCookie={likedCookie}
                />
                {!reply ? (
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
                ) : null}
            </div>
        </div>
    )
}
