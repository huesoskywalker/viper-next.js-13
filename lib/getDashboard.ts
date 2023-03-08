import { cache } from "react"

export type Dashboard = {
    name: string
    slug: string
    // count?: number
    items: Omit<Dashboard, "items">[]
}

export const getDashboard = cache((): Dashboard[] => [
    {
        name: "My Events",
        slug: "myevents",
        items: [
            { name: "Create Event", slug: "create" },
            { name: "Collection", slug: "collection" },
            { name: "Liked", slug: "liked" },
        ],
    },
    {
        name: "Vipers",
        slug: "vipers",
        items: [],
    },
    {
        name: "Messages",
        slug: "messages",
        items: [
            // { name: "Tops", slug: "tops" },
            // { name: "Shorts", slug: "shorts" },
            // { name: "Shoes", slug: "shoes" },
        ],
    },
    // {
    //     name: "Analytics",
    //     slug: "analytics",
    //     items: [
    //         { name: "Best Ones", slug: "best" },
    //         // { name: "Biography", slug: "biography" },
    //         // { name: "Education", slug: "education" },
    //     ],
    // },
])

export async function fetchDashboardBySlug(slug: string | undefined) {
    // Assuming it always return expected categories
    return getDashboard().find((dashboard) => dashboard.slug === slug)
}

export async function fetchDashboard(): Promise<Dashboard[]> {
    return getDashboard()
}

async function findSubDashboard(
    dashboard: Dashboard | undefined,
    subDashboardSlug: string | undefined
) {
    return dashboard?.items.find(
        (dashboard) => dashboard.slug === subDashboardSlug
    )
}

export async function fetchSubDashboard(
    dashboardSlug: string | undefined,
    subDashboardSlug: string | undefined
) {
    const category = await fetchDashboardBySlug(dashboardSlug)
    return findSubDashboard(category, subDashboardSlug)
}
