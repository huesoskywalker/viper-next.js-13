import { EventInterface, getEventById } from "../../lib/events"
import { Viper, getViperById } from "../../lib/vipers"
import Image from "next/image"
import { cookies } from "next/headers"
import AddComment from "../../components/AddComment"
import { AddLike } from "../../components/AddLike"
import Link from "next/link"
import { firstLogin } from "../../lib/utils"
import ShowFollows from "../profile/ShowFollows"
import OrganizerInfo from "./OrganizerInfo"
import ShowViper from "./ShowViper"
import ViperInfo from "../profile/ViperInfo"
import { EventDate } from "./EventDate"
import { delay } from "../../lib/delay"

export async function EventCommentsCard({
    eventId,
    commentId,
    viperId,
    commentViperId,
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
    commentId: string
    viperId: string
    commentViperId: string
    text: string
    commentLikes: number
    commentReplies: number
    replyId: string | undefined
    timestamp: number
    event: boolean
    reply: boolean
    blog: boolean
}) {
    const viper_id: string = viperId.replace(/['"]+/g, "")
    const comment_id: string = commentId.replace(/['"]+/g, "")

    const commentViper: Viper | undefined = await getViperById(commentViperId)
    const viper: Viper | undefined = await getViperById(viper_id)
    if (!viper) return
    const fullEvent: EventInterface | null = await getEventById(eventId)
    if (!fullEvent) return
    const likedCookie =
        cookies().get(`_${reply ? replyId : comment_id}_is_liked`)?.value ||
        "none"

    await delay(1500)
    return (
        <div className=" space-y-2 lg:border-b lg:border-gray-800 pb-3 ml-5">
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
                        <div className="col-start-2 col-span-7 border-[1px] border-slate-600 rounded-xl bg-gray-700/50 p-[6px] h-[7rem] w-[22rem]  space-y-2">
                            <div className="flex justify-between  max-h-auto">
                                <ShowViper
                                    viperName={viper.name}
                                    event={false}
                                    blog={blog}
                                    // viperImage={viper!.image}
                                >
                                    {/* @ts-expect-error Async Server Component */}
                                    <OrganizerInfo
                                        key={JSON.stringify(viper._id)}
                                        id={JSON.stringify(viper._id)}
                                        event={true}
                                    />
                                    <div className="mt-5 space-x-8 text-gray-300 text-xs">
                                        <ShowFollows
                                            follows={viper.follows.length}
                                            followers={false}
                                            profile={false}
                                        >
                                            {viper.follows.map((follows) => {
                                                return (
                                                    /* @ts-expect-error Async Server Component */
                                                    <ViperInfo
                                                        key={JSON.stringify(
                                                            follows._id
                                                        )}
                                                        id={JSON.stringify(
                                                            follows._id
                                                        )}
                                                    />
                                                )
                                            })}
                                        </ShowFollows>

                                        <ShowFollows
                                            follows={viper.followers.length}
                                            followers={true}
                                            profile={false}
                                        >
                                            {viper.followers.map(
                                                (followers) => {
                                                    return (
                                                        /* @ts-expect-error Async Server Component */
                                                        <ViperInfo
                                                            key={JSON.stringify(
                                                                followers._id
                                                            )}
                                                            id={JSON.stringify(
                                                                followers._id
                                                            )}
                                                        />
                                                    )
                                                }
                                            )}
                                        </ShowFollows>
                                    </div>
                                </ShowViper>
                                <EventDate
                                    date={timestamp}
                                    collection={false}
                                />
                            </div>

                            <Link
                                href={`/${eventId}/${comment_id}/${viper_id}`}
                                className="space-y-2"
                            >
                                {!reply ? (
                                    <span className="text-gray-400/70 text-xs flex align-top">
                                        Commenting on{" "}
                                        <span className="text-blue-500/80 text-xs ml-[5px]">
                                            {" "}
                                            {fullEvent.title}
                                        </span>
                                    </span>
                                ) : (
                                    <span className="text-gray-400/70 text-xs flex align-top">
                                        Replying to{" "}
                                        <span className="text-blue-500/80 text-xs ml-[5px]">
                                            {commentViper?.name}
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
            </div>
            <div className="flex justify-items-start space-x-4 space-y-1 ml-32">
                {/* @ts-expect-error Async Server Component */}
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
                        viperIdImage={undefined}
                        viperIdName={undefined}
                        bloggerIdName={undefined}
                        commentReplies={commentReplies}
                        timestamp={null}
                        commentCookie={"none"}
                        event={false}
                        reply={true}
                        blog={false}
                        showComment={undefined}
                    />
                ) : null}
            </div>
        </div>
    )
}
