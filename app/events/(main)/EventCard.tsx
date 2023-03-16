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
    date: Date
    href: string
}) => {
    return (
        <Link href={href} className="group block">
            <div className="space-y-4">
                <div className="space-y-2 overflow-hidden">
                    <Image
                        src={`/upload/${image}`}
                        width={300}
                        height={300}
                        loading="lazy"
                        style={{
                            objectFit: "contain",
                            objectPosition: "center",
                        }}
                        className="rounded-xl group-hover:opacity-80 max-h-44 "
                        alt={title}
                        placeholder="blur"
                        blurDataURL={`/upload/${image}`}
                    />
                    <h2 className="font-bold text-gray-100">{title}</h2>
                    <div className="text-sm font-bold leading-snug text-white">
                        {content}
                    </div>
                    <p className="text-sm text-gray-300">{location}</p>
                    <EventShowTime dateTime={date} />
                </div>
            </div>
        </Link>
    )
}
