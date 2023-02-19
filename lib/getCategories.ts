import { cache } from "react"

export type PageProps = {
    params?: any
    children?: React.ReactNode
}
export type Category = {
    name: string
    slug: string
    // count?: number
    items: Omit<Category, "items">[]
}

export const getCategories = cache((): Category[] => [
    {
        name: "Bars",
        slug: "bars",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
            // { name: "Laptops", slug: "laptops", count: 2 },
        ],
    },

    {
        name: "Clubs",
        slug: "clubs",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
            // { name: "Education", slug: "education", count: 3 },
        ],
    },
    {
        name: "Music",
        slug: "music",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
            // { name: "Education", slug: "education", count: 3 },
        ],
    },
    {
        name: "Sports",
        slug: "sports",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
            // { name: "Education", slug: "education", count: 3 },
        ],
    },
    {
        name: "Art",
        slug: "art",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
            // { name: "Shorts", slug: "shorts", count: 4 },
            // { name: "Shoes", slug: "shoes", count: 5 },
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
