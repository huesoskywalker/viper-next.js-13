import { EventInterface, getEventsByCategory } from "../../../../lib/events"
import { PageProps } from "../../../../lib/utils"
import { EventCard } from "../EventCard"

export default async function CategoryPage({ params }: PageProps) {
    const category: string = params.category
    if (!category) return null

    const events: EventInterface[] = await getEventsByCategory(category)
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {events.map((event: EventInterface) => {
                    return (
                        <EventCard
                            key={JSON.stringify(event._id)}
                            event={event}
                            href={`/${event._id}`}
                        />
                    )
                })}
            </div>
        </div>
    )
}
