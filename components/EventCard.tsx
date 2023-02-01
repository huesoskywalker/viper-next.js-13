import Link from "next/link"
import { EventInterface } from "../lib/events"
import { EventShowTime } from "./EventShowTime"
import Image from "next/image"

export const EventCard = ({
    event,
    href,
}: {
    event: EventInterface
    href: string
}) => {
    return (
        <Link href={href} className="group block">
            <div className="space-y-4">
                <div className="space-y-2 overflow-hidden">
                    <Image
                        src={`/upload/${event.image}`}
                        width={300}
                        height={300}
                        loading="lazy"
                        style={{
                            objectFit: "contain",
                            objectPosition: "center",
                        }}
                        className="rounded-xl group-hover:opacity-80 max-h-44 "
                        alt={event.title}
                        placeholder="blur"
                        blurDataURL={`/upload/${event.image}`}
                    />
                    <h2 className="font-bold text-gray-100">{event.title}</h2>
                    <div className="text-sm font-bold leading-snug text-white">
                        {event.content}
                    </div>
                    <p className="text-sm text-gray-300">{event.location}</p>
                    <EventShowTime dateTime={event.date} />
                </div>
            </div>
        </Link>
    )
}
