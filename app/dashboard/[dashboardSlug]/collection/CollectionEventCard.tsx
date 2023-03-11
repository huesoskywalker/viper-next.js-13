import Link from "next/link"
import Image from "next/image"
import { EventInterface, getEventById } from "../../../../lib/events"
import { EventDate } from "../../../[id]/EventDate"
import { isEventCardAvailable } from "../../../../helpers/isEventCardAvailable"

export const CollectionEventCard = async ({
    viperId,
    eventId,
    href,
    collection,
}: {
    viperId: string
    eventId: string
    href: string
    collection: boolean
}) => {
    const event_id: string = eventId.slice(1, -1)
    const link: string = href.slice(1, -1)
    const event: EventInterface | null = await getEventById(event_id)

    const eventCardAvailable: boolean = await isEventCardAvailable(
        event_id,
        viperId
    )
    return (
        <>
            {eventCardAvailable || !collection ? (
                <Link href={link} className="group block">
                    <div className="space-y-1">
                        <Image
                            src={`/upload/${event?.image}`}
                            width={400}
                            height={400}
                            className="rounded-xl  group-hover:opacity-80"
                            alt={event?.title ?? "none"}
                            placeholder="blur"
                            blurDataURL={"product.imageBlur"}
                        />
                        <h2 className="flex justify-start font-semibold text-sm text-gray-100">
                            {event?.title}
                        </h2>
                        <p className="text-xs text-gray-300">
                            {event?.location}
                        </p>
                        <EventDate date={event!.date} collection={true} />
                    </div>
                </Link>
            ) : null}
        </>
    )
}
