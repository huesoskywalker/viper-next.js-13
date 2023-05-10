export const EventLocation = ({ location }: { location: string }) => {
    return (
        <div>
            <h1 data-test="event-location" className="text-xs text-gray-300">
                {location}
            </h1>
        </div>
    )
}
