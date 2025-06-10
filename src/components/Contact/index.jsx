import React from 'react'
import ContactUs from '../Modals/ContactUs';

const Contact = ({ data }) => {
  const { contactFormData, branchesData } = data;
  return (
    <ContactUs classes="mx-auto" data={contactFormData} locationsData={branchesData} zIndex={false} />
  )
}

export default Contact;