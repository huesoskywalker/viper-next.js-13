import { AddFollow } from "../../../profile/AddFollow"

export async function CheckFollow({
    followPromise,
    viperId,
}: {
    followPromise: Promise<boolean>
    viperId: string
}) {
    const isViperFollowed: boolean = await followPromise
    return (
        <>
            <div className="flex justify-start">
                <AddFollow
                    id={viperId}
                    isFollowed={isViperFollowed}
                    event={true}
                />
            </div>
        </>
    )
}
