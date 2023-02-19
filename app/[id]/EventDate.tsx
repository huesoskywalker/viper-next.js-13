import { format } from "date-fns"

export const EventDate = ({ date }: { date: Date | number }) => {
    return (
        <div>
            {typeof date === "object" ? (
                <strong className="font-bold text-gray-100">
                    {format(date, "MMM d, yyyy")}
                </strong>
            ) : typeof date === "number" ? (
                <span className="flex justify-end text-xs text-gray-400 ">
                    {format(date, "MMM d, yyyy")}
                </span>
            ) : null}
        </div>
    )
}
