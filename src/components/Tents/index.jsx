import React from 'react'
import TentsTypes from './TentsTypes'
import BannerStructures from './BannerStructures'
import OurProjects from '../Collections/OurProjects'
import { HensleyNews } from '../common/HensleyNews'
import { Button } from './Button'
import { DownloadButton } from './DownloadButton'

const Tents = () => {

    const portfolioData = [{
        image: 'wix:image://v1/9cb54ed2-0550-413c-a950-945e3c014a4f/626075_0b9f1f76771a45919735cd9f3ced3240~mv2.jpg#originWidth=3540&originHeight=1991',
        _id: '4d1851d7-43ed-46b5-9867-d13625c76951',
        _owner: '57e77db9-0069-4eef-a0eb-ca4f8c6de7f7',
        _createdDate: new Date('2024-12-10T18:00:22.756Z'),
        projectId: '94fb8814-38ca-4129-9b05-7adf27032334',
        _updatedDate: new Date('2025-05-22T09:04:09.269Z'),
        slug: 'a-three-tiered-wedding-on-a-hillside-with-unmatched-pacific-views',
        portfolioRef: {
            collectionIds: [], // Fill this if needed
            url: 'https://www.hensleyeventresources.com/portfolio-collections/my-portfolio/a-three-tiered-wedding-on-a-hillside-with-unmatched-pacific-views',
            description: `When Laurie Arons envisions an event, you know it’s going to be unforgettable. We had the privilege of collaborating with Laurie to execute a stunning three-tier wedding reception for 400 guests, set against the breathtaking backdrop of the Pacific Ocean...`, // Truncated for readability, replace if full needed
            _id: '94fb8814-38ca-4129-9b05-7adf27032334',
            _createdDate: new Date('2024-12-10T17:34:07.168Z'),
            _updatedDate: new Date('2024-12-10T17:41:50.160Z'),
            slug: 'a-three-tiered-wedding-on-a-hillside-with-unmatched-pacific-views',
            coverImage: {
                imageInfo: "wix:image://v1/9cb54ed2-0550-413c-a950-945e3c014a4f/626075_0b9f1f76771a45919735cd9f3ced3240~mv2.jpg#originWidth=3540&originHeight=1991"
            }, // Fill this if needed
            revision: '5',
            details: [],
            title: 'A Three-Tiered Wedding on a Hillside With Unmatched Pacific Views'
        }
    },
    {

        image: 'wix:image://v1/9cb54ed2-0550-413c-a950-945e3c014a4f/626075_0b9f1f76771a45919735cd9f3ced3240~mv2.jpg#originWidth=3540&originHeight=1991',
        _id: '4d1851d7-43ed-46b5-9867-d13625c76951',
        _owner: '57e77db9-0069-4eef-a0eb-ca4f8c6de7f7',
        _createdDate: new Date('2024-12-10T18:00:22.756Z'),
        projectId: '94fb8814-38ca-4129-9b05-7adf27032334',
        _updatedDate: new Date('2025-05-22T09:04:09.269Z'),
        slug: 'a-three-tiered-wedding-on-a-hillside-with-unmatched-pacific-views',
        portfolioRef: {
            collectionIds: [], // Fill this if needed
            url: 'https://www.hensleyeventresources.com/portfolio-collections/my-portfolio/a-three-tiered-wedding-on-a-hillside-with-unmatched-pacific-views',
            description: `When Laurie Arons envisions an event, you know it’s going to be unforgettable. We had the privilege of collaborating with Laurie to execute a stunning three-tier wedding reception for 400 guests, set against the breathtaking backdrop of the Pacific Ocean...`, // Truncated for readability, replace if full needed
            _id: '94fb8814-38ca-4129-9b05-7adf27032334',
            _createdDate: new Date('2024-12-10T17:34:07.168Z'),
            _updatedDate: new Date('2024-12-10T17:41:50.160Z'),
            slug: 'a-three-tiered-wedding-on-a-hillside-with-unmatched-pacific-views',
            coverImage: {
                imageInfo: "wix:image://v1/9cb54ed2-0550-413c-a950-945e3c014a4f/626075_0b9f1f76771a45919735cd9f3ced3240~mv2.jpg#originWidth=3540&originHeight=1991"
            }, // Fill this if needed
            revision: '5',
            details: [],
            title: 'A Three-Tiered Wedding on a Hillside With Unmatched Pacific Views'
        }
    },
    {
        image: 'wix:image://v1/9cb54ed2-0550-413c-a950-945e3c014a4f/626075_0b9f1f76771a45919735cd9f3ced3240~mv2.jpg#originWidth=3540&originHeight=1991',
        _id: '4d1851d7-43ed-46b5-9867-d13625c76951',
        _owner: '57e77db9-0069-4eef-a0eb-ca4f8c6de7f7',
        _createdDate: new Date('2024-12-10T18:00:22.756Z'),
        projectId: '94fb8814-38ca-4129-9b05-7adf27032334',
        _updatedDate: new Date('2025-05-22T09:04:09.269Z'),
        slug: 'a-three-tiered-wedding-on-a-hillside-with-unmatched-pacific-views',
        portfolioRef: {
            collectionIds: [], // Fill this if needed
            url: 'https://www.hensleyeventresources.com/portfolio-collections/my-portfolio/a-three-tiered-wedding-on-a-hillside-with-unmatched-pacific-views',
            description: `When Laurie Arons envisions an event, you know it’s going to be unforgettable. We had the privilege of collaborating with Laurie to execute a stunning three-tier wedding reception for 400 guests, set against the breathtaking backdrop of the Pacific Ocean...`, // Truncated for readability, replace if full needed
            _id: '94fb8814-38ca-4129-9b05-7adf27032334',
            _createdDate: new Date('2024-12-10T17:34:07.168Z'),
            _updatedDate: new Date('2024-12-10T17:41:50.160Z'),
            slug: 'a-three-tiered-wedding-on-a-hillside-with-unmatched-pacific-views',
            coverImage: {
                imageInfo: "wix:image://v1/9cb54ed2-0550-413c-a950-945e3c014a4f/626075_0b9f1f76771a45919735cd9f3ced3240~mv2.jpg#originWidth=3540&originHeight=1991"
            }, // Fill this if needed
            revision: '5',
            details: [],
            title: 'A Three-Tiered Wedding on a Hillside With Unmatched Pacific Views'
        }
    }

    ]

    const blogsData = [{
        author: {
            loginEmail: 'susan@hensleyeventresources.com',
            email: null,
            privacyStatus: 'PUBLIC',
            _id: 'da5da524-14b7-4392-8d96-c6bff8074e05',
            _createdDate: new Date('2024-10-22T22:36:26.000Z'),
            aboutPlain: null,
            profilePhoto: 'https://static.wixstatic.com/media/626075_3e4cffe359e9465db416ab0e5324a40e~mv2.png',
            aboutRich: null,
            _updatedDate: new Date('2024-10-22T22:36:25.859Z'),
            slug: 'susan',
            lastName: 'Kidwell',
            firstName: 'Susan',
            activityStatus: 'ACTIVE',
            lastLoginDate: new Date('2024-10-22T22:36:26.000Z'),
            status: 'APPROVED',
            contactId: 'da5da524-14b7-4392-8d96-c6bff8074e05',
            coverPhoto: null,
            phone: null,
            nickname: 'Susan Kidwell'
        },
        _id: 'ef654119-bb58-459d-ba01-ca48ed3546b5',
        _owner: '57e77db9-0069-4eef-a0eb-ca4f8c6de7f7',
        _createdDate: new Date('2024-10-22T17:01:42.112Z'),
        'link-manage-blogs-1-slug': '/posts/hilltop-wedding-ceremony-behind-the-scenes',
        _updatedDate: new Date('2025-05-20T15:58:38.558Z'),
        slug: 'hilltop-wedding-ceremony-behind-the-scenes',
        markets: [/* your market objects here */],
        blogId: 'a0668c87-77ae-41da-8d59-e59f5fade913',
        studios: [/* your studio objects here */],
        titleAndDescription: 'A Hilltop Ceremony Above the Clouds: Behind the Scenes of a Wedding Transformation~Where Dreams Meet Terrain: Crafting a Hilltop Wedding Ceremony Above the Clouds  Transforming a rugged hilltop into an elegant wedding...',
        blogRef: {
            author: 'da5da524-14b7-4392-8d96-c6bff8074e05',
            mainCategory: '6683fbba7ece979a55e42597',
            viewCount: 13,
            excerpt: 'Where Dreams Meet Terrain: Crafting a Hilltop Wedding Ceremony Above the Clouds  Transforming a rugged hilltop into an elegant wedding...',
            timeToRead: 3,
            _id: '6717da180680d658d102f60b',
            tags: [/* your tags here */],
            uuid: 'a0668c87-77ae-41da-8d59-e59f5fade913',
            featured: false,
            translationId: null,
            slug: 'hilltop-wedding-ceremony-behind-the-scenes',
            coverImage: 'wix:image://v1/339f77_884d2a18b83d4475aef9f2460602d6e6~mv2.jpg/339f77_884d2a18b83d4475aef9f2460602d6e6~mv2.jpg#originWidth=3282&originHeight=1500',
            plainContent: `Where Dreams Meet Terrain: Crafting a Hilltop Wedding Ceremony Above the Clouds ...
    [full content here]`,
            commentCount: 0,
            language: 'en',
            publishedDate: new Date('2024-10-22T17:01:36.188Z'),
            pinned: false,
            categories: [/* your categories here */],
            richContent: {/* your rich content object here */ },
            postPageUrl: '/post/hilltop-wedding-ceremony-behind-the-scenes',
            coverImageDisplayed: true,
            title: 'A Hilltop Ceremony Above the Clouds: Behind the Scenes of a Wedding Transformation',
            lastPublishedDate: new Date('2025-05-20T15:58:31.918Z'),
            internalId: '6717da180680d658d102f60b',
            relatedPosts: [/* related posts array here */],
            hashtags: [],
            likeCount: 0
        },
        publishDate: new Date('2024-10-22T17:01:36.188Z')
    },
    {
        author: {
            loginEmail: 'susan@hensleyeventresources.com',
            email: null,
            privacyStatus: 'PUBLIC',
            _id: 'da5da524-14b7-4392-8d96-c6bff8074e05',
            _createdDate: new Date('2024-10-22T22:36:26.000Z'),
            aboutPlain: null,
            profilePhoto: 'https://static.wixstatic.com/media/626075_3e4cffe359e9465db416ab0e5324a40e~mv2.png',
            aboutRich: null,
            _updatedDate: new Date('2024-10-22T22:36:25.859Z'),
            slug: 'susan',
            lastName: 'Kidwell',
            firstName: 'Susan',
            activityStatus: 'ACTIVE',
            lastLoginDate: new Date('2024-10-22T22:36:26.000Z'),
            status: 'APPROVED',
            contactId: 'da5da524-14b7-4392-8d96-c6bff8074e05',
            coverPhoto: null,
            phone: null,
            nickname: 'Susan Kidwell'
        },
        _id: 'ef654119-bb58-459d-ba01-ca48ed3546b5',
        _owner: '57e77db9-0069-4eef-a0eb-ca4f8c6de7f7',
        _createdDate: new Date('2024-10-22T17:01:42.112Z'),
        'link-manage-blogs-1-slug': '/posts/hilltop-wedding-ceremony-behind-the-scenes',
        _updatedDate: new Date('2025-05-20T15:58:38.558Z'),
        slug: 'hilltop-wedding-ceremony-behind-the-scenes',
        markets: [/* your market objects here */],
        blogId: 'a0668c87-77ae-41da-8d59-e59f5fade913',
        studios: [/* your studio objects here */],
        titleAndDescription: 'A Hilltop Ceremony Above the Clouds: Behind the Scenes of a Wedding Transformation~Where Dreams Meet Terrain: Crafting a Hilltop Wedding Ceremony Above the Clouds  Transforming a rugged hilltop into an elegant wedding...',
        blogRef: {
            author: 'da5da524-14b7-4392-8d96-c6bff8074e05',
            mainCategory: '6683fbba7ece979a55e42597',
            viewCount: 13,
            excerpt: 'Where Dreams Meet Terrain: Crafting a Hilltop Wedding Ceremony Above the Clouds  Transforming a rugged hilltop into an elegant wedding...',
            timeToRead: 3,
            _id: '6717da180680d658d102f60b',
            tags: [/* your tags here */],
            uuid: 'a0668c87-77ae-41da-8d59-e59f5fade913',
            featured: false,
            translationId: null,
            slug: 'hilltop-wedding-ceremony-behind-the-scenes',
            coverImage: 'wix:image://v1/339f77_884d2a18b83d4475aef9f2460602d6e6~mv2.jpg/339f77_884d2a18b83d4475aef9f2460602d6e6~mv2.jpg#originWidth=3282&originHeight=1500',
            plainContent: `Where Dreams Meet Terrain: Crafting a Hilltop Wedding Ceremony Above the Clouds ...
    [full content here]`,
            commentCount: 0,
            language: 'en',
            publishedDate: new Date('2024-10-22T17:01:36.188Z'),
            pinned: false,
            categories: [/* your categories here */],
            richContent: {/* your rich content object here */ },
            postPageUrl: '/post/hilltop-wedding-ceremony-behind-the-scenes',
            coverImageDisplayed: true,
            title: 'A Hilltop Ceremony Above the Clouds: Behind the Scenes of a Wedding Transformation',
            lastPublishedDate: new Date('2025-05-20T15:58:31.918Z'),
            internalId: '6717da180680d658d102f60b',
            relatedPosts: [/* related posts array here */],
            hashtags: [],
            likeCount: 0
        },
        publishDate: new Date('2024-10-22T17:01:36.188Z')
    },
    {
        author: {
            loginEmail: 'susan@hensleyeventresources.com',
            email: null,
            privacyStatus: 'PUBLIC',
            _id: 'da5da524-14b7-4392-8d96-c6bff8074e05',
            _createdDate: new Date('2024-10-22T22:36:26.000Z'),
            aboutPlain: null,
            profilePhoto: 'https://static.wixstatic.com/media/626075_3e4cffe359e9465db416ab0e5324a40e~mv2.png',
            aboutRich: null,
            _updatedDate: new Date('2024-10-22T22:36:25.859Z'),
            slug: 'susan',
            lastName: 'Kidwell',
            firstName: 'Susan',
            activityStatus: 'ACTIVE',
            lastLoginDate: new Date('2024-10-22T22:36:26.000Z'),
            status: 'APPROVED',
            contactId: 'da5da524-14b7-4392-8d96-c6bff8074e05',
            coverPhoto: null,
            phone: null,
            nickname: 'Susan Kidwell'
        },
        _id: 'ef654119-bb58-459d-ba01-ca48ed3546b5',
        _owner: '57e77db9-0069-4eef-a0eb-ca4f8c6de7f7',
        _createdDate: new Date('2024-10-22T17:01:42.112Z'),
        'link-manage-blogs-1-slug': '/posts/hilltop-wedding-ceremony-behind-the-scenes',
        _updatedDate: new Date('2025-05-20T15:58:38.558Z'),
        slug: 'hilltop-wedding-ceremony-behind-the-scenes',
        markets: [/* your market objects here */],
        blogId: 'a0668c87-77ae-41da-8d59-e59f5fade913',
        studios: [/* your studio objects here */],
        titleAndDescription: 'A Hilltop Ceremony Above the Clouds: Behind the Scenes of a Wedding Transformation~Where Dreams Meet Terrain: Crafting a Hilltop Wedding Ceremony Above the Clouds  Transforming a rugged hilltop into an elegant wedding...',
        blogRef: {
            author: 'da5da524-14b7-4392-8d96-c6bff8074e05',
            mainCategory: '6683fbba7ece979a55e42597',
            viewCount: 13,
            excerpt: 'Where Dreams Meet Terrain: Crafting a Hilltop Wedding Ceremony Above the Clouds  Transforming a rugged hilltop into an elegant wedding...',
            timeToRead: 3,
            _id: '6717da180680d658d102f60b',
            tags: [/* your tags here */],
            uuid: 'a0668c87-77ae-41da-8d59-e59f5fade913',
            featured: false,
            translationId: null,
            slug: 'hilltop-wedding-ceremony-behind-the-scenes',
            coverImage: 'wix:image://v1/339f77_884d2a18b83d4475aef9f2460602d6e6~mv2.jpg/339f77_884d2a18b83d4475aef9f2460602d6e6~mv2.jpg#originWidth=3282&originHeight=1500',
            plainContent: `Where Dreams Meet Terrain: Crafting a Hilltop Wedding Ceremony Above the Clouds ...
    [full content here]`,
            commentCount: 0,
            language: 'en',
            publishedDate: new Date('2024-10-22T17:01:36.188Z'),
            pinned: false,
            categories: [/* your categories here */],
            richContent: {/* your rich content object here */ },
            postPageUrl: '/post/hilltop-wedding-ceremony-behind-the-scenes',
            coverImageDisplayed: true,
            title: 'A Hilltop Ceremony Above the Clouds: Behind the Scenes of a Wedding Transformation',
            lastPublishedDate: new Date('2025-05-20T15:58:31.918Z'),
            internalId: '6717da180680d658d102f60b',
            relatedPosts: [/* related posts array here */],
            hashtags: [],
            likeCount: 0
        },
        publishDate: new Date('2024-10-22T17:01:36.188Z')
    },
    {
        author: {
            loginEmail: 'susan@hensleyeventresources.com',
            email: null,
            privacyStatus: 'PUBLIC',
            _id: 'da5da524-14b7-4392-8d96-c6bff8074e05',
            _createdDate: new Date('2024-10-22T22:36:26.000Z'),
            aboutPlain: null,
            profilePhoto: 'https://static.wixstatic.com/media/626075_3e4cffe359e9465db416ab0e5324a40e~mv2.png',
            aboutRich: null,
            _updatedDate: new Date('2024-10-22T22:36:25.859Z'),
            slug: 'susan',
            lastName: 'Kidwell',
            firstName: 'Susan',
            activityStatus: 'ACTIVE',
            lastLoginDate: new Date('2024-10-22T22:36:26.000Z'),
            status: 'APPROVED',
            contactId: 'da5da524-14b7-4392-8d96-c6bff8074e05',
            coverPhoto: null,
            phone: null,
            nickname: 'Susan Kidwell'
        },
        _id: 'ef654119-bb58-459d-ba01-ca48ed3546b5',
        _owner: '57e77db9-0069-4eef-a0eb-ca4f8c6de7f7',
        _createdDate: new Date('2024-10-22T17:01:42.112Z'),
        'link-manage-blogs-1-slug': '/posts/hilltop-wedding-ceremony-behind-the-scenes',
        _updatedDate: new Date('2025-05-20T15:58:38.558Z'),
        slug: 'hilltop-wedding-ceremony-behind-the-scenes',
        markets: [/* your market objects here */],
        blogId: 'a0668c87-77ae-41da-8d59-e59f5fade913',
        studios: [/* your studio objects here */],
        titleAndDescription: 'A Hilltop Ceremony Above the Clouds: Behind the Scenes of a Wedding Transformation~Where Dreams Meet Terrain: Crafting a Hilltop Wedding Ceremony Above the Clouds  Transforming a rugged hilltop into an elegant wedding...',
        blogRef: {
            author: 'da5da524-14b7-4392-8d96-c6bff8074e05',
            mainCategory: '6683fbba7ece979a55e42597',
            viewCount: 13,
            excerpt: 'Where Dreams Meet Terrain: Crafting a Hilltop Wedding Ceremony Above the Clouds  Transforming a rugged hilltop into an elegant wedding...',
            timeToRead: 3,
            _id: '6717da180680d658d102f60b',
            tags: [/* your tags here */],
            uuid: 'a0668c87-77ae-41da-8d59-e59f5fade913',
            featured: false,
            translationId: null,
            slug: 'hilltop-wedding-ceremony-behind-the-scenes',
            coverImage: 'wix:image://v1/339f77_884d2a18b83d4475aef9f2460602d6e6~mv2.jpg/339f77_884d2a18b83d4475aef9f2460602d6e6~mv2.jpg#originWidth=3282&originHeight=1500',
            plainContent: `Where Dreams Meet Terrain: Crafting a Hilltop Wedding Ceremony Above the Clouds ...
    [full content here]`,
            commentCount: 0,
            language: 'en',
            publishedDate: new Date('2024-10-22T17:01:36.188Z'),
            pinned: false,
            categories: [/* your categories here */],
            richContent: {/* your rich content object here */ },
            postPageUrl: '/post/hilltop-wedding-ceremony-behind-the-scenes',
            coverImageDisplayed: true,
            title: 'A Hilltop Ceremony Above the Clouds: Behind the Scenes of a Wedding Transformation',
            lastPublishedDate: new Date('2025-05-20T15:58:31.918Z'),
            internalId: '6717da180680d658d102f60b',
            relatedPosts: [/* related posts array here */],
            hashtags: [],
            likeCount: 0
        },
        publishDate: new Date('2024-10-22T17:01:36.188Z')
    },
    {
        author: {
            loginEmail: 'susan@hensleyeventresources.com',
            email: null,
            privacyStatus: 'PUBLIC',
            _id: 'da5da524-14b7-4392-8d96-c6bff8074e05',
            _createdDate: new Date('2024-10-22T22:36:26.000Z'),
            aboutPlain: null,
            profilePhoto: 'https://static.wixstatic.com/media/626075_3e4cffe359e9465db416ab0e5324a40e~mv2.png',
            aboutRich: null,
            _updatedDate: new Date('2024-10-22T22:36:25.859Z'),
            slug: 'susan',
            lastName: 'Kidwell',
            firstName: 'Susan',
            activityStatus: 'ACTIVE',
            lastLoginDate: new Date('2024-10-22T22:36:26.000Z'),
            status: 'APPROVED',
            contactId: 'da5da524-14b7-4392-8d96-c6bff8074e05',
            coverPhoto: null,
            phone: null,
            nickname: 'Susan Kidwell'
        },
        _id: 'ef654119-bb58-459d-ba01-ca48ed3546b5',
        _owner: '57e77db9-0069-4eef-a0eb-ca4f8c6de7f7',
        _createdDate: new Date('2024-10-22T17:01:42.112Z'),
        'link-manage-blogs-1-slug': '/posts/hilltop-wedding-ceremony-behind-the-scenes',
        _updatedDate: new Date('2025-05-20T15:58:38.558Z'),
        slug: 'hilltop-wedding-ceremony-behind-the-scenes',
        markets: [/* your market objects here */],
        blogId: 'a0668c87-77ae-41da-8d59-e59f5fade913',
        studios: [/* your studio objects here */],
        titleAndDescription: 'A Hilltop Ceremony Above the Clouds: Behind the Scenes of a Wedding Transformation~Where Dreams Meet Terrain: Crafting a Hilltop Wedding Ceremony Above the Clouds  Transforming a rugged hilltop into an elegant wedding...',
        blogRef: {
            author: 'da5da524-14b7-4392-8d96-c6bff8074e05',
            mainCategory: '6683fbba7ece979a55e42597',
            viewCount: 13,
            excerpt: 'Where Dreams Meet Terrain: Crafting a Hilltop Wedding Ceremony Above the Clouds  Transforming a rugged hilltop into an elegant wedding...',
            timeToRead: 3,
            _id: '6717da180680d658d102f60b',
            tags: [/* your tags here */],
            uuid: 'a0668c87-77ae-41da-8d59-e59f5fade913',
            featured: false,
            translationId: null,
            slug: 'hilltop-wedding-ceremony-behind-the-scenes',
            coverImage: 'wix:image://v1/339f77_884d2a18b83d4475aef9f2460602d6e6~mv2.jpg/339f77_884d2a18b83d4475aef9f2460602d6e6~mv2.jpg#originWidth=3282&originHeight=1500',
            plainContent: `Where Dreams Meet Terrain: Crafting a Hilltop Wedding Ceremony Above the Clouds ...
    [full content here]`,
            commentCount: 0,
            language: 'en',
            publishedDate: new Date('2024-10-22T17:01:36.188Z'),
            pinned: false,
            categories: [/* your categories here */],
            richContent: {/* your rich content object here */ },
            postPageUrl: '/post/hilltop-wedding-ceremony-behind-the-scenes',
            coverImageDisplayed: true,
            title: 'A Hilltop Ceremony Above the Clouds: Behind the Scenes of a Wedding Transformation',
            lastPublishedDate: new Date('2025-05-20T15:58:31.918Z'),
            internalId: '6717da180680d658d102f60b',
            relatedPosts: [/* related posts array here */],
            hashtags: [],
            likeCount: 0
        },
        publishDate: new Date('2024-10-22T17:01:36.188Z')
    },
    ]

    return (
        <>
            <TentsTypes />
            <BannerStructures />
            <OurProjects data={portfolioData} />
            <HensleyNews data={blogsData} pageDetails={{ hensleyNewsTitle: "Products featured in this PROJECT entry:" }} />
            <OurProjects data={portfolioData} />
            <HensleyNews data={blogsData} pageDetails={{ hensleyNewsTitle: "Products featured in this PROJECT entry:" }} />
            <BannerStructures />
            <HensleyNews data={blogsData} pageDetails={{ hensleyNewsTitle: "Products featured in this PROJECT entry:" }} />
           <div className='w-full flex justify-center items-center'>
             <DownloadButton text="DOWNLOAD MASTERCLASS TENTING 101" classes={"w-[656px]"} iconTrue={"true"}/>
           </div>
        </>
    )
}

export default Tents