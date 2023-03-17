import { PageProps } from "../../../../lib/getCategories"
import { getViperById, preloadViperById } from "../../../../lib/vipers"
import { ProfileMenu, fetchProfile } from "../../../../lib/getProfile"
import { TabGroup } from "../../../../components/TabGroup"
import { Viper } from "../../../../types/viper"
import { Profile } from "../../../profile/Profile"

export default async function Layout({ children, params }: PageProps) {
    const viperId: string = params.id
    const category: ProfileMenu[] = await fetchProfile()
    // As this is not the Profile page, we should retrieve less data from this Viper, so another function will work nice
    preloadViperById(viperId)

    return (
        <div className="flex justify-center ">
            <div className="lg:border-r  lg:border-gray-800 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 lg:py-2 lg:px-2">
                {/* @ts-expect-error Async Server Component */}

                <Profile viperId={viperId} profile={false} />
                <div className="flex justify-center lg:border-b lg:border-gray-800 pb-3 mr-10">
                    <TabGroup
                        path={`/dashboard/vipers/${viperId}`}
                        items={[
                            {
                                text: "Blog",
                            },
                            ...category.map((x) => ({
                                text: x.name,
                                slug: x.slug,
                            })),
                        ]}
                    />
                </div>
                <div className="mt-3">{children}</div>
            </div>
        </div>
    )
}
