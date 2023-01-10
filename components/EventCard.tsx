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
                <div className="space-y-2">
                    {/* <div className="relative">
          {product.isBestSeller ? (
            <div className="absolute top-2 left-2 z-10 flex">
              <ProductBestSeller />
            </div>
          ) : null} */}
                    <Image
                        src={`/upload/${event.image}`}
                        width={400}
                        height={400}
                        className="rounded-xl  group-hover:opacity-80"
                        alt={event.title}
                        placeholder="blur"
                        blurDataURL={"event.imageBlur"}
                    />
                    {/* </div> */}
                    <h2 className="font-bold text-gray-100">{event.title}</h2>
                    <div className="text-sm font-bold leading-snug text-white">
                        {event.content}
                    </div>
                    <p className="text-sm text-gray-300">{event.location}</p>
                    <EventShowTime dateTime={event.date} />
                    <p className="text-sm text-gray-300">{event.category}</p>
                </div>
            </div>
        </Link>
    )
}
