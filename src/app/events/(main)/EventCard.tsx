import Link from "next/link"
import { EventShowTime } from "./EventShowTime"
import Image from "next/image"

export const EventCard = ({
    image,
    title,
    content,
    location,
    date,
    href,
}: {
    image: string
    title: string
    content: string
    location: string
    date: string
    href: string
}) => {
    return (
        <Link data-test="select-event" href={href} className="group block">
            <div className="space-y-4 overflow-hidden">
                <Image
                    data-test="event-card-image"
                    src={`/upload/${image}`}
                    width={300}
                    height={300}
                    loading="lazy"
                    style={{
                        objectFit: "contain",
                        objectPosition: "center",
                    }}
                    // className="rounded-lg  lg:block max-h-24 max-w-auto object-cover object-center"
                    className="rounded-xl max-h-36 max-w-auto group-hover:opacity-80"
                    // className="rounded-xl group-hover:opacity-80 max-h-44 "
                    alt={title}
                    placeholder="blur"
                    blurDataURL={`/upload/${image}`}
                />
                <h2 data-test="event-card-title" className="font-bold text-gray-100">
                    {title}
                </h2>
                <div
                    data-test="event-card-content"
                    className="text-sm font-bold leading-snug text-white"
                >
                    {content}
                </div>
                <p data-test="event-card-location" className="text-sm text-gray-300">
                    {location}
                </p>
                <EventShowTime dateTime={date} />
            </div>
        </Link>
    )
}
