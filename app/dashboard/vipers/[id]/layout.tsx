import { PageProps } from "../../../../lib/getCategories"
import { getCurrentViper } from "../../../../lib/session"
import { Viper, getViperById } from "../../../../lib/vipers"
import { Profile, fetchProfile } from "../../../../lib/getProfile"
import { TabGroup } from "../../../../components/TabGroup"
import AddComment from "../../../../components/AddComment"

export default async function Layout({ children, params }: PageProps) {
    const paramsId: string = params.id
    const viper: Viper | undefined = await getViperById(paramsId)
    if (!viper) return null
    const category: Profile[] = await fetchProfile()
    const currentViper = await getCurrentViper()
    if (!currentViper) return

    return (
        <div className="grid grid-cols-7 gap-4 ">
            <div className="col-span-7 mx-2 max-w-6xl  lg:border-r  lg:border-gray-800 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 lg:py-2 lg:px-2">
                {/* @ts-expect-error Async Server Component */}
                <Profile
                    viperId={paramsId}
                    currentViper={currentViper.id}
                    profile={false}
                />
                <div className="flex justify-center lg:border-b lg:border-gray-800 pb-3 mr-10">
                    <AddComment
                        id={null}
                        commentId={paramsId}
                        // commentId={JSON.stringify(viper?._id)}
                        viperIdImage={undefined}
                        viperIdName={undefined}
                        bloggerIdName={undefined}
                        commentReplies={null}
                        timestamp={null}
                        commentCookie={"none"}
                        event={false}
                        reply={false}
                        blog={false}
                        showComment={undefined}
                    />

                    <TabGroup
                        path={`/dashboard/vipers/${paramsId}`}
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
