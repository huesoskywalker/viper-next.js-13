import { format } from "date-fns"

export const EventDate = ({
    date,
    collection,
}: {
    date: Date | number
    collection: boolean
}) => {
    return (
        <div>
            {typeof date === "object" ? (
                <div className="grid">
                    <strong className="font-bold text-sm text-gray-100">
                        {format(date, " MMM do, yyyy")}
                    </strong>
                    {!collection ? (
                        <strong className="font-semibold text-xs text-gray-100">
                            {format(date, " cccc p")}
                        </strong>
                    ) : null}
                </div>
            ) : typeof date === "number" ? (
                <span className="flex justify-end text-xs text-gray-400 ">
                    {format(date, "MMM d, yyyy")}
                </span>
            ) : null}
        </div>
    )
}
