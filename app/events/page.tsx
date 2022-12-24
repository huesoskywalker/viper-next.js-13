// import { CreateEvent } from "../../components/CreateEvent"
// import { getEvents } from "../../lib/events"
// // import Link from "next/link"
// import styles from "../../styles/Events.module.css"
// import { Suspense } from "react"
// import Loading from "./loading"
// import EventNavLink from "../../components/EventNavLink"

// export default async function EventsPage() {
//     const events = await getEvents()

//     return (
//         <div>
//             <h1>Events</h1>
//             <Suspense fallback={<Loading />}>
//                 <div className={styles.grid}>
//                     {events?.map((event: any) => {
//                         return <Event key={event._id} event={event} />
//                     })}
//                 </div>
//             </Suspense>
//             <CreateEvent />
//         </div>
//     )
// }

// function Event({ event }: any) {
//     const { _id, organizer, title, content, location, date, category } = event || {}

//     return (
//         // <Link href={`events/${_id}`}>
//         <EventNavLink slug={_id}>
//             <div>
//                 <h2>{organizer.name}</h2>
//             </div>
//             <div className={styles.note}>
//                 <h2 className={styles.title}>{title}</h2>
//                 <h5 className={styles.content}>{content}</h5>
//                 <p className={styles.location}>{location}</p>
//                 <p className={styles.date}>{date}</p>
//                 <p className={styles.category}>{category}</p>
//             </div>
//         </EventNavLink>
//         // </Link>
//     )
// }

import { getEvents } from "../../lib/events"
import { Suspense } from "react"
import Loading from "./loading"
import { EventCard } from "../../components/EventCard"

export default async function EventsPage({}) {
    const events = await getEvents()

    return (
        <div className="space-y-9">
            <h1>Events</h1>
            <div className="flex justify-between">
                <Suspense fallback={<Loading />}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {events?.map((event: any) => {
                            return (
                                <EventCard
                                    key={event._id}
                                    event={event}
                                    href={`/events/${event.id}`}
                                />
                            )
                        })}
                    </div>
                </Suspense>
            </div>
        </div>
    )
}

// function Event({ event }: any) {
//     const { _id, organizer, title, content, location, date, category } =
//         event || {}
//     const id: string = JSON.stringify(_id).slice(1, -1)

//     return (
//         // <Link href={`events/${_id}`}>
//         <EventNavLink slug={id}>
//             <div className="space-y-4">
//                 <h1 className="text-xl font-medium text-gray-400/80">
//                     {organizer.name}
//                 </h1>
//                 <div className="space-y-2">
//                     <h2 className="text-red-600">{title}</h2>
//                     <h5 className="text-blue-800">{content}</h5>
//                     <p className="text-yellow-700">{location}</p>
//                     <p className="">{date}</p>
//                     <p className="">{category}</p>
//                 </div>
//             </div>
//         </EventNavLink>
//         // </Link>
//     )
// }
