import { PageProps } from "../../../../lib/getCategories"
import { getCurrentViper } from "../../../../lib/session"
import { getViperById } from "../../../../lib/vipers"
import { Profile } from "../../../profile/Profile"
import { fetchProfile } from "../../../../lib/getProfile"
import { TabGroup } from "../../../../components/TabGroup"
import AddComment from "../../../[id]/AddComment"

export default async function Layout({ children, params }: PageProps) {
    const id: string = params.id
    // const viper = id !== "api" ? await getViperById(id) : null
    const viper = await getViperById(id)
    if (!viper) return null
    const category = await fetchProfile()
    const currentViper = await getCurrentViper()
    // const fullViper = await getViperById(viper!.id)

    return (
        <div className="grid grid-cols-7 gap-4 ">
            <div className="col-span-7 mx-2 max-w-6xl  lg:border-r  lg:border-gray-800 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 lg:py-2 lg:px-2">
                {/* @ts-expect-error Async Server Component */}
                <Profile
                    fullViper={viper}
                    params={id}
                    currentViper={currentViper!.id}
                />
                <div className="flex justify-center lg:border-b lg:border-gray-800 pb-3 mr-10">
                    <AddComment
                        id={null}
                        commentId={JSON.stringify(viper?._id)}
                        viperIdImage={""}
                        viperIdName=""
                        bloggerIdName=""
                        commentReplies={null}
                        // rePosts={0}
                        timestamp={0}
                        commentCookie={""}
                        rePostCookie={""}
                        event={false}
                        reply={false}
                        blog={false}
                        showComment={""}
                    />

                    <TabGroup
                        path={`/dashboard/vipers/${id}`}
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
