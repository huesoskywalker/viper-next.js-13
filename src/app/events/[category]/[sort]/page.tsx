import { Suspense } from "react"
import { sortEventByCategoryAndSlug } from "@/lib/events"
import { PageProps } from "@/lib/utils"
import { EventInterface } from "@/types/event"
import Loading from "../../loading"
import { DisplayEvents } from "../../DisplayEvents"

export default async function CategoryPage({ params }: PageProps) {
    const category: string = params.category
    const property: string = params.sort
    if (!category) throw new Error("No such category bro")

    const events: Promise<EventInterface[]> = sortEventByCategoryAndSlug(category, property)
    return (
        <div className="space-y-4">
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Async Server Component */}
                <DisplayEvents eventsPromise={events} dashboard={false} />
            </Suspense>
        </div>
    )
}
