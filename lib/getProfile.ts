import { cache } from "react"

export type Profile = {
    name: string
    slug: string
}

export const getProfile = cache((): Profile[] => [
    {
        name: "Likes & replies",
        slug: "replies",
    },
])

export async function fetchProfileBySlug(slug: string | undefined) {
    // Assuming it always return expected categories
    return getProfile().find((profile) => profile.slug === slug)
}

export async function fetchProfile(): Promise<Profile[]> {
    return getProfile()
}
