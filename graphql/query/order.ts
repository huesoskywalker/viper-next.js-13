const orderById = () => {
    const gql = String.raw
    return gql`
        {
            draftOrder(first: 10) {
                name
            }
        }
    `
}

export default orderById
