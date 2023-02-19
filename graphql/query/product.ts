const productById = (eventId: string) => {
    const gql = String.raw
    return gql`
        {
            product(id: "${eventId}") {
                id
                title
                description
                priceRange {
                    minVariantPrice {
                        amount
                    }
                }
                images(first: 1) {
                    edges {
                        node {
                            transformedSrc
                            altText
                        }
                    }
                }
                variants(first: 1) {
                    edges {
                        node {
                            id
                        }
                    }
                }
            }
        }
    `
}

export default productById
