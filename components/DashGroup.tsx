import { Tab } from "./Tab"

export type Item = {
    text: string
    slug?: string
}

export const DashGroup = ({ path, items }: { path: string; items: Item[] }) => {
    return (
        <div className="-mt-2 flex flex-col items-start py-3 space-y-4">
            {items.map((item) => (
                <Tab key={path + item.slug} item={item} path={path} />
            ))}
        </div>
    )
}
