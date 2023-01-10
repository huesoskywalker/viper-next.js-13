import { format } from "date-fns"

export const EventDate = ({ date }: { date: Date }) => {
    return (
        <div>
            <strong className="font-bold text-gray-100">
                {format(date, "MMM d yyyy")}
            </strong>
        </div>
    )
}
