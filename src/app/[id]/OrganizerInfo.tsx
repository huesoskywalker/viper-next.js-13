import Link from "next/link"
import Image from "next/image"
import { getViperBasicProps, getViperFollowById, preloadViperById } from "@/lib/vipers"
import { firstLogin } from "@/lib/utils"
import { Follow, Viper, ViperBasicProps } from "@/types/viper"
import ShowFollows from "../profile/ShowFollows"
import ViperInfo from "../profile/ViperInfo"
import { AddFollow } from "../profile/AddFollow"
import { useRouter } from "next/navigation"

export default async function OrganizerInfo({
    organizerId,
    event,
}: {
    organizerId: string
    event: boolean
}) {
    const organizer_id: string = organizerId.replace(/["']+/g, "")
    // const organizerData: Promise<ViperBasicProps | null> = getViperBasicProps(organizer_id)
    const organizerData = await fetch(
        `http://localhost:3000/api/viper/${organizer_id}?props=basic-props`,
        {
            method: "GET",
            headers: {
                "content-type": "application/json; charset=utf-8",
            },
            cache: "no-cache",
        }
    )
    const resolveOrganizerData: Promise<ViperBasicProps> = organizerData.json()
    const isOrganizerFollowedData: Promise<boolean> = getViperFollowById(organizer_id)

    const [organizer, isOrganizerFollowed] = await Promise.all([
        resolveOrganizerData,
        isOrganizerFollowedData,
    ])
    if (!organizer) throw new Error("No viper from OrganizerInfo")
    preloadViperById(organizer._id)
    return (
        <div className="grid grid-cols-3 ">
            <div className="space-y-3 col-span-3 text-xs text-gray-300">
                <div className="flex justify-between ">
                    <Image
                        data-test="display-organizer-image"
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
                    <Link
                        data-test="display-organizer-name"
                        href={`/dashboard/vipers/${organizer_id}`}
                        className="hover:underline text-yellow-600 hover:text-gray-200"
                    >
                        {/* <span className="hover:underline text-yellow-600 hover:text-gray-200"> */}
                        {organizer.name}
                        {/* </span> */}
                    </Link>
                </div>
                <p data-test="display-organizer-location" className="text-gray-200">
                    {organizer.location}
                </p>
                <p data-test="display-organizer-biography" className="text-white">
                    {organizer.biography}
                </p>
                <div className="mt-5 space-x-8 text-gray-300 text-xs">
                    <ShowFollows
                        follows={organizer.follows.length}
                        followers={false}
                        profile={false}
                    >
                        {organizer.follows.map((follows: Follow) => {
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
                        follows={organizer.followers.length}
                        followers={true}
                        profile={false}
                    >
                        {organizer.followers.map((followers: Follow) => {
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
