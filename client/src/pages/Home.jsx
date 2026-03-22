import React from 'react'

import Hero from '../components/Hero'
import Category from '../components/category'
import FeaturedItems from '../components/FeaturedItems'
import HowItWorks from '../components/HowItWorks'
import AboutUs from '../components/AboutUs'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
      <Hero></Hero>
      <Category></Category>
      <FeaturedItems></FeaturedItems>
      <HowItWorks></HowItWorks>
      <AboutUs></AboutUs>
      <Footer></Footer>
    </>
  )
}

export default Home