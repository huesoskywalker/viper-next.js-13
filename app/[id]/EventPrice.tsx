export const EventPrice = ({ price }: { price: number }) => {
    return (
        <div className="flex">
            {price === 0 ? (
                <h1 className="text-lg font-bold leading-snug text-white">
                    {" "}
                    FREE{" "}
                </h1>
            ) : (
                <div>
                    <div className="text-sm leading-snug text-white">
                        ${price}
                    </div>
                    <div className="text-lg font-bold leading-snug text-white"></div>
                </div>
            )}
        </div>
    )
}
