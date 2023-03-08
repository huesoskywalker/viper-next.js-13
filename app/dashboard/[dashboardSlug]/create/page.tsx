import { getViperCreatedEvents, EventInterface } from "../../../../lib/events"
import { getCurrentViper } from "../../../../lib/session"
import { EditEvent } from "../EditEvent"
import { Suspense } from "react"
import Loading from "./loading"
import { Event } from "../../../[id]/Event"
import ShowEventButton from "./ShowEventButton"

export default async function CreatePage() {
    const viper = await getCurrentViper()
    if (!viper) return
    const events: EventInterface[] = await getViperCreatedEvents(viper.id)
    const lastEvent: EventInterface = events[0]
    const stringId = JSON.stringify(lastEvent?._id)
    const lastEventId = stringId?.slice(1, -1)
    return (
        <div className="flex justify-start">
            <Suspense fallback={<Loading />}>
                <ShowEventButton>
                    {lastEvent ? (
                        <div>
                            <span className="text-gray-400 text-xs flex justify-start align-baseline">
                                The last event you created
                            </span>
                            <EditEvent
                                href={`/dashboard/myevents/${lastEventId}`}
                            />
                            {/* @ts-expect-error Async Server Component */}
                            <Event eventId={lastEventId} />
                        </div>
                    ) : (
                        <h1 className="text-gray-300 font-bold">
                            Create your first Event!
                        </h1>
                    )}
                </ShowEventButton>
            </Suspense>
        </div>
    )
}
