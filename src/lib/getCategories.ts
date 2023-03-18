import "server-only"

import { cache } from "react"

export type PageProps = {
    params?: any
    children?: React.ReactNode
}
export type Category = {
    name: string
    slug: string
    items: Omit<Category, "items">[]
}

export const getCategories = cache((): Category[] => [
    {
        name: "Bars",
        slug: "bars",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
        ],
    },

    {
        name: "Clubs",
        slug: "clubs",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
        ],
    },
    {
        name: "Music",
        slug: "music",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
        ],
    },
    {
        name: "Sports",
        slug: "sports",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
        ],
    },
    {
        name: "Art",
        slug: "art",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
        ],
    },
])

export async function fetchCategoryBySlug(slug: string | undefined) {
    // Assuming it always return expected categories
    return getCategories().find((category) => category.slug === slug)
}

export async function fetchCategories(): Promise<Category[]> {
    return getCategories()
}

async function findSubCategory(
    category: Category | undefined,
    subCategorySlug: string | undefined
) {
    return category?.items.find((category) => category.slug === subCategorySlug)
}

export async function fetchSubCategory(
    categorySlug: string | undefined,
    subCategorySlug: string | undefined
) {
    const category = await fetchCategoryBySlug(categorySlug)
    return findSubCategory(category, subCategorySlug)
}
