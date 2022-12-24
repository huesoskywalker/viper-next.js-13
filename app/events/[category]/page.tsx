// import styles from "../../../styles/Events.module.css"
// import { getEvent } from "../../../lib/events"
// import { PageProps } from "../../../lib/utils"
// import Link from "next/link"

// export default async function EventPage({ params }: PageProps) {
//     const id: string = params._id
//     const event = await getEvent(id)
//     console.log(`---------------event-------------`)
//     console.log(event)

//     return (
//         <div>
//             <h1>Event:</h1>
//             <div className={styles.note}>
//                 <h3>{event?.title}</h3>
//                 <h5>{event?.content}</h5>
//                 <p>{event?.location}</p>
//                 <p>{event?.date}</p>
//                 <p>{event?.category}</p>
//             </div>
//             <Link href={`/vipers/${event?.organizer.id}`}>
//                 <div>
//                     <h4>Organizer:</h4>
//                     <h2>{event?.organizer.name}</h2>
//                     <p>{event?.organizer.email}</p>
//                 </div>
//             </Link>
//         </div>
//     )
// }

import { getEventsByCategory } from "../../../lib/events"
import { PageProps } from "../../../lib/utils"
import { EventCard } from "../../../components/EventCard"
import Link from "next/link"

export default async function Layout({ params }: PageProps) {
    const category: string = params.category
    if (!category) return null

    const events = await getEventsByCategory(category)
    return (
        <div className="space-y-4">
            <h1 className="text-xl font-medium text-gray-400/80">
                All {category}
            </h1>

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
        </div>
    )
}
