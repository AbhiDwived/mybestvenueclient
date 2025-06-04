import React from 'react';
import DiscoverCategories from '../Home/DiscoverCategories';
import VendorByCategory from '../Home/VendorByCategory';
import ProjectList from '../Home/ProjectList';
import SuccessfulEvents from '../Home/SuccessfullEvents';
import Testimonials from '../Home/Tesstimonials';
import HowItWorks from '../Home/HowItWorks';
import FeaturedVendors from '../Home/FeatureVendors';

export default function Home() {
  return (
    <div >
      <DiscoverCategories />
      <VendorByCategory />
      <ProjectList />
      <FeaturedVendors/>
      <SuccessfulEvents />
      <Testimonials />
      <HowItWorks />
    </div>
  )
}
