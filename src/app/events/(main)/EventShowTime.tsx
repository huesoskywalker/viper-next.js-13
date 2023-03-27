import { formatDuration, isTomorrow, intervalToDuration } from "date-fns"

export const EventShowTime = ({ dateTime }: { dateTime: Date }) => {
    const date: Duration = intervalToDuration({
        start: new Date(),
        end: new Date(dateTime),
    })
    return (
        <div className="text-sm text-gray-300">
            <strong className="font-bold text-gray-100">
                {isTomorrow(new Date(dateTime)) ? "Tomorrow, " : null}
                In{" "}
                {formatDuration(date, {
                    format: ["months", "days", "hours"],
                    zero: true,
                    delimiter: ", ",
                })}
            </strong>
        </div>
    )
}
