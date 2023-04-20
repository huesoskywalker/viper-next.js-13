import Link from "next/link"
import Image from "next/image"
import { getViperBasicsProps, getViperFollowById } from "@/lib/vipers"
import { firstLogin } from "@/lib/utils"
import { Follow, Viper } from "@/types/viper"
import ShowFollows from "../profile/ShowFollows"
import ViperInfo from "../profile/ViperInfo"
import { AddFollow } from "../profile/AddFollow"

export default async function OrganizerInfo({
    organizerId,
    event,
}: {
    organizerId: string
    event: boolean
}) {
    const organizer_id: string = organizerId.replace(/["']+/g, "")
    const organizerData: Promise<Viper | null> = getViperBasicsProps(organizer_id)
    const isOrganizerFollowedData: Promise<boolean> = getViperFollowById(organizer_id)

    const [organizer, isOrganizerFollowed] = await Promise.all([
        organizerData,
        isOrganizerFollowedData,
    ])
    if (!organizer) throw new Error("No viper from OrganizerInfo")

    return (
        <div className="grid grid-cols-3 ">
            <div className="space-y-3 col-span-3 text-xs text-gray-300">
                <div className="flex justify-between ">
                    <Image
                        src={`${
                            firstLogin(organizer.image)
                                ? organizer.image
                                : `/vipers/${organizer.image}`
                        }`}
                        width={50}
                        height={50}
                        className="rounded-full group-hover:opacity-80 h-[50px] w-[50px]"
                        alt={organizer.name}
                        placeholder="blur"
                        blurDataURL={"organizer.imageBlur"}
                    />
                    <AddFollow id={organizer_id} isFollowed={isOrganizerFollowed} event={event} />
                </div>
                <div className="h-fit w-fit">
                    <Link href={`/dashboard/vipers/${organizer_id}`}>
                        <p className="hover:underline text-yellow-600 hover:text-gray-200">
                            {organizer.name}
                        </p>
                    </Link>
                </div>
                <p className="text-gray-200">{organizer.location}</p>
                <p className="text-white">{organizer.biography}</p>
                <div className="mt-5 space-x-8 text-gray-300 text-xs">
                    <ShowFollows
                        follows={organizer.follows?.length}
                        followers={false}
                        profile={false}
                    >
                        {organizer.follows?.map((follows: Follow) => {
                            return (
                                /* @ts-expect-error Async Server Component */
                                <ViperInfo
                                    key={JSON.stringify(follows._id)}
                                    id={JSON.stringify(follows._id)}
                                />
                            )
                        })}
                    </ShowFollows>

                    <ShowFollows
                        follows={organizer.followers?.length}
                        followers={true}
                        profile={false}
                    >
                        {organizer.followers?.map((followers: Follow) => {
                            return (
                                /* @ts-expect-error Async Server Component */
                                <ViperInfo
                                    key={JSON.stringify(followers._id)}
                                    id={JSON.stringify(followers._id)}
                                />
                            )
                        })}
                    </ShowFollows>
                </div>
            </div>
        </div>
    )
}
