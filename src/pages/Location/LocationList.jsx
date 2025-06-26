import React, { useState, useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { VscCircleFilled } from "react-icons/vsc";
import { Link } from 'react-router-dom';

const baseCategories = {
    "Banquet Halls": [
        'banquet hall in CITY', 'best banquet hall CITY', 'banquet hall near CITY Metro',
    ],
    "Hotels": [
        'best hotel in CITY', 'budget hotel CITY', 'business hotel CITY', 'hotel near CITY metro', 'luxury hotel CITY',
    ],
    "Farmhouses": [
        'farmhouse in CITY for events', 'wedding farmhouse CITY', 'poolside farmhouse CITY',
    ],
    "Wedding Planners": [
        'wedding planner CITY', 'best wedding planner CITY', 'affordable wedding planner CITY',
    ],
    "Photographers": [
        'wedding photographer in CITY', 'candid wedding photographer CITY', 'affordable wedding photographer CITY',
    ],
    "Makeup Artists": [
        'makeup artist in CITY', 'bridal makeup CITY', 'affordable makeup artist CITY', 'MUA CITY engagement',
    ]
};

const states = ['Noida', 'Delhi', 'Gurgaon', 'Ghaziabad', 'Greater Noida'];

const locationData = states.map((state) => {
    const categories = Object.entries(baseCategories).map(([category, items]) => ({
        category,
        items: items.map(item => item.replaceAll('CITY', state))
    }));
    return { state, categories };
});

const WeddingVendorsByLocation = () => {
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="px-4 md:px-10 lg:mx-10 py-8">
            <span className="lg:text-3xl md:text-3xl text-2xl mb-6 lg:mx-7 md:mx-7 text-gray-800">Wedding vendors by location</span>

            {isSmallScreen ? (
                <div className="mt-5">
                    {locationData.map((region, regionIdx) => (
                        <div key={regionIdx} className="mb-4">
                            <h6 className="font-semibold text-lg text-gray-800 mb-2">{region.state}</h6>
                            <Accordion>
                                {region.categories.map((cat, catIdx) => (
                                    <Accordion.Item eventKey={catIdx.toString()} key={catIdx}>
                                        <Accordion.Header>{cat.category}</Accordion.Header>
                                        <Accordion.Body>
                                            <ul className="space-y-1 text-sm">
                                                {cat.items.map((item, itemIdx) => (
                                                    <li
                                                        key={itemIdx}
                                                        style={{ marginLeft: '-30px' }}
                                                        className="cursor-pointer flex"
                                                    >
                                                        <VscCircleFilled className='mt-1 mr-1' />
                                                        <Link
                                                            to={`https://www.google.com/search?q=${encodeURIComponent(item)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ textDecoration: 'none' }}
                                                            className="text-black"
                                                        >
                                                            {item}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:mt-4">
                    {locationData.map((region, index) => (
                        <div key={index} className="lg:mt-5">
                            <h6 className="font-semibold text-lg text-gray-800 mb-2 lg:mx-8 md:mx-8">{region.state}</h6>
                            {region.categories.map((cat, catIdx) => (
                                <div key={catIdx} className="mb-4">
                                    <p className="font-semibold text-gray-700 mb-1 text-sm lg:mx-8 md:mx-8 mt-3">{cat.category}</p>
                                    <ul className="space-y-1 text-sm max-h-32 overflow-y-auto custom-scroll">
                                        {cat.items.map((item, itemIdx) => (
                                            <li key={itemIdx} className="cursor-pointer">
                                                <Link
                                                    to={`https://www.google.com/search?q=${encodeURIComponent(item)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ textDecoration: 'none' }}
                                                    className="text-black"
                                                >
                                                    {item}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WeddingVendorsByLocation;
