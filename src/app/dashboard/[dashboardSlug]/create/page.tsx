import { getViperLatestCreatedEvent } from "@/lib/events"
import { getCurrentViper } from "@/lib/session"
import { Suspense } from "react"
import Loading from "./loading"
import ShowEventButton from "./ShowEventButton"
import { EventInterface } from "@/types/event"
import { Session } from "next-auth"
import { Event } from "@/app/[id]/Event"

export default async function CreatePage() {
    const viperSession: Session | null = await getCurrentViper()
    if (!viperSession) throw new Error("No Viper bro")
    const viper = viperSession?.user
    const lastEvent: Promise<EventInterface> = getViperLatestCreatedEvent(
        viper.id
    )

    return (
        <div className="flex justify-start">
            <Suspense fallback={<Loading />}>
                <ShowEventButton>
                    <div>
                        <span className="text-gray-400 text-xs flex justify-start align-baseline">
                            The last event you created
                        </span>
                        {/* WITH THE EDIT EVENT WE CAN MAKE A RELATIVE/FLOATING BUTTON OVER THE IMAGE */}
                        {/* Cuz we cannot get the _id of the event to edit */}
                        {/* <EditEvent
                            href={`/dashboard/myevents/${lastEventId}`}
                        /> */}
                        {/* @ts-expect-error Async Server Component */}
                        <Event eventPromise={lastEvent} />
                    </div>
                </ShowEventButton>
            </Suspense>
        </div>
    )
}
