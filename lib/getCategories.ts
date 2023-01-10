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
        name: "Drinks",
        slug: "drinks",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
            // { name: "Laptops", slug: "laptops", count: 2 },
        ],
    },
    {
        name: "Food",
        slug: "food",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
            // { name: "Shorts", slug: "shorts", count: 4 },
            // { name: "Shoes", slug: "shoes", count: 5 },
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
            { name: "Football", slug: "football" },
            { name: "Basketball", slug: "basketball" },
            // { name: "Education", slug: "education", count: 3 },
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
