import React from 'react';
import { useState } from 'react';
import DiscoverCategories from '../Home/DiscoverCategories';
import VendorByCategory from '../Home/VendorByCategory';
import ProjectList from '../Home/ProjectList';
import SuccessfulEvents from '../Home/SuccessfullEvents';
import Testimonials from '../Home/Tesstimonials';
import HowItWorks from '../Home/HowItWorks';
import FeaturedVendors from '../Home/FeatureVendors';
import WeddingVenuesByLocation from '../Home/WeddingVenuesByLocation';
import WeddingVendorsByLocation from '../Home/WeddingVendorsByLocation';
import LocationList from '../Location/LocationList';
import LatestBlogs from '../Home/LatestBlogs';


export default function Home() {
  return (
    <div >
      <DiscoverCategories />
      <WeddingVenuesByLocation />
      <WeddingVendorsByLocation />
      <VendorByCategory />
      <ProjectList />
      <FeaturedVendors/>
      <LatestBlogs />
      <SuccessfulEvents />
      <Testimonials />
      <HowItWorks />
      <LocationList/>
    </div>
  )
}
