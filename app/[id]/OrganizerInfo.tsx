import Link from "next/link"
import Image from "next/image"
import getViperFollowById, { Viper, getViperById } from "../../lib/vipers"
import { AddFollow } from "../profile/AddFollow"
import { firstLogin } from "../../lib/utils"
import { getCurrentViper } from "../../lib/session"

export default async function OrganizerInfo({
    id,
    event,
}: {
    id: string
    event: boolean
}) {
    const viperId: string = id.replace(/["']+/g, "")
    const viper: Viper | undefined = await getViperById(viperId)
    if (!viper) return
    const currentViper = await getCurrentViper()
    if (!currentViper) return
    const isViperFollowed: boolean = await getViperFollowById(
        viperId,
        currentViper.id
    )
    return (
        <div className="grid grid-cols-3 ">
            <div className="space-y-2 col-span-3 text-xs text-gray-300">
                <div className="flex justify-between ">
                    <Image
                        src={`${
                            firstLogin(viper.image)
                                ? viper?.image
                                : `/vipers/${viper.image}`
                        }`}
                        width={50}
                        height={50}
                        className="rounded-full group-hover:opacity-80 h-[50px] w-[50px]"
                        alt={viper.name}
                        placeholder="blur"
                        blurDataURL={"viper.imageBlur"}
                    />
                    <AddFollow
                        id={viperId}
                        isFollowed={isViperFollowed}
                        event={event}
                    />
                </div>
                <div className="h-fit w-fit">
                    <Link href={`/dashboard/vipers/${viperId}`}>
                        <p className="hover:underline text-yellow-600 hover:text-gray-200">
                            {viper.name}
                        </p>
                    </Link>
                </div>
                <p className="text-gray-200">{viper.location}</p>
                <p className="text-white">{viper.biography}</p>
            </div>
        </div>
    )
}
