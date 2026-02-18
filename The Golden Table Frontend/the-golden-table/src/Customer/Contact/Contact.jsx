import React, { useEffect } from 'react'
import "./Contact.css"
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { SocialIcon } from 'react-social-icons'

function Contact() {
    
  return (
    <>
      <div className="main-contact">
        <div className="map">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d648.6039316142957!2d72.83341012382338!3d18. 
                  922448255326827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1c0da7c54cd%3A0x54f876b6d9e19f64!
                  2sThe%20Taj%20Mahal%20Palace%20Hotel%2C%20B%20K%20Boman%20Behram%20Marg%2C%20Apollo%20Bandar%2C%20Colaba%2C%
                  20Mumbai%2C%20Maharashtra%20400001!5e1!3m2!1sen!2sin!4v1770015352373!5m2!1sen!2sin" width="100%" height="300" 
                  style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>

        <div className='contact-social'>
          <div className="contact">
            <h3>Contact Detail</h3>
            <a href="tel:+919876543210"><FaPhoneAlt /> :-  9876543210</a>
            <a href="mailto:contact@goldentable.com"><MdEmail /> :-  TheGoldenTable@gmail.com</a>
          </div>

          <div className="social">
            <h3>Our Social Media</h3>
            <div className="social-icons">
              <SocialIcon url="https://wa.me/919876543210" network="whatsapp" />
              <SocialIcon url="https://www.instagram.com/" network="instagram" />
              <SocialIcon url="https://x.com/" network="x" />
              <SocialIcon url="youtube.com" network="youtube" />
              <SocialIcon url="https://www.facebook.com/" network="facebook" />
            </div>
          </div>
        </div>

        <div className="hours">
          <h3>Opening Hours</h3>
          <p>Monday – Sunday</p>
          <p>12:00 PM – 11:00 PM</p>
        </div>

          <div className="contact-note">
            <h3>Get in Touch</h3>
            <p >
            For reservations and quick enquiries, please call us directly for immediate assistance.<br></br>
For feedback, collaborations, or business-related queries, feel free to reach out via email.<br></br>
Our team will be happy to assist you and get back to you at the earliest.
          </p>
          </div>
          
        
      </div>

    </>
  )
}

export default Contact