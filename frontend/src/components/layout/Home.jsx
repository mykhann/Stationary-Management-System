import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import HeroSection from './HeroSection'
import FooterSection from './FooterSection'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const {user}=useSelector(store=>store.auth)
  const navigate=useNavigate()

  
  return (
    <div>
       
        <HeroSection/>
       
    </div>
  )
}

export default Home