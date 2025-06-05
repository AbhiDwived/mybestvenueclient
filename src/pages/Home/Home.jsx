import React from 'react';
import { useState } from 'react';
import DiscoverCategories from '../Home/DiscoverCategories';
import VendorByCategory from '../Home/VendorByCategory';
import ProjectList from '../Home/ProjectList';
import SuccessfulEvents from '../Home/SuccessfullEvents';
import Testimonials from '../Home/Tesstimonials';
import HowItWorks from '../Home/HowItWorks';
import FeaturedVendors from '../Home/FeatureVendors';


export default function Home() {
  const [location, setLocation] = useState('All India');
  return (
    <div >
      
      <DiscoverCategories />
      <VendorByCategory location={location}/>
      <ProjectList />
      <FeaturedVendors/>
      <SuccessfulEvents />
      <Testimonials />
      <HowItWorks />
    </div>
  )
}
