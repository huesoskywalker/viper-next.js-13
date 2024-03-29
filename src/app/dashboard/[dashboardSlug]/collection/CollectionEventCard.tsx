import Link from "next/link"
import Image from "next/image"
import { isEventCardAvailable } from "@/helpers/isEventCardAvailable"
import { EventInterface } from "@/types/event"
import { EventDate } from "@/app/[id]/EventDate"
import { getEventById } from "@/lib/events"

export const CollectionEventCard = async ({
    viperId,
    eventId,
    href,
    isCollection,
}: {
    viperId: string
    eventId: string
    href: string
    isCollection: boolean
}) => {
    const event_id: string = eventId.slice(1, -1)
    const link: string = href.slice(1, -1)
    const eventData: Promise<EventInterface | null> = getEventById(event_id)

    const eventCardAvailableData: Promise<boolean> = isEventCardAvailable(event_id, viperId)

    const [event, eventCardAvailable] = await Promise.all([eventData, eventCardAvailableData])

    return (
        <>
            {eventCardAvailable || !isCollection ? (
                <Link href={link} className="group block">
                    <div className="space-y-1">
                        <Image
                            data-test="event-image"
                            src={`/upload/${event?.image}`}
                            width={400}
                            height={400}
                            // className="rounded-xl max-h-[96px] max-auto group-hover:opacity-80"

                            className="rounded-xl max-h-36 max-w-auto group-hover:opacity-80"
                            alt={event?.title ?? "none"}
                            placeholder="blur"
                            blurDataURL={"product.imageBlur"}
                        />
                        <h2
                            data-test="event-title"
                            className="flex justify-start font-semibold text-sm text-gray-100"
                        >
                            {event?.title}
                        </h2>
                        <p data-test="event-location" className="text-xs text-gray-300">
                            {event?.location}
                        </p>
                        <EventDate date={event!.date} collection={true} />
                    </div>
                </Link>
            ) : null}
        </>
    )
}
