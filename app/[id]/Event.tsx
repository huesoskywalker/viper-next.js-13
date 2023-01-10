// import { ProductRating } from "#/ui/ProductRating"

import Image from "next/image"
import { Suspense } from "react"
import { type EventInterface } from "../../lib/events"
import { EventInfo, InfoSkeleton } from "./EventInfo"
import Link from "next/link"
import AddComment from "./AddComment"
import { AddLike } from "./AddLike"
import { cookies } from "next/headers"

export async function Event({
    selectedEvent,
    id,
}: {
    selectedEvent: EventInterface
    id: string
}) {
    console.log(selectedEvent)
    const likedCookie = cookies().get("_is_liked")?.value || "none"
    return (
        <div className="grid grid-cols-4 gap-6">
            <div className="col-span-full lg:col-span-1">
                <div className="space-y-2">
                    <Image
                        src={`/upload/${selectedEvent.image}`}
                        className="hidden rounded-lg grayscale lg:block"
                        alt={selectedEvent.title}
                        height={400}
                        width={400}
                    />

                    <div className="flex space-x-2">
                        <div className="w-1/3">
                            <Image
                                src={`/upload/${selectedEvent.image}`}
                                className="rounded-lg grayscale"
                                alt={selectedEvent.title}
                                height={180}
                                width={180}
                            />
                        </div>
                        <div className="w-1/3">
                            <Image
                                src={`/upload/${selectedEvent.image}`}
                                className="rounded-lg grayscale"
                                alt={selectedEvent.title}
                                height={180}
                                width={180}
                            />
                        </div>
                        <div className="w-1/3">
                            <Image
                                src={`/upload/${selectedEvent.image}`}
                                className="rounded-lg grayscale"
                                alt={selectedEvent.title}
                                height={180}
                                width={180}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-span-full space-y-4 lg:col-span-2">
                <div className="truncate text-xl font-medium text-white lg:text-2xl">
                    {selectedEvent.title}
                </div>

                {/* <ProductRating rating={selectedEvent.rating} /> */}

                <div className="space-y-4 text-sm text-gray-200">
                    {selectedEvent.content}
                </div>
                <div className="space-y-4 text-sm text-gray-200 flex">
                    {selectedEvent.address}
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
                    href={`/vipers/${selectedEvent?.organizer.id}`}
                    className="truncate text-xl font-medium text-white lg:text-2xl"
                >
                    <Image
                        src={`/vipers/${selectedEvent.organizer.image}`}
                        alt={selectedEvent.organizer.image}
                        width={50}
                        height={50}
                        className="rounded-full"
                    />
                    {selectedEvent?.organizer.name}
                </Link>
            </div>
            <div className="text-gray-300 col-start-4">
                <AddLike
                    id={id}
                    likes={selectedEvent.likes.length}
                    likedCookie={likedCookie}
                />
                <AddComment id={id} comments={selectedEvent.comments.length} />
            </div>
        </div>
    )
}
