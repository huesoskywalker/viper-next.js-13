import {
    add,
    formatDuration,
    isTomorrow,
    intervalToDuration,
    parseISO,
} from "date-fns"

export const EventShowTime = ({
    dateTime,
}: // hasDeliveryTime = false,
{
    dateTime: string
    // hasDeliveryTime?: boolean
}) => {
    const date: Duration = intervalToDuration({
        start: new Date(),
        end: new Date(parseISO(dateTime)),
    })
    // const date = add(new Date(), {
    //     days: dateTime,
    // })

    return (
        <div className="text-sm text-gray-300">
            Comming soon{" "}
            <strong className="font-bold text-gray-100">
                {isTomorrow(parseISO(dateTime)) ? "tomorrow, " : null}
                {formatDuration(date, {
                    format: ["months", "weeks", "days", "hours"],
                    zero: true,
                    delimiter: ", ",
                })}
                {/* {date.months} months, {date.days} days, {date.hours} hours */}
            </strong>
            {/* {hasDeliveryTime ? <> by 5pm</> : null} */}
        </div>
    )
}
