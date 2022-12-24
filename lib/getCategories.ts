import { cache } from "react"

export type PageProps = {
    params?: any
    children?: React.ReactNode
}
export type Category = {
    name: string
    slug: string
    count?: number
    items: Omit<Category, "items">[]
}

export const getCategories = cache((): Category[] => [
    {
        name: "Drinks",
        slug: "drinks",
        items: [
            { name: "Phones", slug: "phones", count: 4 },
            { name: "Tablets", slug: "tablets", count: 5 },
            { name: "Laptops", slug: "laptops", count: 2 },
        ],
    },
    {
        name: "Food",
        slug: "food",
        items: [
            { name: "Tops", slug: "tops", count: 3 },
            { name: "Shorts", slug: "shorts", count: 4 },
            { name: "Shoes", slug: "shoes", count: 5 },
        ],
    },
    {
        name: "Music",
        slug: "music",
        items: [
            { name: "Fiction", slug: "fiction", count: 5 },
            { name: "Biography", slug: "biography", count: 2 },
            { name: "Education", slug: "education", count: 3 },
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
