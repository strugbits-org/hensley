import React from 'react'
import HeroSection from './HeroSection'
import SliderComponent from '../common/Slider'
import PortfolioSection from './PortfolioSection'
import { BestSellers } from '../Home/BestSellers'
import { Banner } from '../common/Banner'
import { Testimonials } from '../common/Testimonials'
import { MarketSection } from '../common/MarketSection'
import { HensleyNews } from '../common/HensleyNews'

export const MarketPage = ({ data }) => {

    const bestSellers = [
        {
            orderNumber: 1,
            _id: '9d09ea5b-4cfe-4b2f-ab8c-6f6f0837f109',
            _owner: '0e0ac59a-ee22-4893-94f5-fe2986338ea7',
            slug: '/',
            product: {
                seoData: null,
                inStock: true,
                weight: 0,
                name: 'BISHOP NATURAL - HIGHBOY TABLE',
                sku: 'TBBISHOPHBNAT',
                formattedDiscountedPrice: '$141.75',
                'link-copy-of-tent-slug': '/pool-covers/bishop-natural-highboy-table',
                productOptions: {},
                mainMedia: 'wix:image://v1/339f77_ffe78b2bf916403a90ecd49b23ef6989~mv2.jpg/file.jpg#originWidth=3043&originHeight=4565',
                description: '<p>The Bishop Natural Highboy Table features a stunning natural wood finish with a pedestal base, ideal for cocktail hours, receptions, and standing gatherings. Its rustic yet refined design adds warmth and elegance to any event space.</p>',
                _id: '12f5f9f5-bf04-3c0e-da0f-33f3b7a53a95',
                discountedPrice: 141.75,
                'link-products-slug': '/product/bishop-natural-highboy-table',
                formattedPrice: '$141.75',
                price: 141.75,
                quantityInStock: null,
                collections: null,
                inventoryItem: 'ed0a060a-40fb-c3f1-25f0-cc0c485ac56a',
                formattedPricePerUnit: null,
                slug: 'bishop-natural-highboy-table',
                productType: 'physical',
                brand: null,
                ribbons: [],
                pricePerUnitData: null,
                mediaItems: [Array],
                trackInventory: false,
                customTextFields: [],
                pricePerUnit: null,
                ribbon: '',
                currency: 'USD',
                productPageUrl: '/product-page/bishop-natural-highboy-table',
                numericId: '1731518719671000',
                manageVariants: false,
                'link-products-slug-2': '/tent/bishop-natural-highboy-table',
                discount: [Object],
                additionalInfoSections: [Array],
            }
        },
        {
            orderNumber: 2,
            _id: '5d792637-83f1-4787-beb4-97f8ee2c3765',
            _owner: '0e0ac59a-ee22-4893-94f5-fe2986338ea7',
            slug: '/',
            product: {
                seoData: null,
                inStock: true,
                weight: 0,
                name: 'COUNTRY PEAR - LINEN',
                sku: '',
                formattedDiscountedPrice: '$45.00',
                'link-copy-of-tent-slug': '/pool-covers/country-pear',
                productOptions: {},
                mainMedia: 'wix:image://v1/339f77_04ab507cafa14fca83ccd98e3c091f73~mv2.jpg/file.jpg#originWidth=2573&originHeight=3860',
                description: '<p>Fresh pear-green linen, ideal for natural and organic table settings.</p>',
                _id: '758749e4-9dc7-d946-7016-2b821d97a4d5',
                discountedPrice: 45,
                'link-products-slug': '/product/country-pear',
                formattedPrice: '$45.00',
                price: 45,
                quantityInStock: null,
                collections: null,
                inventoryItem: '8a78b61b-6238-26b9-8fe9-d47de2685b2a',
                formattedPricePerUnit: null,
                slug: 'country-pear',
                productType: 'physical',
                brand: null,
                ribbons: [],
                pricePerUnitData: null,
                mediaItems: [Array],
                trackInventory: false,
                customTextFields: [],
                pricePerUnit: null,
                ribbon: '',
                currency: 'USD',
                productPageUrl: '/product-page/country-pear',
                numericId: '1733171910148000',
                manageVariants: false,
                'link-products-slug-2': '/tent/country-pear',
                discount: [Object],
                additionalInfoSections: [],
            }
        },
    ]

    const bannerData = {
        subtitle: 'YOUR DREAM EVENT START HERE',
        backgroundImage: 'wix:image://v1/626075_566beeb14465424c84f85d2dae3b80ab~mv2.jpg/banner-highlights.jpg#originWidth=2495&originHeight=1497',
        _id: 'SINGLE_ITEM_ID',
        _owner: '8ba81b0f-1e45-4f83-95ba-814143aee907',
        mobileImage: 'wix:image://v1/626075_88e6a8c0fcce447d879aee073b0976be~mv2.jpg/banner-highlights-mobile3.jpg#originWidth=357&originHeight=442',
        buttonLabel: 'SEE ALL',
        title: 'HENSLEY HIGHLIGHTS',
        buttonLink: '/subcategory/HIGHLIGHTS'
    }


    const testimonials = [
        {
            name: 'LAURIE ARONS',
            image: 'wix:image://v1/ef8565_a8cecc4e4e5846eabecf77ff6be3b0ee~mv2.png/Laurie%20AronsLaurie%20Arons1-denoise.png#originWidth=6476&originHeight=6476',
            _id: '933cd507-c789-410b-bbda-363d27b45af1',
            _owner: 'ef8565c9-5c6c-47c7-9040-97a253d0bdf6',
            feedback: "After hundreds of projects together and years spent collaborating with a variety of clients, the Hensley team and I have cultivated a bond unlike any other. The team shares my production philosophy and commitment to perfection, always presenting fresh ideas and the logistical expertise needed to bring it all to life. They are outstanding at what they do. After many years of building on our longstanding partnership, I've come to trust the Hensley team as a natural extension of the Laurie Arons Special Events brand. They are invested in the success of our projects, and I trust their product will not only be beautiful but structurally sound.\n",
            order: 10,
            title: 'LAURIE ARONS'
        },
        {
            name: 'JACIN FITZGERALD',
            image: 'wix:image://v1/626075_5640cf39a351450abab42a7be01fdaff~mv2.jpg/JF%20Headshot%20by%20Sarah%20Lawless1-face-upscale-2.5x.jpg#originWidth=2969&originHeight=2969',
            _id: '52ffc8f2-6006-4af6-a4ac-3465eaa046bb',
            _owner: '8ba81b0f-1e45-4f83-95ba-814143aee907',
            feedback: "I've had the pleasure of working with Hensley Event Resources on several events and have always been impressed by your professionalism and attention to detail. During a recent logistically-challenging event in multiple locations, including a redwood forest, your team went above and beyond, handling everything with grace. The custom fabrications and rentals were flawless, and the entire experience was exceptional. I highly recommend Hensley Event Resources.",
            order: 20,
            title: 'DESTINATION EVENTS / FOUNDER & CREATIVE DIRECTOR'
        },
        {
            name: 'JACIN FITZGERALD',
            image: 'wix:image://v1/626075_5640cf39a351450abab42a7be01fdaff~mv2.jpg/JF%20Headshot%20by%20Sarah%20Lawless1-face-upscale-2.5x.jpg#originWidth=2969&originHeight=2969',
            _id: '52ffc8f2-6006-4af6-a4ac-3465eaa046bb',
            _owner: '8ba81b0f-1e45-4f83-95ba-814143aee907',
            feedback: "I've had the pleasure of working with Hensley Event Resources on several events and have always been impressed by your professionalism and attention to detail. During a recent logistically-challenging event in multiple locations, including a redwood forest, your team went above and beyond, handling everything with grace. The custom fabrications and rentals were flawless, and the entire experience was exceptional. I highly recommend Hensley Event Resources.",
            order: 20,
            title: 'DESTINATION EVENTS / FOUNDER & CREATIVE DIRECTOR'
        },
        {
            name: 'JACIN FITZGERALD',
            image: 'wix:image://v1/626075_5640cf39a351450abab42a7be01fdaff~mv2.jpg/JF%20Headshot%20by%20Sarah%20Lawless1-face-upscale-2.5x.jpg#originWidth=2969&originHeight=2969',
            _id: '52ffc8f2-6006-4af6-a4ac-3465eaa046bb',
            _owner: '8ba81b0f-1e45-4f83-95ba-814143aee907',
            feedback: "I've had the pleasure of working with Hensley Event Resources on several events and have always been impressed by your professionalism and attention to detail. During a recent logistically-challenging event in multiple locations, including a redwood forest, your team went above and beyond, handling everything with grace. The custom fabrications and rentals were flawless, and the entire experience was exceptional. I highly recommend Hensley Event Resources.",
            order: 20,
            title: 'DESTINATION EVENTS / FOUNDER & CREATIVE DIRECTOR'
        },
    ]

    const marketsData = [
        {
            tagline: 'CELEBRATING LIFE’S MOMENTS, BEAUTIFULLY PERSONAL',
            image1: 'wix:image://v1/626075_96502d3b939b4925a60ae8c946f81f48~mv2.jpg/086_JV205582-topaz-upscale-1.6x.jpg#originWidth=2995&originHeight=3994',
            orderNumber: 1,
            bestSellerCollection: '17c68530-3289-88a8-6104-90b28b7b79c4',
            _id: '3c1af648-e233-49a3-8655-9c0708602d3d',
            _owner: '0e0ac59a-ee22-4893-94f5-fe2986338ea7',
            slug: '/social',
            content1: { nodes: [Array], metadata: [Object], documentStyle: {} },
            headerCoverImage: 'wix:image://v1/626075_cc51cd8b73ce422190b14476f9674690~mv2.jpg/Social%20(1).jpg#originWidth=9000&originHeight=6000',
            video: 'wix:video://v1/ef8565_18698edf844445c786c92be750d0ed7c/wedding%20.mp4#posterUri=ef8565_18698edf844445c786c92be750d0ed7cf000.jpg&posterWidth=1920&posterHeight=1080',
            buttonLabel: 'DISCOVER',
            title: 'Social',
            buttonLabelMenu: 'SEE MORE'
        },
        {
            tagline: 'ELEVATING PROFESSIONAL GATHERINGS WITH PRECISION AND STYLE',
            image1: 'wix:image://v1/626075_a4a7150465534d3f9845a0c2b1ccb445~mv2.jpg/corporate.jpg#originWidth=3000&originHeight=4498',
            orderNumber: 3,
            bestSellerCollection: '1fd1f132-8242-4b8a-9f2b-aaf44dd59ea6',
            _id: '8b090861-3044-4cbf-ab73-2b8a8888baa2',
            _owner: '0e0ac59a-ee22-4893-94f5-fe2986338ea7',

            slug: '/corporate',
            content1: { nodes: [Array], metadata: [Object], documentStyle: {} },
            headerCoverImage: 'wix:image://v1/626075_a4a7150465534d3f9845a0c2b1ccb445~mv2.jpg/corporate.jpg#originWidth=3000&originHeight=4498',
            video: 'wix:video://v1/ef8565_fca8f45bac8b4a56b7e1cedc3f35fb4d/Corporate.MP4#posterUri=ef8565_fca8f45bac8b4a56b7e1cedc3f35fb4df000.jpg&posterWidth=1080&posterHeight=1920',
            buttonLabel: 'DISCOVER',
            title: 'Corporate',
            buttonLabelMenu: 'SEE MORE'
        },
        {
            tagline: 'CREATING IMPACTFUL EVENTS THAT INSPIRE CHANGE',
            image1: 'wix:image://v1/626075_c5183268497445b4a0d633f510d97e3a~mv2.jpg/CovellFinal4-topaz-upscale-2x.jpg#originWidth=4036&originHeight=2969',
            orderNumber: 2,
            bestSellerCollection: '11c68101-6382-811f-6114-1c3fff7568a7',
            _id: '9526157a-dd1b-48ca-973c-7f5fba2bb4be',
            _owner: '0e0ac59a-ee22-4893-94f5-fe2986338ea7',
            slug: '/nonprofit',
            content1: { nodes: [Array], metadata: [Object], documentStyle: {} },
            headerCoverImage: 'wix:image://v1/626075_96502d3b939b4925a60ae8c946f81f48~mv2.jpg/086_JV205582-topaz-upscale-1.6x.jpg#originWidth=2995&originHeight=3994',
            video: 'wix:video://v1/ef8565_7e7bed4197a14f398f449da0195c5e95/Non%20Profit.mp4#posterUri=ef8565_7e7bed4197a14f398f449da0195c5e95f000.jpg&posterWidth=1080&posterHeight=1920',
            buttonLabel: 'DISCOVER',
            title: 'Nonprofit',
            buttonLabelMenu: 'SEE MORE'
        }
    ]


    const blogsData = [
        {
            author: {
                loginEmail: 'susan@hensleyeventresources.com',
                email: null,
                privacyStatus: 'PUBLIC',
                _id: 'da5da524-14b7-4392-8d96-c6bff8074e05',
                aboutPlain: null,
                profilePhoto: 'https://static.wixstatic.com/media/626075_3e4cffe359e9465db416ab0e5324a40e%7Emv2.png',
                aboutRich: null,
                slug: 'susan',
                lastName: 'Kidwell',
                firstName: 'Susan',
                activityStatus: 'ACTIVE',
                status: 'APPROVED',
                contactId: 'da5da524-14b7-4392-8d96-c6bff8074e05',
                coverPhoto: null,
                phone: null,
                nickname: 'Susan Kidwell'
            },
            _id: 'ef654119-bb58-459d-ba01-ca48ed3546b5',
            _owner: '57e77db9-0069-4eef-a0eb-ca4f8c6de7f7',
            'link-manage-blogs-1-slug': '/posts/a-hilltop-ceremony-above-the-clouds-behind-the-scenes-of-a-wedding-transformation',
            slug: 'a-hilltop-ceremony-above-the-clouds-behind-the-scenes-of-a-wedding-transformation',
            markets: [[Object]],
            blogId: 'a0668c87-77ae-41da-8d59-e59f5fade913',
            studios: [[Object]],
            titleAndDescription: 'A Hilltop Ceremony Above the Clouds: Behind the Scenes of a Wedding Transformation~Where Dreams Meet Terrain Transforming a rugged hilltop into an elegant wedding venue is not just a challenge—it’s a journey. Nestled...',
            blogRef: {
                author: 'da5da524-14b7-4392-8d96-c6bff8074e05',
                mainCategory: '6683fbba7ece979a55e42597',
                viewCount: 12,
                excerpt: 'Where Dreams Meet Terrain Transforming a rugged hilltop into an elegant wedding venue is not just a challenge—it’s a journey. Nestled...',
                timeToRead: 3,
                _id: '6717da180680d658d102f60b',
                tags: [Array],
                uuid: 'a0668c87-77ae-41da-8d59-e59f5fade913',
                featured: false,
                translationId: null,
                slug: 'a-hilltop-ceremony-above-the-clouds-behind-the-scenes-of-a-wedding-transformation',
                coverImage: 'wix:image://v1/ef8565_4a51c8db8f75484e874539f6bc596a91~mv2.jpg/ef8565_4a51c8db8f75484e874539f6bc596a91~mv2.jpg#originWidth=3600&originHeight=2637',
                plainContent: `Where Dreams Meet Terrain Transforming a rugged hilltop into an elegant wedding venue is not just a challenge—it’s a journey. Nestled high above the valleys, where untamed nature meets the sky , a seemingly unworkable site became the perfect canvas for a couple’s dream ceremony. What began as a vision between Shannon Leahy Events and Hensley Event Resources was brought to life through careful planning, creativity, and relentless attention to detail . Starting From 
Scratch: Crafting a Venue in the Sky The location, though stunning, was anything but simple—a steep hilltop scattered with rocks, uneven ground, and wild grass . But to those involved, it was a blank canvas full of possibilities. The mission was ambitious: to create a space that would not only blend into the surroundings but also elevate the natural beauty of the landscape. Over three weeks, our team designed and installed a raised platform leading up a custom staircase —a subtle blend of aesthetics and practicality. Instead of using industrial rails, planter boxes filled with lush hedges  framed the path, offering safety with an organic touch. Every structural decision ensured the ceremony would feel like an extension of the hillside itself. Details That Define a Masterpiece The planning didn’t end with the platform; no element was too small to perfect.  From paint colors to custom cladding on the tent , every choice reflected the couple’s vision. To make sure the 
space came together seamlessly, a life-size tent mock up  was built in the Hensley studio parking lot, where fabric textures, layouts, and design elements were scrutinized and refined. The tent itself was a work of art—a canvas that appeared to 
stretch seamlessly across the sky. Underneath the billowing fabric, crystal chandeliers hung like floating stars , casting a soft glow over the ceremony seating. The aisle was flanked with floral arrangements mirroring the wild beauty of the hilltop , creating a bridge between cultivated design and untamed nature. Ceremony as Storytelling: A Day to Remember The ceremony wasn’t just beautiful—it was deeply personal. As guests gathered beneath the soaring tent, a gospel choir  performed 
during the couple’s recessional, transforming the moment into a soulful celebration. In a nod to the land’s heritage, the couple also participated in a wine-blending ritual  using grapes from the estate, adding a layer of intimacy and meaning to the event. A Seamless Transition Across Hilltops As the ceremony concluded, guests followed a carpeted path  to another hilltop for the cocktail reception. This wasn’t just a transition but a continuation of the ceremony’s storytelling. The reception space was framed by shade structures draped in flowing fabric , reminiscent of a French garden on a summer afternoon , offering guests both elegance and comfort as they mingled under the open sky. The Art of the Impossible What made this 
event truly remarkable was not just the stunning result, but the journey to get there. Transforming a rugged hillside into a ceremony site of grandeur and intimacy  required problem-solving, imagination, and a collaborative spirit. Every challenge—whether logistical or creative—was met with a solution that honored both the couple’s dream and the natural beauty of the location. Pushing Boundaries, Creating Memories At Hensley Event Resources, we believe that the magic lies not only in the end result but also in the process of transformation . It's a process of observing the  unconventional and making it extraordinary, and in turning a wild hilltop into a place where lifelong memories are made . This event was a testament to what’s possible when passion, precision, and collaboration come together. As we continue to push the boundaries of what’s possible in event design, we are reminded that every landscape holds the potential for beauty—and every dream is worth bringing to life. Let’s Build Something Unforgettable  💌 From elegant tabletops and custom structures to seamless tenting solutions and full-scale environments, Hensley brings the expertise and inventory to transform any vision into reality. Contact 
us to book your design consult ation  and discover how our creative solutions can elevate every layer of your event. 💥 Want a closer look? Explore our portfolio , follow us on Instagram, or schedule a personalized walkthrough—we’re ready when you are.`,
                commentCount: 0,
                language: 'en',
                pinned: false,
                categories: [Array],
                richContent: [Object],
                postPageUrl: '/post/a-hilltop-ceremony-above-the-clouds-behind-the-scenes-of-a-wedding-transformation',
                coverImageDisplayed: true,
                title: 'A Hilltop Ceremony Above the Clouds: Behind the Scenes of a Wedding Transformation',
                internalId: '6717da180680d658d102f60b',
                relatedPosts: [Array],
                hashtags: [],
                likeCount: 0
            },
        },
    ]

    return (
        <>
            <HeroSection data={data} />
            <SliderComponent />
            <PortfolioSection />
            <Banner data={bannerData} />
            {/* <BestSellers data={bestSellers} pageDetails={{bestSellerTitle:"best sellers"}}/> */}
            <Testimonials data={testimonials} pageDetails={{ testimonialsTitle: "what people say" }} />
            <MarketSection data={marketsData} pageDetails={{ marketsTitle: 'markets' }} />
            {/* <HensleyNews data={blogsData} pageDetails={{hensleyNewsTitle:"hensley news"}}/> */}
        </>
    )
}
