export type Item = {
    name: string
    slug: string
    description?: string
}

export const data: Item[] = [
    {
        name: "Events",
        slug: "dashboard/blog",
        description: "Show case of the events",
    },
    {
        name: "Dashboard",
        slug: "dashboard",
        description: "Manage content",
    },
    {
        name: "Vipers",
        slug: "vipers",
        description: "Show case of the vipers",
    },
]
