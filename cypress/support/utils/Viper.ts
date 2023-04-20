// {
//     "userErrors": [],
//     "customer": {
//         "id": "gid://shopify/Customer/6851281846562"
//     }
// }

// {
//     "accessToken": "51811468b93a795f6b016fb4697645e2"
// }
// // new address
// {
//     "customerAddress": {
//         "customerUserErrors": [],
//         "customerAddress": {
//             "id": "gid://shopify/MailingAddress/9110793453858?model_name=CustomerAddress&customer_access_token=M3vIoTIV0EziQTADY4LXCJ4dh0L4BdosQtqulmo76SW_nn1m2iY8vOl0IaL3FGABPFbehHxchx4GlVZnBg4fd8u8QnrI0srMdIUiYybeDhRKZGG0aXFHZqTY6TH6BnKOfHakkMzUt4mtdCoGzBdl3amWNgyaMFaM30mZEFvIDCE3kEkbUG7WUVaaNDPOVdH9fWcc9NtOqeoO9ZTK3A8DYhTrn1Bw1fmIrUwKKzm9UUPYJbDyPX5HKD-__p5y_Ijo"
//         }
//     }
// }
// // ------updatedUser
// {
//     "lastErrorObject": {
//         "n": 1,
//         "updatedExisting": true
//     },
//     "value": {
//         "_id": "64284d2640a907e07f2e17ae",
//         "name": "Hueso Skywalker",
//         "email": "huesoskywalker@gmail.com",
//         "image": "9a6ff1beae8b3a20384f3fc01.jpeg",
//         "emailVerified": null,
//         "backgroundImage": "9a6ff1beae8b3a20384f3fc02.jpeg",
//         "biography": "Let's Go motherfucker",
//         "blog": [
//             {
//                 "_id": "642d752c5c3535109b253fb0",
//                 "content": "Cypress is a pretty cool feature",
//                 "likes": [
//                     "64284d2640a907e07f2e17ae"
//                 ],
//                 "comments": [],
//                 "rePosts": [],
//                 "timestamp": 1680700716798
//             }
//         ],
//         "blogCommented": [],
//         "blogLikes": [
//             {
//                 "bloggerId": "64284d2640a907e07f2e17ae",
//                 "blogId": "642d752c5c3535109b253fb0",
//                 "viperId": "64284d2640a907e07f2e17ae",
//                 "timestamp": 1680700717752
//             }
//         ],
//         "blogRePosts": [],
//         "location": "Greece",
//         "myEvents": {
//             "_id": "642b6816e7c287abe20930f4",
//             "created": [],
//             "collection": [],
//             "likes": []
//         }
//     },
//     "ok": 1
// }

// Check OUT

// --------checkout

// {
//     "id": "gid://shopify/Checkout/f628b301b292c127327943538fd5e72d?key=bd1652600578813107db15ea132b3ef5",
//     "webUrl": "https://vipers-go.myshopify.com/72251277602/checkouts/f628b301b292c127327943538fd5e72d?key=bd1652600578813107db15ea132b3ef5",
//     "orderStatusUrl": null,
//     "lineItems": {
//         "edges": [
//             {
//                 "node": {
//                     "id": "gid://shopify/CheckoutLineItem/448915087362900?checkout=f628b301b292c127327943538fd5e72d",
//                     "title": "Event Name",
//                     "variant": {
//                         "id": "gid://shopify/ProductVariant/44891508736290",
//                         "sku": "",
//                         "title": "viper-level-1",
//                         "priceV2": {
//                             "amount": "44.0",
//                             "currencyCode": "ARS"
//                         },
//                         "product": {
//                             "handle": "event-name"
//                         }
//                     },
//                     "quantity": 1
//                 }
//             }
//         ]
//     }
// }

// association

// {
//     "checkout": {
//         "id": "gid://shopify/Checkout/f628b301b292c127327943538fd5e72d?key=bd1652600578813107db15ea132b3ef5",
//         "webUrl": "https://vipers-go.myshopify.com/72251277602/checkouts/f628b301b292c127327943538fd5e72d?key=bd1652600578813107db15ea132b3ef5",
//         "orderStatusUrl": null
//     },
//     "checkoutUserErrors": [],
//     "customer": {
//         "id": "gid://shopify/Customer/6851281846562",
//         "orders": {
//             "edges": []
//         }
//     }
// }

// Event Request
// {
//     "lastErrorObject": {
//         "n": 1,
//         "updatedExisting": true
//     },
//     "value": {
//         "_id": "64284d2640a907e07f2e17ae",
//         "name": "Hueso Skywalker",
//         "email": "huesoskywalker@gmail.com",
//         "image": "9a6ff1beae8b3a20384f3fc01.jpeg",
//         "emailVerified": null,
//         "backgroundImage": "9a6ff1beae8b3a20384f3fc02.jpeg",
//         "biography": "Let's Go motherfucker",
//         "blog": [
//             {
//                 "_id": "642d752c5c3535109b253fb0",
//                 "content": "Cypress is a pretty cool feature",
//                 "likes": [
//                     "64284d2640a907e07f2e17ae"
//                 ],
//                 "comments": [],
//                 "rePosts": [],
//                 "timestamp": 1680700716798
//             }
//         ],
//         "blogCommented": [],
//         "blogLikes": [
//             {
//                 "bloggerId": "64284d2640a907e07f2e17ae",
//                 "blogId": "642d752c5c3535109b253fb0",
//                 "viperId": "64284d2640a907e07f2e17ae",
//                 "timestamp": 1680700717752
//             }
//         ],
//         "blogRePosts": [],
//         "location": "Greece",
//         "myEvents": {
//             "_id": "642b6816e7c287abe20930f4",
//             "created": [
//                 {
//                     "_id": "642b6acd7f63405da86cbd39"
//                 },
//                 {
//                     "_id": "642b6b7d69f06129574418fe"
//                 },
//                 {
//                     "_id": "642b6bd469f0612957441900"
//                 },
//                 {
//                     "_id": "642b6cac69f0612957441903"
//                 },
//                 {
//                     "_id": "642b6da656f8739ab2b380aa"
//                 },
//                 {
//                     "_id": "642b6e1b56f8739ab2b380ac"
//                 },
//                 {
//                     "_id": "642b6e7056f8739ab2b380ae"
//                 },
//                 {
//                     "_id": "642b714e56f8739ab2b380b0"
//                 },
//                 {
//                     "_id": "642b72d856f8739ab2b380b3"
//                 },
//                 {
//                     "_id": "642b74bcb3e8478471535e8b"
//                 },
//                 {
//                     "_id": "642b7624b3e8478471535e8d"
//                 },
//                 {
//                     "_id": "642c8e9f67102109a0e6c7bc"
//                 },
//                 {
//                     "_id": "642c8f314e42cd0d554cb60f"
//                 },
//                 {
//                     "_id": "642c8ff74e42cd0d554cb611"
//                 },
//                 {
//                     "_id": "642ca44d63f01be72c32cfe8"
//                 },
//                 {
//                     "_id": "642ca54163f01be72c32cfe9"
//                 },
//                 {
//                     "_id": "642ca66a63f01be72c32cfec"
//                 },
//                 {
//                     "_id": "642ca78909ff5d54b7a86553"
//                 },
//                 {
//                     "_id": "642cabff9ca7132bd72bad7e"
//                 },
//                 {
//                     "_id": "642cae99c3dc6a05e978cf01"
//                 },
//                 {
//                     "_id": "642cb05ec3dc6a05e978cf03"
//                 },
//                 {
//                     "_id": "642cb16ec3dc6a05e978cf07"
//                 },
//                 {
//                     "_id": "642cb1a3cdcf130025fb36f4"
//                 },
//                 {
//                     "_id": "642cb315cdcf130025fb36f5"
//                 },
//                 {
//                     "_id": "642cb38acdcf130025fb36f8"
//                 },
//                 {
//                     "_id": "642cb4bc5ed73cf498cc52f2"
//                 },
//                 {
//                     "_id": "642cb6a05ed73cf498cc52f4"
//                 },
//                 {
//                     "_id": "642cb7315ed73cf498cc52f7"
//                 },
//                 {
//                     "_id": "642cb9482f5062b25a8e69c3"
//                 },
//                 {
//                     "_id": "642cba2e2f5062b25a8e69c5"
//                 },
//                 {
//                     "_id": "642cbb5a2f5062b25a8e69c9"
//                 },
//                 {
//                     "_id": "642d727c9b8754dacf50cadb"
//                 },
//                 {
//                     "_id": "642d73cc9b8754dacf50cadf"
//                 },
//                 {
//                     "_id": "642d753f5c3535109b253fb1"
//                 }
//             ],
//             "collection": [],
//             "likes": []
//         },
//         "address": {
//             "phone": 5493543555713,
//             "address": "Los Algarrobos",
//             "city": "Los Hornillos",
//             "province": "Córdoba",
//             "zip": 5100,
//             "country": "Argentina"
//         },
//         "shopify": {
//             "customerAccessToken": "51811468b93a795f6b016fb4697645e2",
//             "customerId": "gid://shopify/Customer/6851281846562"
//         }
//     },
//     "ok": 1
// }

// interceptionRequest============================
{
    "_id": "64284d2640a907e07f2e17ae",
    "name": "Hueso Skywalker",
    "biography": "Let's Go motherfucker",
    "location": "Greece",
    "image": "092584cd748feab9296cda401.jpeg",
    "backgroundImage": "092584cd748feab9296cda402.jpeg"
}


// ===========interceptionResponse
{
    "lastErrorObject": {
        "n": 1,
        "updatedExisting": true
    },
    "value": {
        "_id": "64284d2640a907e07f2e17ae",
        "name": "Hueso Skywalker",
        "email": "huesoskywalker@gmail.com",
        "image": "9a6ff1beae8b3a20384f3fc01.jpeg",
        "emailVerified": null,
        "backgroundImage": "9a6ff1beae8b3a20384f3fc02.jpeg",
        "biography": "Let's Go motherfucker",
        "blog": [
            {
                "_id": "642d752c5c3535109b253fb0",
                "content": "Cypress is a pretty cool feature",
                "likes": [
                    "64284d2640a907e07f2e17ae"
                ],
                "comments": [],
                "rePosts": [],
                "timestamp": 1680700716798
            }
        ],
        "blogCommented": [],
        "blogLikes": [
            {
                "bloggerId": "64284d2640a907e07f2e17ae",
                "blogId": "642d752c5c3535109b253fb0",
                "viperId": "64284d2640a907e07f2e17ae",
                "timestamp": 1680700717752
            }
        ],
        "blogRePosts": [],
        "location": "Greece",
        "myEvents": {
            "_id": "642b6816e7c287abe20930f4",
            "created": [
                {
                    "_id": "642b6acd7f63405da86cbd39"
                },
                {
                    "_id": "642b6b7d69f06129574418fe"
                },
                {
                    "_id": "642b6bd469f0612957441900"
                },
                {
                    "_id": "642b6cac69f0612957441903"
                },
                {
                    "_id": "642b6da656f8739ab2b380aa"
                },
                {
                    "_id": "642b6e1b56f8739ab2b380ac"
                },
                {
                    "_id": "642b6e7056f8739ab2b380ae"
                },
                {
                    "_id": "642b714e56f8739ab2b380b0"
                },
                {
                    "_id": "642b72d856f8739ab2b380b3"
                },
                {
                    "_id": "642b74bcb3e8478471535e8b"
                },
                {
                    "_id": "642b7624b3e8478471535e8d"
                },
                {
                    "_id": "642c8e9f67102109a0e6c7bc"
                },
                {
                    "_id": "642c8f314e42cd0d554cb60f"
                },
                {
                    "_id": "642c8ff74e42cd0d554cb611"
                },
                {
                    "_id": "642ca44d63f01be72c32cfe8"
                },
                {
                    "_id": "642ca54163f01be72c32cfe9"
                },
                {
                    "_id": "642ca66a63f01be72c32cfec"
                },
                {
                    "_id": "642ca78909ff5d54b7a86553"
                },
                {
                    "_id": "642cabff9ca7132bd72bad7e"
                },
                {
                    "_id": "642cae99c3dc6a05e978cf01"
                },
                {
                    "_id": "642cb05ec3dc6a05e978cf03"
                },
                {
                    "_id": "642cb16ec3dc6a05e978cf07"
                },
                {
                    "_id": "642cb1a3cdcf130025fb36f4"
                },
                {
                    "_id": "642cb315cdcf130025fb36f5"
                },
                {
                    "_id": "642cb38acdcf130025fb36f8"
                },
                {
                    "_id": "642cb4bc5ed73cf498cc52f2"
                },
                {
                    "_id": "642cb6a05ed73cf498cc52f4"
                },
                {
                    "_id": "642cb7315ed73cf498cc52f7"
                },
                {
                    "_id": "642cb9482f5062b25a8e69c3"
                },
                {
                    "_id": "642cba2e2f5062b25a8e69c5"
                },
                {
                    "_id": "642cbb5a2f5062b25a8e69c9"
                },
                {
                    "_id": "642d727c9b8754dacf50cadb"
                },
                {
                    "_id": "642d73cc9b8754dacf50cadf"
                },
                {
                    "_id": "642d753f5c3535109b253fb1"
                }
            ],
            "collection": [],
            "likes": []
        },
        "address": {
            "phone": 5493543555713,
            "address": "Los Algarrobos",
            "city": "Los Hornillos",
            "province": "Córdoba",
            "zip": 5100,
            "country": "Argentina"
        },
        "shopify": {
            "customerAccessToken": "51811468b93a795f6b016fb4697645e2",
            "customerId": "gid://shopify/Customer/6851281846562"
        },
        "collection": [
            {
                "_id": "642d8cd4fb5ba98394e49bb2",
                "checkoutId": "gid://shopify/Checkout/f628b301b292c127327943538fd5e72d?key=bd1652600578813107db15ea132b3ef5"
            },
            {
                "_id": "642d753f5c3535109b253fb1",
                "checkoutId": "gid://shopify/Checkout/cce5dd69be0a1af3b113b138c65c403f?key=0d82853b4707bbad202e7eef7ec2d769"
            }
        ]
    },
    "ok": 1
}