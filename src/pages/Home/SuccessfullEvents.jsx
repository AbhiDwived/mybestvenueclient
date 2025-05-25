import { useState, useEffect } from 'react';
import { FaStar, FaArrowLeft, FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import CoEvent from '../../assets/newPics/CoEvent.avif';
import CoEvent2 from '../../assets/newPics/CoEvent2.avif';
import CoEvent3 from '../../assets/newPics/CoEvent3.avif';

const events = [
    {
        id: '1',
        title: 'Corporate Annual Conference',
        location: 'Delhi, Grand Hyatt',
        date: 'March 15, 2025',
        image: CoEvent,
        rating: 4.8,
        attendees: 450
    },
    {
        id: '2',
        title: 'Tech Startup Summit',
        location: 'Mumbai, Taj Hotels',
        date: 'January 22, 2025',
        image: CoEvent2,
        rating: 4.7,
        attendees: 320
    },
    {
        id: '3',
        title: 'Luxury Wedding Reception',
        location: 'Jaipur, Royal Palace',
        date: 'December 10, 2024',
        image: CoEvent3,
        rating: 5.0,
        attendees: 280
    },
];

const SuccessfullEvents = () => {
    const [startIndex, setStartIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(3);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsSmallScreen(width < 640);
            if (width < 640) setVisibleCount(1);
            else if (width < 1024) setVisibleCount(2);
            else setVisibleCount(3);
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePrev = () => {
        setStartIndex((prevIndex) =>
            prevIndex === 0 ? events.length - visibleCount : prevIndex - 1
        );
    };

    const handleNext = () => {
        setStartIndex((prevIndex) =>
            prevIndex + visibleCount >= events.length ? 0 : prevIndex + 1
        );
    };

    const visibleEvents = events.slice(startIndex, startIndex + visibleCount);

    return (
        <section className="py-16 bg-gray-100">
            <div className="mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 font-playfair-display">
                        Previous Successful Events
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Take a look at some of our most successful events that we've helped organize at our partnered venues.
                    </p>
                </div>

                <div className="relative flex items-center sm:px-6 lg:px-8">
                    {/* Left Arrow - show only on small screens */}
                    {isSmallScreen && (
                        <button
                            onClick={handlePrev}
                            style={{ borderRadius: '25px' }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                        >
                            <FaArrowLeft className="w-4 h-4" />
                        </button>
                    )}

                    {/* Cards Container */}
                    <div className="flex p-3 w-full gap-4 justify-center overflow-hidden transition-all duration-500 ease-in-out">
                        {visibleEvents.map((event) => (
                            <div
                                key={event.id}
                                className="w-full max-w-md bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0 border border-gray-100"
                            >
                                <div className="relative h-56 w-full overflow-hidden">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <h3 className="text-xl font-semibold text-white font-playfair-display">
                                            {event.title}
                                        </h3>
                                        <p className="text-white/90 text-sm">{event.location}</p>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center text-[#0F4C81]">
                                            <FaCalendarAlt className="h-4 w-4 mr-1" />
                                            <span className="text-md text-[#0F4C81]">{event.date}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaStar className="h-4 w-4 text-yellow-500 mr-1" />
                                            <span className="text-sm font-semibold">{event.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Successful event with {event.attendees} attendees
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow - show only on small screens */}
                    {isSmallScreen && (
                        <button
                            onClick={handleNext}
                            style={{ borderRadius: '25px' }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                        >
                            <FaArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SuccessfullEvents;
