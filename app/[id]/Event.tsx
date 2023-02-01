import Image from "next/image"
import { Suspense } from "react"
import { type EventInterface } from "../../lib/events"
import { EventInfo, InfoSkeleton } from "./EventInfo"
import { AddLike } from "./AddLike"
import { cookies } from "next/headers"
import AddComment from "./AddComment"
import { getViperById } from "../../lib/vipers"
import ShowViper from "./ShowViper"
import OrganizerInfo from "./OrganizerInfo"
import ShowFollows from "../profile/ShowFollows"
import ViperInfo from "../profile/ViperInfo"

export async function Event({
    selectedEvent,
    id,
}: {
    selectedEvent: EventInterface
    id: string
}) {
    const likedCookie = cookies().get("_is_liked")?.value || "none"

    const viper = await getViperById(selectedEvent?.organizer.id)

    return (
        <div className="grid grid-cols-4 gap-6">
            <div className="col-span-full lg:col-span-1">
                <div className="space-y-2">
                    <Image
                        src={`/upload/${selectedEvent?.image}`}
                        alt={selectedEvent?.title}
                        height={400}
                        width={400}
                        className="hidden rounded-lg  lg:block max-h-24  object-cover object-center"
                    />

                    <div className="flex space-x-2">
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
                    </div>
                </div>
            </div>

            <div className="col-span-full space-y-4 lg:col-span-2">
                <div className="truncate text-xl font-medium text-white lg:text-2xl">
                    {selectedEvent?.title}
                </div>

                {/* <ProductRating rating={selectedEvent.rating} /> */}

                <div className="space-y-4 text-sm text-gray-200">
                    {selectedEvent?.content}
                </div>
                <div className="space-y-4 text-sm text-gray-200 flex">
                    {selectedEvent?.address}
                </div>
            </div>

            <div className="col-span-full lg:col-span-1">
                <Suspense fallback={<InfoSkeleton />}>
                    {/* @ts-expect-error Async Server Component */}
                    <EventInfo selectedEvent={selectedEvent} />
                </Suspense>
            </div>
            <div className="mt-2 col-start-1 col-span-2 max-h-auto">
                <ShowViper
                    viperName={viper!.name}
                    // viperImage={viper!.image}
                >
                    {/* @ts-expect-error Async Server Component */}
                    <OrganizerInfo
                        key={JSON.stringify(viper?._id)}
                        id={JSON.stringify(viper?._id)}
                        eventId={id}
                    />
                    <div className="mt-5 space-x-8 text-gray-300 text-xs">
                        <ShowFollows
                            follows={viper!.follows?.length}
                            followers={false}
                            profile={false}
                        >
                            {viper!.follows?.map((followsId) => {
                                return (
                                    /* @ts-expect-error Async Server Component */
                                    <ViperInfo key={followsId} id={followsId} />
                                )
                            })}
                        </ShowFollows>

                        <ShowFollows
                            follows={viper!.followers?.length}
                            followers={false}
                            profile={false}
                        >
                            {viper!.followers?.map((followsId) => {
                                return (
                                    /* @ts-expect-error Async Server Component */
                                    <ViperInfo key={followsId} id={followsId} />
                                )
                            })}
                        </ShowFollows>
                    </div>
                </ShowViper>
            </div>
            <div className="text-gray-300 col-start-4">
                <AddLike
                    eventId={id}
                    commentId={JSON.stringify(selectedEvent._id)}
                    replyId={""}
                    likes={selectedEvent?.likes.length}
                    // timestamp={selectedEvent.timestamp}
                    event={true}
                    reply={false}
                    blog={false}
                    likedCookie={likedCookie}
                />

                <AddComment
                    id={id}
                    commentId={JSON.stringify(selectedEvent._id)}
                    commentReplies={selectedEvent?.comments.length}
                    // timestamp={0}
                    event={true}
                    reply={false}
                    blog={false}
                />
            </div>
        </div>
    )
}
