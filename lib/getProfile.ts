import { cache } from "react"

export type Profile = {
    name: string
    slug: string
    items: Omit<Profile, "items">[]
}

export const getProfile = cache((): Profile[] => [
    {
        name: "Blog & replies",
        slug: "myevents",
        items: [
            { name: "Create Event", slug: "create" },
            { name: "Participations", slug: "participations" },
            { name: "Liked", slug: "liked" },
        ],
    },
    {
        name: "Likes",
        slug: "likes",
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

export async function fetchProfileBySlug(slug: string | undefined) {
    // Assuming it always return expected categories
    return getProfile().find((profile) => profile.slug === slug)
}

export async function fetchProfile(): Promise<Profile[]> {
    return getProfile()
}

async function findSubProfile(
    profile: Profile | undefined,
    subProfileSlug: string | undefined
) {
    return profile?.items.find((profile) => profile.slug === subProfileSlug)
}

export async function fetchSubProfile(
    profileSlug: string | undefined,
    subProfileSlug: string | undefined
) {
    const category = await fetchProfileBySlug(profileSlug)
    return findSubProfile(category, subProfileSlug)
}
