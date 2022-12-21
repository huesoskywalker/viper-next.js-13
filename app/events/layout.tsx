import { CreateEvent } from "../../components/CreateEvent"
import { getEvents } from "../../lib/events"
import Link from "next/link"
import styles from "../../styles/Events.module.css"
import { Suspense } from "react"
import Loading from "./loading"
import EventNavLink from "../../components/EventNavLink"

export default async function Layout({ children }: { children: React.ReactNode }) {
    const events = await getEvents()

    return (
        <div>
            <h1>Events</h1>
            <Suspense fallback={<Loading />}>
                <div className={styles.grid}>
                    {events?.map((event: any) => {
                        return <Event key={event._id} event={event} />
                    })}
                </div>
            </Suspense>
            <CreateEvent />
            <div>{children}</div>
        </div>
    )
}

function Event({ event }: any) {
    const { _id, organizer, title, content, location, date, category } = event || {}
    const id: string = JSON.stringify(_id).slice(1, -1)
    console.log(`--------------id-------------------`)
    console.log(id)
    return (
        // <Link href={`events/${_id}`}>
        <EventNavLink slug={id}>
            <div>
                <h2>{organizer.name}</h2>
            </div>
            <div className={styles.note}>
                <h2 className={styles.title}>{title}</h2>
                <h5 className={styles.content}>{content}</h5>
                <p className={styles.location}>{location}</p>
                <p className={styles.date}>{date}</p>
                <p className={styles.category}>{category}</p>
            </div>
        </EventNavLink>
        // </Link>
    )
}
