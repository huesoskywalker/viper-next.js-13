import Image from "next/image"
import { Suspense } from "react"
import { EventInfo, InfoSkeleton } from "./EventInfo"
import { AddLike } from "../../components/AddLike"
import { cookies } from "next/headers"
import AddComment from "../../components/AddComment"
import ShowViper from "./ShowViper"
import OrganizerInfo from "./OrganizerInfo"
import { EventInterface } from "../../types/event"
import { getCurrentViper } from "../../lib/session"
import { Session } from "next-auth"
import { getEventById } from "../../lib/events"

export async function Event({ eventId }: { eventId: string }) {
    const likedCookie: string = cookies().get("_is_liked")?.value || "none"
    const viperSession: Promise<Session | null> = getCurrentViper()
    const event: Promise<EventInterface | null> = getEventById(eventId)

    const [currentViper, selectedEvent] = await Promise.all([
        viperSession,
        event,
    ])

    // This will activate the closest `error.ts` Error Boundary
    if (!currentViper) throw new Error("No Session bro")
    if (!selectedEvent)
        return (
            <div className="text-yellow-400 text-sm">Build up, from Event</div>
        )

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
                        currentViperId={currentViper.user.id}
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
                    viperName={selectedEvent.organizer.name}
                    event={true}
                    blog={true}
                >
                    <Suspense
                        fallback={
                            <div className="text-yellow-500 text-lg">
                                suspense from event...
                            </div>
                        }
                    >
                        {/* @ts-expect-error Async Server Component */}
                        <OrganizerInfo
                            key={selectedEvent.organizer.id}
                            organizerId={selectedEvent.organizer.id}
                            event={true}
                        />
                    </Suspense>
                </ShowViper>
            </div>
            <div className="text-gray-300 col-start-4">
                {/* @ts-expect-error Async Server Component */}
                <AddLike
                    eventId={eventId}
                    commentId={JSON.stringify(selectedEvent._id)}
                    replyId={JSON.stringify(selectedEvent._id)}
                    likes={selectedEvent.likes.length}
                    timestamp={JSON.stringify(selectedEvent.creationDate)}
                    event={true}
                    reply={false}
                    blog={false}
                    likedCookie={likedCookie}
                />

                <AddComment
                    id={eventId}
                    commentId={JSON.stringify(selectedEvent._id)}
                    viperIdName={undefined}
                    commentReplies={selectedEvent.comments.length}
                    timestamp={null}
                    commentCookie={"none"}
                    event={true}
                    reply={false}
                    blog={false}
                />
            </div>
        </div>
    )
}
