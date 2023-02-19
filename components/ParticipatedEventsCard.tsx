import Link from "next/link"
import { EventShowTime } from "./EventShowTime"
import Image from "next/image"
import { getEventById } from "../lib/events"

export const ParticipatedEventsCard = async ({
    id,
    href,
}: {
    id: string
    href: string
}) => {
    console.log(id)
    console.log(`-----id------`)
    const eventId = id.slice(1, -1)
    const link = href.slice(1, -1)
    const event = await getEventById(eventId)

    return (
        <Link href={link} className="group block">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Image
                        src={`/upload/${event?.image}`}
                        width={400}
                        height={400}
                        className="rounded-xl  group-hover:opacity-80"
                        alt={event?.title ?? "none"}
                        placeholder="blur"
                        blurDataURL={"product.imageBlur"}
                    />
                    {/* </div> */}
                    <h2 className="font-bold text-gray-100">{event?.title}</h2>
                    <div className="text-sm font-bold leading-snug text-white">
                        {event?.content}
                    </div>
                    <p className="text-sm text-gray-300">{event?.location}</p>
                    <EventShowTime dateTime={event!.date} />
                    <p className="text-sm text-gray-300">{event?.category}</p>
                </div>
            </div>
        </Link>
    )
}
