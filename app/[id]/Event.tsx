import Image from "next/image"
import { Suspense } from "react"
import { type EventInterface } from "../../lib/events"
import { EventInfo, InfoSkeleton } from "./EventInfo"
import Link from "next/link"
import { AddLike } from "./AddLike"
import { cookies } from "next/headers"
import AddComment from "./AddComment"
import { getViperById } from "../../lib/vipers"

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
                        className="hidden rounded-lg  lg:block"
                        alt={selectedEvent?.title}
                        height={400}
                        width={400}
                    />

                    <div className="flex space-x-2">
                        <div className="w-1/3">
                            <Image
                                src={`/upload/${selectedEvent?.image}`}
                                className="rounded-lg grayscale"
                                alt={selectedEvent?.title}
                                height={180}
                                width={180}
                            />
                        </div>
                        <div className="w-1/3">
                            <Image
                                src={`/upload/${selectedEvent?.image}`}
                                className="rounded-lg grayscale"
                                alt={selectedEvent?.title}
                                height={180}
                                width={180}
                            />
                        </div>
                        <div className="w-1/3">
                            <Image
                                src={`/upload/${selectedEvent?.image}`}
                                className="rounded-lg grayscale"
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
            <div className="mt-2 col-start-1 col-span-2">
                <Link
                    href={`/vipers/${viper?._id}`}
                    className="truncate text-xl font-medium text-white lg:text-2xl"
                >
                    <Image
                        src={`/vipers/${viper?.image}`}
                        alt={viper!.image}
                        width={50}
                        height={50}
                        className="rounded-full"
                    />
                    <span>{viper?.name}</span>
                </Link>
            </div>
            <div className="text-gray-300 col-start-4">
                <AddLike
                    eventId={id}
                    commentId={""}
                    replyId={""}
                    likes={selectedEvent?.likes.length}
                    event={true}
                    reply={false}
                    likedCookie={likedCookie}
                />

                <AddComment
                    id={id}
                    commentReplies={selectedEvent?.comments.length}
                    commentId={""}
                    event={true}
                    reply={false}
                />
            </div>
        </div>
    )
}
