import { EventInterface, getEventById } from "../../lib/events"
import Test from "./Test"

export default async function HomePage({ params }: { params: { id: string } }) {
    return (
        <div className="space-y-8 lg:space-y-14">
            <h1 className="text-xl font-medium text-red-300 ">Hello Ider</h1>
            <Test />
        </div>
    )
}
