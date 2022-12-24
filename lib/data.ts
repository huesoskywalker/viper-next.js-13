export type Item = {
    name: string
    slug: string
    description?: string
}

export const data: Item[] = [
    {
        name: "Events",
        slug: "events",
        description: "Show case of the events",
    },
    {
        name: "Vipers",
        slug: "vipers",
        description: "Show case of the vipers",
    },
    {
        name: "Dashboard",
        slug: "dashboard",
        description: "Manage content",
    },
]
