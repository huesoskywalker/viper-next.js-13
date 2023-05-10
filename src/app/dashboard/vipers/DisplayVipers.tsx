import { Viper } from "@/types/viper"
import OrganizerInfo from "@/app/[id]/OrganizerInfo"

export async function DisplayVipers({ vipersPromise }: { vipersPromise: Promise<Viper[]> }) {
    const vipers: Viper[] = await vipersPromise
    return (
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3 items-start justify-items-center h-[11rem] max-h-fit">
            {vipers.map((viper: Viper) => {
                return (
                    /* @ts-expect-error Async Server Component */
                    <OrganizerInfo
                        key={JSON.stringify(viper._id)}
                        organizerId={JSON.stringify(viper._id)}
                        event={false}
                    />
                )
            })}
        </div>
    )
}
