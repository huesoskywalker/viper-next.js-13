import Image from "next/image"
import { Suspense } from "react"
import { EventInfo, InfoSkeleton } from "./EventInfo"
import { AddLike } from "./AddLike"
import { cookies } from "next/headers"
import AddComment from "./AddComment"
import { getViperById } from "../../lib/vipers"
import ShowViper from "./ShowViper"
import OrganizerInfo from "./OrganizerInfo"
import ShowFollows from "../profile/ShowFollows"
import ViperInfo from "../profile/ViperInfo"
import { getEventById } from "../../lib/events"

export async function Event({ eventId }: { eventId: string }) {
    const likedCookie = cookies().get("_is_liked")?.value || "none"
    const selectedEvent = await getEventById(eventId)
    if (!selectedEvent) return
    const viper = await getViperById(selectedEvent.organizer.id)
    if (!viper) return

    return (
        <div className="grid grid-cols-4 gap-6">
            <div className="col-span-full lg:col-span-1">
                <div className="space-y-2">
                    <Image
                        src={`/upload/${selectedEvent.image}`}
                        alt={selectedEvent.title}
                        height={400}
                        width={400}
                        className="hidden rounded-lg  lg:block max-h-24  object-cover object-center"
                    />

                    {/* <div className="flex space-x-2">
                        <div className="w-1/3">
                            <Image
                                src={`/upload/${selectedEvent?.image}`}
                                className="rounded-lg grayscale max-h-8  object-cover object-center"
                                alt={selectedEvent?.title}
                                height={180}
                                width={180}
                            />
                        </div>
                        <div className="w-1/3">
                            <Image
                                src={`/upload/${selectedEvent?.image}`}
                                className="rounded-lg grayscale max-h-8  object-cover object-center"
                                alt={selectedEvent?.title}
                                height={180}
                                width={180}
                            />
                        </div>
                        <div className="w-1/3">
                            <Image
                                src={`/upload/${selectedEvent?.image}`}
                                className="rounded-lg grayscale max-h-8  object-cover object-center"
                                alt={selectedEvent?.title}
                                height={180}
                                width={180}
                            />
                        </div>
                    </div> */}
                </div>
            </div>

            <div className="col-span-full space-y-4 lg:col-span-2">
                <div className="truncate text-xl font-medium text-white lg:text-2xl">
                    {selectedEvent.title}
                </div>
                <div className="space-y-4 text-sm text-gray-200">
                    {selectedEvent.content}
                </div>
                <div className="space-y-4 text-sm text-gray-200 flex justify-start">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-[18px] h-[18px] mr-1 text-red-500/80"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {selectedEvent.address}
                </div>
            </div>

            <div className="col-span-full lg:col-span-1">
                <Suspense fallback={<InfoSkeleton />}>
                    {/* @ts-expect-error Async Server Component */}
                    <EventInfo
                        eventId={eventId}
                        eventDate={selectedEvent.date}
                        eventLocation={selectedEvent.location}
                        eventPrice={selectedEvent.price}
                        productId={selectedEvent.productId}
                        eventEntries={selectedEvent.entries}
                    />
                </Suspense>
            </div>
            <div className="mt-2 col-start-1 col-span-2 max-h-auto">
                <ShowViper
                    viperName={viper.name}
                    event={true}
                    blog={true}
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
                            {viper.follows.map((followsId) => {
                                return (
                                    /* @ts-expect-error Async Server Component */
                                    <ViperInfo
                                        key={JSON.stringify(followsId)}
                                        id={JSON.stringify(followsId)}
                                    />
                                )
                            })}
                        </ShowFollows>

                        <ShowFollows
                            follows={viper.followers.length}
                            followers={true}
                            profile={false}
                        >
                            {viper!.followers?.map((followsId) => {
                                return (
                                    /* @ts-expect-error Async Server Component */
                                    <ViperInfo
                                        key={JSON.stringify(followsId)}
                                        id={JSON.stringify(followsId)}
                                    />
                                )
                            })}
                        </ShowFollows>
                    </div>
                </ShowViper>
            </div>
            <div className="text-gray-300 col-start-4">
                <AddLike
                    eventId={eventId}
                    commentId={JSON.stringify(selectedEvent._id)}
                    replyId={JSON.stringify(selectedEvent._id)}
                    likes={selectedEvent.likes.length}
                    timestamp={selectedEvent.creationDate}
                    event={true}
                    reply={false}
                    blog={false}
                    likedCookie={likedCookie}
                />

                <AddComment
                    id={eventId}
                    commentId={JSON.stringify(selectedEvent._id)}
                    viperIdImage={undefined}
                    viperIdName={undefined}
                    bloggerIdName={undefined}
                    commentReplies={selectedEvent.comments.length}
                    timestamp={null}
                    commentCookie={"none"}
                    event={true}
                    reply={false}
                    blog={false}
                    showComment={undefined}
                />
            </div>
        </div>
    )
}
