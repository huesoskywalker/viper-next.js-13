import { EventInterface, getEventById } from "../../../../lib/events"
import { PageProps } from "../../../../lib/getCategories"
import { EditForm } from "./EditForm"

export default async function EventEditPage({ params }: PageProps) {
    const id: string = params._id
    const toEditEvent: EventInterface | null = await getEventById(id)
    return (
        <div>
            {/* @ts-expect-error Async Server Component */}
            <EditForm toEditEvent={toEditEvent} />
        </div>
    )
}
