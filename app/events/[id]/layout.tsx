import styles from "../../../styles/Events.module.css"
import { getEvent } from "../../../lib/events"
import { PageProps } from "../../../lib/utils"
import Link from "next/link"

export default async function Layout({ params }: PageProps) {
    const id: string = params.id

    const event = await getEvent(id)

    return (
        <div>
            <h1>Event:</h1>
            <div className={styles.note}>
                <h3>{event?.title}</h3>
                <h5>{event?.content}</h5>
                <p>{event?.location}</p>
                <p>{event?.date}</p>
                <p>{event?.category}</p>
            </div>
            <Link href={`/vipers/${event?.organizer.id}`}>
                <div>
                    <h4>Organizer:</h4>
                    <h2>{event?.organizer.name}</h2>
                    <p>{event?.organizer.email}</p>
                </div>
            </Link>
        </div>
    )
}
