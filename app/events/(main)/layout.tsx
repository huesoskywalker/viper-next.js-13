import {
    Category,
    PageProps,
    fetchCategories,
} from "../../../lib/getCategories"
import { TabGroup } from "../../../components/TabGroup"

export default async function Layout({ children }: PageProps) {
    const categories: Category[] = await fetchCategories()
    return (
        <div className="space-y-9">
            <div className="flex justify-between">
                <TabGroup
                    path="/events"
                    items={[
                        {
                            text: "Home",
                        },
                        ...categories.map((x: Category) => ({
                            text: x.name,
                            slug: x.slug,
                        })),
                    ]}
                />
            </div>

            <div>{children}</div>
        </div>
    )
}
