import {
    EventInterface,
    sortEventByCategoryAndSlug,
} from "../../../../../lib/events"
import { PageProps } from "../../../../../lib/utils"
import { EventCard } from "../../../../../components/EventCard"

export default async function CategoryPage({ params }: PageProps) {
    const category: string = params.category
    const property: string = params.sort
    if (!category) return null

    const events: EventInterface[] = await sortEventByCategoryAndSlug(
        category,
        property
    )

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-medium text-gray-400/80">
                All {category}
            </h1>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {events?.map((event: EventInterface) => {
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
