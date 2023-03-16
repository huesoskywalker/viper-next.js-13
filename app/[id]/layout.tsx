import { PageProps } from "../../lib/getCategories"
import GoBackArrow from "./GoBackArrow"
import { Event } from "./Event"
import { getEventById } from "../../lib/events"
import { EventInterface } from "../../types/event"
import { Suspense } from "react"
// export const dynamic = "auto"
// export const dynamicParams = true
// export const revalidate = 30
// export const fetchCache = "auto"
// export const runtime = "nodejs"
// export const preferredRegion = "auto"

export default async function Layout({ children, params }: PageProps) {
    const eventId: string = params.id
    const event: Promise<EventInterface | null> = getEventById(eventId)
    return (
        <div className="flex justify-center space-x-2 mr-5">
            <GoBackArrow />
            <div className="mx-5 lg:border-x lg:border-gray-800 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 lg:py-2 lg:px-2">
                <div className="m-5 max-h-[100%] border-b-[1px] pb-3 border-gray-700/80">
                    <Suspense
                        fallback={
                            <div className="text-yellow-500 text-lg">
                                Suspense from Layout...
                            </div>
                        }
                    >
                        {/* @ts-expect-error Server Component */}
                        <Event eventPromise={event} />
                    </Suspense>
                </div>
                {children}
            </div>
        </div>
    )
}
