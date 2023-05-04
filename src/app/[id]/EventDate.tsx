import { format } from "date-fns"

export const EventDate = ({
    date,
    collection,
}: {
    date: string | number
    collection: boolean
}) => {
    return (
        <div>
            {typeof date === "string" ? (
                <div className="grid">
                    <strong data-test="date" className="font-bold text-sm text-gray-100">
                        {format(new Date(date.split("T")[0]), " MMM do, yyyy")}
                    </strong>
                    {!collection ? (
                        <strong
                            data-test="schedule"
                            className="font-semibold text-xs text-gray-100"
                        >
                            {format(new Date(date.split("T")[0]), " cccc p")}
                        </strong>
                    ) : null}
                </div>
            ) : typeof date === "number" ? (
                <span data-test="timestamp" className="flex justify-end text-xs text-gray-400 ">
                    {format(date, "MMM d, yyyy")}
                </span>
            ) : null}
        </div>
    )
}
