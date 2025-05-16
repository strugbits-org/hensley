import React from 'react'
import CareerOppurtunities from './CareerOppurtunities'
import JobBoard from './JobBoard'
import { Testimonials } from '../common/Testimonials'
import PortfolioSlider from '../common/PortfolioSlider'

const Careers = () => {

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

  return (
    <>
    <CareerOppurtunities />
    <Testimonials data={testimonials} pageDetails={{testimonialsTitle:"who works"}}/>
    <PortfolioSlider display={true} cardCss={'border border-[#E0D6CA]'}/>
    <JobBoard />

    </>
  )
}

export default Careers