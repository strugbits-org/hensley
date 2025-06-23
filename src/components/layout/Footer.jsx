import logo from '@/assets/logo-footer.png';
import { NewsLetter } from '../common/NewsLetter';
import { CustomLink } from '../common/CustomLink';
import { PrimaryImage } from '../common/PrimaryImage';

export const Footer = ({ data }) => {
  const { footerData, socialLinks, footerNaviationData, branches } = data;

  return (
    <footer className='relative footer bg-secondary-alt min-h-screen flex flex-col justify-between p-6 pt-12 z-[100]'>
      <div className='footer-content flex justify-between flex-wrap lg:flex-nowrap lg:gap-x-10 gap-y-20 md:gap-y-14 lg:gap-y-6 grow md:grow-0 items-stretch md:items-start'>
        <div className='order-1 w-full md:w-1/2 lg:w-2/6'>
          <NewsLetter data={footerData} />
        </div>
        <div className='order-2 md:order-3 lg:order-2 w-full md:w-2/3 lg:w-2/6 flex justify-between lg:justify-evenly mt-80 md:mt-0'>
          {branches.map((address, index) => (
            <div className='w-2/5 lg:w-1/3' key={index}>
              <h2 className='text-sm font-haasMedium uppercase text-primary mb-1 break-words'>{address.title}</h2>
              <p className='text-sm font-haasRegular uppercase text-primary'>{address.description}</p>
            </div>
          ))}
        </div>
        <div className='order-3 md:order-4 w-1/2 md:w-1/3 lg:w-1/6 flex flex-col md:items-end lg:items-center'>
          <div className='footer-navigation'>
            {footerNaviationData.map((item, index) => (
              <CustomLink to={item.link} key={index} target={item.target}>
                <p className='text-sm font-haasRegular uppercase text-primary mb-1'>{item.title}</p>
              </CustomLink>
            ))}
            <div className='max-w-[133px] mt-9 flex lg:hidden social-links w-full gap-3 justify-between'>
              {socialLinks.map((item, index) => (
                <CustomLink to={item.link} target={item.target} key={index}>
                  <PrimaryImage min_h={24} min_w={24} fit='fit' url={item.icon} defaultDimensions={{ height: "24px", width: "24px" }} alt="icon" />
                </CustomLink>
              ))}
            </div>
          </div>
        </div>
        <div className='order-4 md:order-2 lg:order-4 w-1/2 lg:w-1/6 flex flex-col max-w-[150px]'>
          <h2 className='text-sm font-haasMedium uppercase text-primary mb-[18.5px]'> {footerData.copyrightText1} </h2>
          <p className='text-sm font-haasRegular uppercase text-primary mb-5'>{footerData.copyrightText2}</p>
          <div className='hidden lg:flex social-links w-full gap-3 justify-between max-w-[133px]'>
            {socialLinks.map((item, index) => (
              <CustomLink to={item.link} key={index} target={item.target}>
                <PrimaryImage min_h={24} min_w={24} fit='fit' url={item.icon} defaultDimensions={{ height: "24px", width: "24px" }} alt="icon" />
              </CustomLink>
            ))}
          </div>
        </div>
      </div>
      <PrimaryImage min_w={1920} min_h={300} timeout={0} url={footerData.logo} fit='fit' customClasses="mt-20 lg:mt-0 mx-auto w-full" src={logo} alt="logo" />
    </footer>
  )
}