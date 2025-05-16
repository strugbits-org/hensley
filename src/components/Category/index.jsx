import React from 'react'
import Listing from './Listing'
import InstaFeedback from '../common/InstagramFeed'
import OurCategories from '../common/OurCategories'
import OurProjects from './OurProjects'

const chairImage = "wix:image://v1/339f77_1bf80cddc0bd48d78d7c221389c03cc9~mv2.jpg/file.jpg#originWidth=3089&originHeight=4633";

export const Categories = ({ slug }) => {
  const categories = [
    {
      orderNumber: 1,
      _id: 'e4cc18b1-350f-47b5-9022-ac13c0bbd88b',
      _owner: '8ba81b0f-1e45-4f83-95ba-814143aee907',
      categories: {
        name: 'TENTS',
        mainMedia: 'wix:image://v1/626075_557c9d69457d47db99843f9f6097ebbe~mv2.jpg/file.jpg#originWidth=4491&originHeight=2259',
        _id: 'd27f504d-05a2-ec30-c018-cc403e815bfa',
        slug: 'tents',
        categoryPageUrl: '/category/tents',
        'link-collections-name': '/subcategory/tents',
        'link-collections-name-2': '/collections/tents'
      },
      title: 'THE EASE OF THE INDOORS, BROUGHT OUTSIDE'
    },
    {
      orderNumber: 2,
      _id: 'fc5962ca-1e5f-41c8-b6eb-60649a1fd358',
      _owner: '8ba81b0f-1e45-4f83-95ba-814143aee907',
      rtl: true,
      categories: {
        name: 'TABLETOP',
        mainMedia: 'wix:image://v1/626075_a0c9929c708a4855988454b61892c5e7~mv2.jpg/file.jpg#originWidth=5000&originHeight=5000',
        _id: '80318732-dfa7-93e3-7f90-b9b9b655a203',
        slug: 'tabletop',
        categoryPageUrl: '/category/tabletop',
        'link-collections-name': '/subcategory/tabletop',
        'link-collections-name-2': '/collections/tabletop'
      },
      title: 'DISCOVER THE ART OF PERFECT TABLE SETTINGS'
    },
    {
      orderNumber: 3,
      _id: 'f6b2523c-5a9a-4388-85fe-6ccac622736d',
      _owner: '8ba81b0f-1e45-4f83-95ba-814143aee907',
      categories: {
        name: 'CATERING',
        mainMedia: 'wix:image://v1/626075_bf065261d72f4c8f9eb4d2010055a55b~mv2.jpg/file.jpg#originWidth=5881&originHeight=5881',
        _id: '67cdab0b-89d7-bc4f-95fe-7fc4de5f2a11',
        slug: 'catering',
        categoryPageUrl: '/category/catering',
        'link-collections-name': '/subcategory/catering',
        'link-collections-name-2': '/collections/catering'
      },
      title: 'CRAFTED FOR CULINARY PERFECTION'
    },
    {
      orderNumber: 4,
      _id: 'b30ecc21-917b-40c7-b8c8-b4f30a3a6653',
      _owner: '8ba81b0f-1e45-4f83-95ba-814143aee907',
      rtl: true,
      categories: {
        name: 'FURNISHINGS',
        mainMedia: 'wix:image://v1/626075_8016717c01f248c9a1514b5877442e91~mv2.jpg/file.jpg#originWidth=2000&originHeight=2000',
        _id: 'ca36a87a-3e56-171b-a8e0-9ec2f5e2a874',
        slug: 'furnishings',
        categoryPageUrl: '/category/furnishings',
        'link-collections-name': '/subcategory/furnishings',
        'link-collections-name-2': '/collections/furnishings'
      },
      title: 'TRANSFORM SPACES INTO MASTERPIECES'
    },
    {
      orderNumber: 5,
      _id: '260364e6-7c01-4de9-8f2b-2a847594ad66',
      _owner: '8ba81b0f-1e45-4f83-95ba-814143aee907',
      rtl: true,
      categories: {
        name: 'PAVILIONS',
        mainMedia: 'wix:image://v1/626075_c12c67a6681e4729abb7f8105865611f~mv2.jpg/file.jpg#originWidth=1280&originHeight=1280',
        _id: '8726071f-ef4b-b6f4-db99-fc23a62b4023',
        slug: 'pavilions',
        categoryPageUrl: '/category/pavilions',
        'link-collections-name': '/subcategory/pavilions',
        'link-collections-name-2': '/collections/pavilions'
      },
      title: 'PAVILIONS DESIGNED TO INSPIRE AND PROTECT'
    }
  ]

  const products = [
    {
      "orderNumber": 1,
      "_id": "9d09ea5b-4cfe-4b2f-ab8c-6f6f0837f109",
      "_owner": "0e0ac59a-ee22-4893-94f5-fe2986338ea7",
      "_createdDate": "2025-05-13T15:55:31.216Z",
      "_updatedDate": "2025-05-13T16:02:44.296Z",
      "slug": "/",
      "product": {
        "seoData": null,
        "inStock": true,
        "weight": 0,
        "name": "BISHOP NATURAL - HIGHBOY TABLE",
        "sku": "TBBISHOPHBNAT",
        "formattedDiscountedPrice": "$141.75",
        "link-copy-of-tent-slug": "/pool-covers/bishop-natural-highboy-table",
        "productOptions": {},
        "mainMedia": "wix:image://v1/339f77_ffe78b2bf916403a90ecd49b23ef6989~mv2.jpg/file.jpg#originWidth=3043&originHeight=4565",
        "description": "<p>The Bishop Natural Highboy Table features a stunning natural wood finish with a pedestal base, ideal for cocktail hours, receptions, and standing gatherings. Its rustic yet refined design adds warmth and elegance to any event space.</p>",
        "_id": "12f5f9f5-bf04-3c0e-da0f-33f3b7a53a95",
        "discountedPrice": 141.75,
        "link-products-slug": "/product/bishop-natural-highboy-table",
        "formattedPrice": "$141.75",
        "price": 141.75,
        "quantityInStock": null,
        "collections": null,
        "inventoryItem": "ed0a060a-40fb-c3f1-25f0-cc0c485ac56a",
        "_updatedDate": "2025-02-21T15:17:49.849Z",
        "formattedPricePerUnit": null,
        "slug": "bishop-natural-highboy-table",
        "productType": "physical",
        "brand": null,
        "ribbons": [],
        "pricePerUnitData": null,
        "mediaItems": [
          {
            "description": "",
            "id": "339f77_ffe78b2bf916403a90ecd49b23ef6989~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_ffe78b2bf916403a90ecd49b23ef6989~mv2.jpg/file.jpg#originWidth=3043&originHeight=4565",
            "title": "BISHOP HIGHBOY TABLE NATURAL 30_x42.jpg",
            "type": "Image"
          }
        ],
        "trackInventory": false,
        "customTextFields": [],
        "pricePerUnit": null,
        "ribbon": "",
        "currency": "USD",
        "productPageUrl": "/product-page/bishop-natural-highboy-table",
        "numericId": "1731518719671000",
        "manageVariants": false,
        "link-products-slug-2": "/tent/bishop-natural-highboy-table",
        "discount": {
          "type": "NONE",
          "value": 0
        },
        "additionalInfoSections": [
          {
            "title": "Size",
            "description": "<p>30\" x 42\"</p>\n"
          }
        ],
        "createdDate": "2024-11-13T17:25:19.671Z"
      }
    },
    {
      "orderNumber": 2,
      "_id": "5d792637-83f1-4787-beb4-97f8ee2c3765",
      "_owner": "0e0ac59a-ee22-4893-94f5-fe2986338ea7",
      "_createdDate": "2025-05-13T16:00:14.907Z",
      "_updatedDate": "2025-05-13T16:02:44.905Z",
      "slug": "/",
      "product": {
        "seoData": null,
        "inStock": true,
        "weight": 0,
        "name": "COUNTRY PEAR - LINEN",
        "sku": "",
        "formattedDiscountedPrice": "$45.00",
        "link-copy-of-tent-slug": "/pool-covers/country-pear",
        "productOptions": {},
        "mainMedia": "wix:image://v1/339f77_04ab507cafa14fca83ccd98e3c091f73~mv2.jpg/file.jpg#originWidth=2573&originHeight=3860",
        "description": "<p>Fresh pear-green linen, ideal for natural and organic table settings.</p>",
        "_id": "758749e4-9dc7-d946-7016-2b821d97a4d5",
        "discountedPrice": 45,
        "link-products-slug": "/product/country-pear",
        "formattedPrice": "$45.00",
        "price": 45,
        "quantityInStock": null,
        "collections": null,
        "inventoryItem": "8a78b61b-6238-26b9-8fe9-d47de2685b2a",
        "_updatedDate": "2025-02-21T14:51:25.414Z",
        "formattedPricePerUnit": null,
        "slug": "country-pear",
        "productType": "physical",
        "brand": null,
        "ribbons": [],
        "pricePerUnitData": null,
        "mediaItems": [
          {
            "description": "",
            "id": "339f77_04ab507cafa14fca83ccd98e3c091f73~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_04ab507cafa14fca83ccd98e3c091f73~mv2.jpg/file.jpg#originWidth=2573&originHeight=3860",
            "title": "COUNTRY PEAR.jpg",
            "type": "Image"
          }
        ],
        "trackInventory": false,
        "customTextFields": [],
        "pricePerUnit": null,
        "ribbon": "",
        "currency": "USD",
        "productPageUrl": "/product-page/country-pear",
        "numericId": "1733171910148000",
        "manageVariants": false,
        "link-products-slug-2": "/tent/country-pear",
        "discount": {
          "type": "NONE",
          "value": 0
        },
        "additionalInfoSections": [],
        "createdDate": "2024-12-02T20:38:30.148Z"
      }
    },
    {
      "orderNumber": 3,
      "_id": "6d4c1db9-ab0c-44db-addd-525c0362f4b4",
      "_owner": "0e0ac59a-ee22-4893-94f5-fe2986338ea7",
      "_createdDate": "2025-05-13T16:00:43.324Z",
      "_updatedDate": "2025-05-13T16:02:45.833Z",
      "slug": "/",
      "product": {
        "seoData": null,
        "inStock": true,
        "weight": 0,
        "name": "FLORES - COLLECTION",
        "sku": "",
        "formattedDiscountedPrice": "$2.75",
        "link-copy-of-tent-slug": "/pool-covers/flores-collection",
        "productOptions": {},
        "mainMedia": "wix:image://v1/339f77_1bf80cddc0bd48d78d7c221389c03cc9~mv2.jpg/file.jpg#originWidth=3089&originHeight=4633",
        "description": "<p>Bring floral elegance to your table with the Flores Collection, featuring intricate flower-inspired patterns. This versatile collection suits romantic celebrations and sophisticated gatherings alike.</p><p>&nbsp;</p><p>- $2.50 Dinner&nbsp;10.85\"</p><p>- $2.50 Salad&nbsp;8.25</p>",
        "_id": "7feb60b9-d056-4e7c-b73c-d9574afc354b",
        "discountedPrice": 2.75,
        "link-products-slug": "/product/flores-collection",
        "formattedPrice": "$2.75",
        "price": 2.75,
        "quantityInStock": null,
        "collections": null,
        "inventoryItem": "80149f46-2fa9-b183-48c3-26a8b503cab4",
        "_updatedDate": "2025-02-21T14:44:07.807Z",
        "formattedPricePerUnit": null,
        "slug": "flores-collection",
        "productType": "physical",
        "brand": null,
        "ribbons": [],
        "pricePerUnitData": null,
        "mediaItems": [
          {
            "description": "",
            "id": "339f77_1bf80cddc0bd48d78d7c221389c03cc9~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_1bf80cddc0bd48d78d7c221389c03cc9~mv2.jpg/file.jpg#originWidth=3089&originHeight=4633",
            "title": "FLORES COLLECTION.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_5c796bf3bcb1437f896991dd3f464809~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_5c796bf3bcb1437f896991dd3f464809~mv2.jpg/file.jpg#originWidth=3840&originHeight=5760",
            "title": "FLORES COLLECTION 1.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_dc13349f3b574acb9c7b0ae408e77f58~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_dc13349f3b574acb9c7b0ae408e77f58~mv2.jpg/file.jpg#originWidth=3840&originHeight=5760",
            "title": "FLORES COLLECTION 2.jpg",
            "type": "Image"
          }
        ],
        "trackInventory": false,
        "customTextFields": [],
        "pricePerUnit": null,
        "ribbon": "",
        "currency": "USD",
        "productPageUrl": "/product-page/flores-collection",
        "numericId": "1727788497002142",
        "manageVariants": false,
        "link-products-slug-2": "/tent/flores-collection",
        "discount": {
          "type": "NONE",
          "value": 0
        },
        "additionalInfoSections": [],
        "createdDate": "2024-10-01T13:14:57.002Z"
      }
    },
    {
      "orderNumber": 4,
      "_id": "a52227c2-0bc4-4841-b62d-aab2c27e09d8",
      "_owner": "0e0ac59a-ee22-4893-94f5-fe2986338ea7",
      "_createdDate": "2025-05-13T16:00:54.678Z",
      "_updatedDate": "2025-05-13T16:02:46.977Z",
      "slug": "/",
      "product": {
        "seoData": null,
        "inStock": true,
        "weight": 0,
        "name": "HAMPTON - SOFA",
        "sku": "SFHAMPTONSOFA",
        "formattedDiscountedPrice": "$470.00",
        "link-copy-of-tent-slug": "/pool-covers/hampton-sofa",
        "productOptions": {},
        "mainMedia": "wix:image://v1/339f77_674b4cf4277c4b3288cd072a4abed077~mv2.jpg/file.jpg#originWidth=5228&originHeight=7843",
        "description": "<p>The Hampton Sofa features a natural wood frame with lattice detailing and plush, neutral cushions. Its coastal-inspired design is perfect for weddings, garden parties, and luxury lounge areas.</p>",
        "_id": "126d6b7d-90fd-44a6-9ae1-ed1582576682",
        "discountedPrice": 470,
        "link-products-slug": "/product/hampton-sofa",
        "formattedPrice": "$470.00",
        "price": 470,
        "quantityInStock": null,
        "collections": null,
        "inventoryItem": "ed929482-6f02-bb59-651e-12ea7da8997d",
        "_updatedDate": "2025-02-21T19:09:38.405Z",
        "formattedPricePerUnit": null,
        "slug": "hampton-sofa",
        "productType": "physical",
        "brand": null,
        "ribbons": [],
        "pricePerUnitData": null,
        "mediaItems": [
          {
            "description": "",
            "id": "339f77_674b4cf4277c4b3288cd072a4abed077~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_674b4cf4277c4b3288cd072a4abed077~mv2.jpg/file.jpg#originWidth=5228&originHeight=7843",
            "title": "HAMPTON SOFA 1.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_41d1355b1ebd49908a82cc2cb6570e6a~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_41d1355b1ebd49908a82cc2cb6570e6a~mv2.jpg/file.jpg#originWidth=5278&originHeight=7917",
            "title": "HAMPTON SOFA.jpg",
            "type": "Image"
          }
        ],
        "trackInventory": false,
        "customTextFields": [],
        "pricePerUnit": null,
        "ribbon": "",
        "currency": "USD",
        "productPageUrl": "/product-page/hampton-sofa",
        "numericId": "1727788476188465",
        "manageVariants": false,
        "link-products-slug-2": "/tent/hampton-sofa",
        "discount": {
          "type": "NONE",
          "value": 0
        },
        "additionalInfoSections": [
          {
            "title": "Size",
            "description": "<p>63\"W X 32\"D X 37\"H</p>\n"
          }
        ],
        "createdDate": "2024-10-01T13:14:36.188Z"
      }
    },
    {
      "orderNumber": 5,
      "_id": "0ac8e913-79b5-4548-86e6-7dcabf7088ce",
      "_owner": "0e0ac59a-ee22-4893-94f5-fe2986338ea7",
      "_createdDate": "2025-05-13T16:01:10.165Z",
      "_updatedDate": "2025-05-13T16:02:48.205Z",
      "slug": "/",
      "product": {
        "seoData": null,
        "inStock": true,
        "weight": 0,
        "name": "MILAN - CHAIR",
        "sku": "CHMILANKIT",
        "formattedDiscountedPrice": "$35.00",
        "link-copy-of-tent-slug": "/pool-covers/milan-chair",
        "productOptions": {},
        "mainMedia": "wix:image://v1/339f77_9000fc3340304347937f5641736e15ef~mv2.jpg/file.jpg#originWidth=2405&originHeight=3607",
        "description": "<p>Seat height: 17\"</p><p>&nbsp;</p><p>&nbsp;</p>",
        "_id": "6f874811-db1a-4020-8c5e-1afe1c0b4241",
        "discountedPrice": 35,
        "link-products-slug": "/product/milan-chair",
        "formattedPrice": "$35.00",
        "price": 35,
        "quantityInStock": null,
        "collections": null,
        "inventoryItem": "9078b7ee-24e5-bfdf-73a1-e501e3f4bdbe",
        "_updatedDate": "2025-04-02T22:47:57.920Z",
        "formattedPricePerUnit": null,
        "slug": "milan-chair",
        "productType": "physical",
        "brand": null,
        "ribbons": [],
        "pricePerUnitData": null,
        "mediaItems": [
          {
            "description": "",
            "id": "339f77_9000fc3340304347937f5641736e15ef~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_9000fc3340304347937f5641736e15ef~mv2.jpg/file.jpg#originWidth=2405&originHeight=3607",
            "title": "MILAN CHAIR 1.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_daca049d1bf048a89031522376b2b51c~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_daca049d1bf048a89031522376b2b51c~mv2.jpg/file.jpg#originWidth=2451&originHeight=3678",
            "title": "MILAN CHAIR.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_3a7613d254b548afa4dfcb0d9b33c4c7~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_3a7613d254b548afa4dfcb0d9b33c4c7~mv2.jpg/file.jpg#originWidth=2200&originHeight=3301",
            "title": "MILAN CHAIR 2.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_488933c21d834255b8eed73fef9a1520~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_488933c21d834255b8eed73fef9a1520~mv2.jpg/file.jpg#originWidth=2205&originHeight=3308",
            "title": "MILAN CHAIR 3.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "32ea80_fc7e459f248442bc9879383b47082e47~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/32ea80_fc7e459f248442bc9879383b47082e47~mv2.jpg/file.jpg#originWidth=732&originHeight=585",
            "title": "",
            "type": "Image"
          }
        ],
        "trackInventory": false,
        "customTextFields": [],
        "pricePerUnit": null,
        "ribbon": "",
        "currency": "USD",
        "productPageUrl": "/product-page/milan-chair",
        "numericId": "1727788478992309",
        "manageVariants": false,
        "link-products-slug-2": "/tent/milan-chair",
        "discount": {
          "type": "NONE",
          "value": 0
        },
        "additionalInfoSections": [
          {
            "title": "Size",
            "description": "<p>18\"D X 18\"W X 34\"H</p>\n"
          }
        ],
        "createdDate": "2024-10-01T13:14:38.992Z"
      }
    },
    {
      "orderNumber": 6,
      "_id": "a6818739-6dd5-43ca-8f8f-a089c419f9e5",
      "_owner": "0e0ac59a-ee22-4893-94f5-fe2986338ea7",
      "_createdDate": "2025-05-13T16:01:24.601Z",
      "_updatedDate": "2025-05-13T16:02:48.933Z",
      "slug": "/",
      "product": {
        "seoData": null,
        "inStock": true,
        "weight": 0,
        "name": "MILAN - DANCE FLOOR",
        "sku": "",
        "formattedDiscountedPrice": "$0.00",
        "link-copy-of-tent-slug": "/pool-covers/milan-dance-floor",
        "productOptions": {},
        "mainMedia": "wix:image://v1/339f77_1b4d2108ae48447e8250c97c99bba344~mv2.jpg/file.jpg#originWidth=3000&originHeight=4500",
        "description": "<p>The Milan Dance Floor adds contemporary elegance with its sleek, white finish and subtle gray veining. Perfect for weddings, corporate events, and upscale soirées, its marble-inspired design brings sophistication to any setting. This chic focal point invites guests to dance the night away in style.</p>",
        "_id": "76f2ede9-c50c-44b9-83d4-9e1e3caa503d",
        "discountedPrice": 0,
        "link-products-slug": "/product/milan-dance-floor",
        "formattedPrice": "$0.00",
        "price": 0,
        "quantityInStock": null,
        "collections": null,
        "inventoryItem": "890d1216-3af3-bb46-7c2b-61e1c355afc2",
        "_updatedDate": "2024-12-20T20:42:24.857Z",
        "formattedPricePerUnit": null,
        "slug": "milan-dance-floor",
        "productType": "physical",
        "brand": null,
        "ribbons": [],
        "pricePerUnitData": null,
        "mediaItems": [
          {
            "description": "",
            "id": "339f77_1b4d2108ae48447e8250c97c99bba344~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_1b4d2108ae48447e8250c97c99bba344~mv2.jpg/file.jpg#originWidth=3000&originHeight=4500",
            "title": "Milan Dance Floor 1.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_3587d9531fa9405390dc7740ba6fd0e7~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_3587d9531fa9405390dc7740ba6fd0e7~mv2.jpg/file.jpg#originWidth=2496&originHeight=3744",
            "title": "Milan Dance Floor 2.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "32ea80_540d2b0cabb6488bb5f46e452a91840f~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/32ea80_540d2b0cabb6488bb5f46e452a91840f~mv2.jpg/file.jpg#originWidth=2415&originHeight=2097",
            "title": "",
            "type": "Image"
          }
        ],
        "trackInventory": false,
        "customTextFields": [],
        "pricePerUnit": null,
        "ribbon": "",
        "currency": "USD",
        "productPageUrl": "/product-page/milan-dance-floor",
        "numericId": "1727788481971548",
        "manageVariants": false,
        "link-products-slug-2": "/tent/milan-dance-floor",
        "discount": {
          "type": "NONE",
          "value": 0
        },
        "additionalInfoSections": [],
        "createdDate": "2024-10-01T13:14:41.971Z"
      }
    },
    {
      "orderNumber": 7,
      "_id": "8ac54ccc-9357-43f6-9882-a4ee7b0a5e9a",
      "_owner": "0e0ac59a-ee22-4893-94f5-fe2986338ea7",
      "_createdDate": "2025-05-13T16:01:42.570Z",
      "_updatedDate": "2025-05-13T16:02:49.984Z",
      "slug": "/",
      "product": {
        "seoData": null,
        "inStock": true,
        "weight": 0,
        "name": "RAMONA - COLLECTION",
        "sku": "",
        "formattedDiscountedPrice": "$2.95",
        "link-copy-of-tent-slug": "/pool-covers/ramona",
        "productOptions": {},
        "mainMedia": "wix:image://v1/339f77_6d9610fa405d4bbeb055b0040a8136d5~mv2.jpg/file.jpg#originWidth=1628&originHeight=2442",
        "description": "<p>Charming and versatile, the Ramona Collection offers a fresh take on classic china. Its subtle details make it perfect for both traditional and contemporary table settings.</p><p>&nbsp;</p><p>The Ramona &amp; Tosca collections stylize together. See photos for inspiration.</p>",
        "_id": "90a1bfa4-0a77-4b19-b36f-9d817c5c986f",
        "discountedPrice": 2.95,
        "link-products-slug": "/product/ramona",
        "formattedPrice": "$2.95",
        "price": 2.95,
        "quantityInStock": null,
        "collections": null,
        "inventoryItem": "6f5e405b-f588-b4e6-4c90-627e83a36790",
        "_updatedDate": "2025-02-21T14:28:17.623Z",
        "formattedPricePerUnit": null,
        "slug": "ramona",
        "productType": "physical",
        "brand": null,
        "ribbons": [],
        "pricePerUnitData": null,
        "mediaItems": [
          {
            "description": "",
            "id": "339f77_6d9610fa405d4bbeb055b0040a8136d5~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_6d9610fa405d4bbeb055b0040a8136d5~mv2.jpg/file.jpg#originWidth=1628&originHeight=2442",
            "title": "RAMONA._edited.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_8e78d8e1b4d747b490b40107139eeb27~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_8e78d8e1b4d747b490b40107139eeb27~mv2.jpg/file.jpg#originWidth=1580&originHeight=2369",
            "title": "RAMONA__edited.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_038064f9aa294e27b07230d543c0e62f~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_038064f9aa294e27b07230d543c0e62f~mv2.jpg/file.jpg#originWidth=4497&originHeight=6745",
            "title": "RAMONA 3.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_1266d8d2420948e9b1a87a5b96d3a4d5~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_1266d8d2420948e9b1a87a5b96d3a4d5~mv2.jpg/file.jpg#originWidth=4822&originHeight=7233",
            "title": "RAMONA 4.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_2b7219a0b49b471ab752c64037ff9f54~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_2b7219a0b49b471ab752c64037ff9f54~mv2.jpg/file.jpg#originWidth=3886&originHeight=5830",
            "title": "RAMONA 2.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_d34a4b01a95b46ffa93cc834765a2a75~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_d34a4b01a95b46ffa93cc834765a2a75~mv2.jpg/file.jpg#originWidth=3093&originHeight=4639",
            "title": "RAMONA 5.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_1861671ade294366a4701458285081cb~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_1861671ade294366a4701458285081cb~mv2.jpg/file.jpg#originWidth=3971&originHeight=5956",
            "title": "RAMONA 1.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_c3f412fea62947f1913d1f3c6f71d73f~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_c3f412fea62947f1913d1f3c6f71d73f~mv2.jpg/file.jpg#originWidth=3625&originHeight=5438",
            "title": "RAMONA MUG.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_a717986a8e234967973eca0b570367ab~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_a717986a8e234967973eca0b570367ab~mv2.jpg/file.jpg#originWidth=4615&originHeight=6922",
            "title": "RAMONA 7.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_90abe19b587646bca33cb941c17bd43b~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_90abe19b587646bca33cb941c17bd43b~mv2.jpg/file.jpg#originWidth=4323&originHeight=6483",
            "title": "RAMONA 6.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "32ea80_42df060dae3e4f7cb473f2bc6b953f73~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/32ea80_42df060dae3e4f7cb473f2bc6b953f73~mv2.jpg/file.jpg#originWidth=1280&originHeight=884",
            "title": "",
            "type": "Image"
          },
          {
            "description": "",
            "id": "32ea80_fa2f0583709742ac840439c42a9174e2~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/32ea80_fa2f0583709742ac840439c42a9174e2~mv2.jpg/file.jpg#originWidth=830&originHeight=959",
            "title": "",
            "type": "Image"
          }
        ],
        "trackInventory": false,
        "customTextFields": [],
        "pricePerUnit": null,
        "ribbon": "",
        "currency": "USD",
        "productPageUrl": "/product-page/ramona",
        "numericId": "1727788481971184",
        "manageVariants": false,
        "link-products-slug-2": "/tent/ramona",
        "discount": {
          "type": "NONE",
          "value": 0
        },
        "additionalInfoSections": [],
        "createdDate": "2024-10-01T13:14:41.971Z"
      }
    },
    {
      "orderNumber": 8,
      "_id": "2a33df65-e50b-42ad-ba7f-854b44727b34",
      "_owner": "0e0ac59a-ee22-4893-94f5-fe2986338ea7",
      "_createdDate": "2025-05-13T16:01:51.661Z",
      "_updatedDate": "2025-05-13T16:02:50.605Z",
      "slug": "/",
      "product": {
        "seoData": null,
        "inStock": true,
        "weight": 0,
        "name": "SLATTED OVAL - BAR",
        "sku": "CSBARSLTOVALKIT",
        "formattedDiscountedPrice": "$2,815.00",
        "link-copy-of-tent-slug": "/pool-covers/slatted-oval-bar",
        "productOptions": {},
        "mainMedia": "wix:image://v1/32ea80_6a5c80d14e12442191cfe06de982269c~mv2.jpg/file.jpg#originWidth=1874&originHeight=2500",
        "description": "<p>Slatted Wood Oval Bar Kit</p><p>&nbsp;</p><p>Painted in Ahwood Moss</p>",
        "_id": "142a72c7-d94d-4fdd-ab28-9504074cd3d5",
        "discountedPrice": 2815,
        "link-products-slug": "/product/slatted-oval-bar",
        "formattedPrice": "$2,815.00",
        "price": 2815,
        "quantityInStock": null,
        "collections": null,
        "inventoryItem": "ebd58d38-26b2-b022-54d7-6afbf8b32c2a",
        "_updatedDate": "2025-02-21T18:58:46.678Z",
        "formattedPricePerUnit": null,
        "slug": "slatted-oval-bar",
        "productType": "physical",
        "brand": null,
        "ribbons": [],
        "pricePerUnitData": null,
        "mediaItems": [
          {
            "description": "",
            "id": "32ea80_6a5c80d14e12442191cfe06de982269c~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/32ea80_6a5c80d14e12442191cfe06de982269c~mv2.jpg/file.jpg#originWidth=1874&originHeight=2500",
            "title": "",
            "type": "Image"
          },
          {
            "description": "",
            "id": "32ea80_20b25906001648a19284fe9c5a4c0ed9~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/32ea80_20b25906001648a19284fe9c5a4c0ed9~mv2.jpg/file.jpg#originWidth=1800&originHeight=4000",
            "title": "",
            "type": "Image"
          },
          {
            "description": "",
            "id": "32ea80_ea5954cd770d49209198fc2c0f932612~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/32ea80_ea5954cd770d49209198fc2c0f932612~mv2.jpg/file.jpg#originWidth=4000&originHeight=1800",
            "title": "",
            "type": "Image"
          },
          {
            "description": "",
            "id": "32ea80_e06d3efd7448495e92b092f5190a62fa~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/32ea80_e06d3efd7448495e92b092f5190a62fa~mv2.jpg/file.jpg#originWidth=397&originHeight=367",
            "title": "",
            "type": "Image"
          }
        ],
        "trackInventory": false,
        "customTextFields": [],
        "pricePerUnit": null,
        "ribbon": "",
        "currency": "USD",
        "productPageUrl": "/product-page/slatted-oval-bar",
        "numericId": "1727788478992123",
        "manageVariants": false,
        "link-products-slug-2": "/tent/slatted-oval-bar",
        "discount": {
          "type": "NONE",
          "value": 0
        },
        "additionalInfoSections": [
          {
            "title": "Size",
            "description": "<p>10'W X&nbsp;17'L X 42\"H</p>\n"
          }
        ],
        "createdDate": "2024-10-01T13:14:38.992Z"
      }
    },
    {
      "orderNumber": 9,
      "_id": "e50192ee-de5e-4498-83c3-dc0a67986b6b",
      "_owner": "0e0ac59a-ee22-4893-94f5-fe2986338ea7",
      "_createdDate": "2025-05-13T16:02:08.310Z",
      "_updatedDate": "2025-05-13T16:02:53.520Z",
      "slug": "/",
      "product": {
        "seoData": null,
        "inStock": true,
        "weight": 0,
        "name": "TOSCA - COLLECTION",
        "sku": "",
        "formattedDiscountedPrice": "$2.95",
        "link-copy-of-tent-slug": "/pool-covers/tosca",
        "productOptions": {},
        "mainMedia": "wix:image://v1/339f77_c8f1eba859bc4c938ce720e086df67c6~mv2.jpg/file.jpg#originWidth=1738&originHeight=2607",
        "description": "<p>The Tosca Collection features timeless elegance with a modern twist. Perfect for formal dinners or upscale events, its sleek lines and refined aesthetic elevate any occasion.</p><p>&nbsp;</p><p>The Ramona &amp; Tosca collections stylize together. See photos for inspiration.</p>",
        "_id": "8d691c59-64f0-43c0-8f2e-cc8f24a82fde",
        "discountedPrice": 2.95,
        "link-products-slug": "/product/tosca",
        "formattedPrice": "$2.95",
        "price": 2.95,
        "quantityInStock": null,
        "collections": null,
        "inventoryItem": "7296e3a6-9b0f-bc3f-70d1-3370db57d021",
        "_updatedDate": "2025-02-21T14:24:17.695Z",
        "formattedPricePerUnit": null,
        "slug": "tosca",
        "productType": "physical",
        "brand": null,
        "ribbons": [],
        "pricePerUnitData": null,
        "mediaItems": [
          {
            "description": "",
            "id": "339f77_c8f1eba859bc4c938ce720e086df67c6~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_c8f1eba859bc4c938ce720e086df67c6~mv2.jpg/file.jpg#originWidth=1738&originHeight=2607",
            "title": "TOSCA_edited.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_1ad5a3c5ab6f4ac9916ec89360d1c26d~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_1ad5a3c5ab6f4ac9916ec89360d1c26d~mv2.jpg/file.jpg#originWidth=3439&originHeight=5159",
            "title": "TOSCA 3.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_7b26617ad3f3414380118cb818b646cf~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_7b26617ad3f3414380118cb818b646cf~mv2.jpg/file.jpg#originWidth=3476&originHeight=5214",
            "title": "TOSCA 2.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_7921abbe1f384bf38d843e6b489f38f5~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_7921abbe1f384bf38d843e6b489f38f5~mv2.jpg/file.jpg#originWidth=3020&originHeight=4530",
            "title": "TOSCA 1.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "339f77_2fb09e5db8064ddc9ded8775784aa52a~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/339f77_2fb09e5db8064ddc9ded8775784aa52a~mv2.jpg/file.jpg#originWidth=3485&originHeight=5227",
            "title": "TOSCA 4.jpg",
            "type": "Image"
          },
          {
            "description": "",
            "id": "32ea80_a443eb7701c04293b43e02a47d18b932~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/32ea80_a443eb7701c04293b43e02a47d18b932~mv2.jpg/file.jpg#originWidth=1280&originHeight=884",
            "title": "",
            "type": "Image"
          },
          {
            "description": "",
            "id": "32ea80_f608e7498d81441f9b54bcaf2e40d395~mv2.jpg",
            "link": null,
            "src": "wix:image://v1/32ea80_f608e7498d81441f9b54bcaf2e40d395~mv2.jpg/file.jpg#originWidth=1600&originHeight=1018",
            "title": "",
            "type": "Image"
          }
        ],
        "trackInventory": false,
        "customTextFields": [],
        "pricePerUnit": null,
        "ribbon": "",
        "currency": "USD",
        "productPageUrl": "/product-page/tosca",
        "numericId": "1727788481971171",
        "manageVariants": false,
        "link-products-slug-2": "/tent/tosca",
        "discount": {
          "type": "NONE",
          "value": 0
        },
        "additionalInfoSections": [],
        "createdDate": "2024-10-01T13:14:41.971Z"
      }
    }
  ]
  return (
    <>
      <Listing slug={slug} products={products} />
      <OurCategories data={categories} pageDetails={{ ourCategoriesTitle: "Our Categories" }} />
    </>
  )
}
