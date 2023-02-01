import { PageProps } from "../../lib/getCategories"
import GoBackArrow from "./GoBackArrow"
import { Event } from "./Event"
import { getEventById } from "../../lib/events"

export default async function Layout({ children, params }: PageProps) {
    const eventId: string = params.id
    const selectedEvent = await getEventById(eventId)

    return (
        <div className="grid grid-cols-11 gap-4 ">
            <GoBackArrow href={`/events/${selectedEvent?.category}`} />
            <div className="col-start-2 col-span-9 mx-2 max-w-6xl  lg:border-x  lg:border-gray-800 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 lg:py-2 lg:px-2">
                <div className="my-5 max-h-[60%]">
                    {/* @ts-expect-error Server Component */}
                    <Event selectedEvent={selectedEvent} id={eventId} />
                </div>
                {children}
            </div>
        </div>
    )
}
