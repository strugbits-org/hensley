import logo from '@/assets/logo-footer.png';
import Image from 'next/image';
import { NewsLetter } from '../common/NewsLetter';
import facebookIcon from '@/assets/icons/facebook.png';
import twitterIcon from '@/assets/icons/twitter.png';
import instagramIcon from '@/assets/icons/instagram.png';
import linkedinIcon from '@/assets/icons/linkedin.png';
import { CustomLink } from '../common/CustomLink';

const socialLinks = [
  { icon: facebookIcon, slug: '#' },
  { icon: twitterIcon, slug: '#' },
  { icon: instagramIcon, slug: '#' },
  { icon: linkedinIcon, slug: '#' },
]

const companyLinks = [
  { name: 'CAREERS', slug: '#' },
  { name: 'Terms & conditions', slug: '#' },
  { name: 'Privacy policy', slug: '#' },
]

const addresses = [
  {
    name: 'San Francisco/Monterey', location: `Bay Area
180 W. HILL PLACE
BRISBANE, CA 94005
650.692.7007`, slug: '#'
  },
  {
    name: 'North Bay', location: `(By Appointment)
955 VINTAGE AVENUE
ST HELENA, CA 94574
650.692.7007`, slug: '#'
  },
]

export const Footer = () => {
  return (
    <footer className='relative footer bg-secondary-alt min-h-screen z-50 flex flex-col justify-between p-6 pt-12'>
      <div className='footer-content flex flex-wrap justify-between gap-y-6 lg:grow-0 grow'>
        <div className='order-1 w-full lg:w-1/2 xl:w-3/12'>
          <h2 className='text-sm font-haasMedium uppercase text-primary mb-[18.5px]'>NewsLetter:</h2>
          <p className='text-sm font-haasRegular uppercase text-primary mb-5'>REGISTER YOUR EMAIL AND STAY UP TO DATE WITH EVERYTHING BEFORE ANYONE ELSE.</p>
          <NewsLetter />
        </div>
        <div className='order-4 xl:order-2 lg:w-4/12 flex justify-between mb-20'>
          {addresses.map((address, index) => (
            <div className='w-2/5 lg:w-1/3' key={index}>
              <h2 className='text-sm font-haasMedium uppercase text-primary mb-1'>{address.name}</h2>
              <p className='text-sm font-haasRegular uppercase text-primary'>{address.location}</p>
            </div>
          ))}
        </div>
        <div className='order-3 w-1/2 lg:w-2/12'>
          {companyLinks.map((link, index) => (
            <CustomLink to={link.slug} key={index}>
              <p className='text-sm font-haasRegular uppercase text-primary mb-1'>{link.name}</p>
            </CustomLink>
          ))}
          <div className='max-w-[133px] mt-9 flex lg:hidden social-links w-full gap-3 justify-between'>
            {socialLinks.map((link, index) => (
              <CustomLink to={link.slug} key={index}>
                <Image src={link.icon} alt="icon" />
              </CustomLink>
            ))}
          </div>
        </div>
        <div className='order-2 xl:order-4 w-1/2 xl:w-2/12 flex flex-col items-end'>
        <div className='max-w-[132px]'>

        </div>
          <h2 className='text-sm font-haasMedium uppercase text-primary mb-[18.5px]'> EVENT RESOURCES EST. 1980 </h2>
          <p className='text-sm font-haasRegular uppercase text-primary mb-5'>©2023 HENSLEY EVENT RESOURCES</p>
          <div className='hidden lg:flex social-links w-full gap-3 justify-between'>
            {socialLinks.map((link, index) => (
              <CustomLink to={link.slug} key={index}>
                <Image src={link.icon} alt="icon" />
              </CustomLink>
            ))}
          </div>
        </div>
      </div>
      <Image className='mt-20 lg:mt-0 mx-auto w-full' src={logo} alt="logo" />
    </footer>
  )
}