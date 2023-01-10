import { getEventById } from "../../../../lib/events"
import { PageProps } from "../../../../lib/getCategories"
import { EditForm } from "../../../../components/EditForm"

export default async function EventEditPage({ params }: PageProps) {
    const id: string = params._id
    const toEditEvent = await getEventById(id)
    return (
        <div>
            {/* @ts-expect-error Async Server Component */}
            <EditForm toEditEvent={toEditEvent} />
        </div>
    )
}
