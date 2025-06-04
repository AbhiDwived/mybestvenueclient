// About.tsx
import { useState } from "react";
import { Calendar, Mail, MessageSquare, Phone, Play, Camera, Heart, Star, Film } from "lucide-react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";


const About = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        eventDate: "",
        location: "",
        message: "",
    });
    const [activeFilter, setActiveFilter] = useState("all");
    const portfolioItems = [
        {
            id: 1,
            title: "Sarah & Michael",
            location: "Napa Valley",
            category: "ceremony",
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "Emma & James",
            location: "Tuscany",
            category: "destination",
            image: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            title: "Lisa & David",
            location: "Manhattan",
            category: "reception",
            image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 4,
            title: "Anna & Chris",
            location: "Santorini",
            category: "destination",
            image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 5,
            title: "Rachel & Tom",
            location: "California",
            category: "ceremony",
            image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 6,
            title: "Sophie & Mark",
            location: "Paris",
            category: "reception",
            image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    const filters = [
        { key: "all", label: "All Films" },
        { key: "ceremony", label: "Ceremonies" },
        { key: "reception", label: "Receptions" },
        { key: "destination", label: "Destination" }
    ];

    const filteredItems = activeFilter === "all"
        ? portfolioItems
        : portfolioItems.filter(item => item.category === activeFilter);


    <ToastContainer position="top-right" autoClose={3000} pauseOnHover closeOnClick />
    const services = [
        {
            icon: <Camera className="w-8 h-8" />,
            title: "Full Wedding Coverage",
            description: "Complete ceremony and reception filming with multiple camera angles and professional audio recording.",
            features: ["6-8 hours of coverage", "Multiple camera operators", "Professional audio", "Drone footage included"],
            price: "Starting at $2,500"
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Highlight Reel",
            description: "A beautifully edited 3-5 minute highlight film that captures the essence of your special day.",
            features: ["Cinematic editing", "Licensed music selection", "Color grading", "Delivery within 4 weeks"],
            price: "Starting at $1,800"
        },
        {
            icon: <Film className="w-8 h-8" />,
            title: "Premium Package",
            description: "Our most comprehensive package including both full coverage and a custom highlight film.",
            features: ["8-10 hours of coverage", "Engagement session", "Custom highlight film", "Raw footage included"],
            price: "Starting at $3,500"
        },
        {
            icon: <Star className="w-8 h-8" />,
            title: "À La Carte",
            description: "Additional services that can be added to any package to customize your perfect wedding film.",
            features: ["Drone footage", "Same day edit", "Custom albums", "Additional hours"],
            price: "Customizable"
        }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        toast({
            title: "Message sent!",
            description: "We'll get back to you as soon as possible.",
        });
        setFormData({
            name: "",
            email: "",
            phone: "",
            eventDate: "",
            location: "",
            message: "",
        });
    };

    return (
        <>
            {/* HEADER */}
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Background Video Placeholder */}
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(15,76,129,0.2)] to-[rgba(15,76,129,0.2)]"></div>

                {/* Animated Background Elements */}
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#0F4C81] rounded-full animate-pulse"></div>
                    <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-[#0F4C81] rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-3/4 w-2.5 h-2.5 bg-[#0F4C81] rounded-full animate-pulse delay-500"></div>
                </div>


                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <div className="mb-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                        <Heart className="w-4 h-4 text-white" />
                        <span className="text-white/90 text-sm font-medium">Capturing Love Stories</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Timeless
                        <span className="block bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
                            Wedding Films
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                        We create cinematic wedding films that tell your unique love story with elegance, emotion, and artistry.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            size="lg"
                            style={{ borderRadius: '5px' }}
                            className="bg-gradient-to-r from-[#0F4C81] to-[#0f4c81c9] hover:from-[#1a62a2] hover:to-[#0F4C81] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            View Our Portfolio
                        </button>

                        <button
                            variant="outline"
                            size="lg"
                            style={{ borderRadius: '5px' }}
                            className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm"
                        >
                            <Play className="w-5 h-5 mr-2" />
                            Watch Demo Reel
                        </button>
                    </div>
                </div>

            </div>
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Our Portfolio
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Every wedding is unique. Here are some of our favorite love stories we've had the honor to capture.
                        </p>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {filters.map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setActiveFilter(filter.key)}
                                style={{ borderRadius: '5px' }}
                                className={`px-6 py-3 font-medium transition-all duration-300 ${activeFilter === filter.key
                                    ? "bg-[#0F4C81] text-white shadow-lg"
                                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Portfolio Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                            >
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                                        <p className="text-gray-200">{item.location}</p>
                                    </div>
                                </div>

                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40">
                                        <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Services */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Our Services
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Crafting cinematic wedding films tailored to your unique love story.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 rounded-2xl">
                                <div className="p-8">
                                    <div className="mb-6 inline-block p-4 bg-gray-100 rounded-2xl text-black">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                                    <p className="text-gray-600 mb-6">{service.description}</p>

                                    <div className="mb-6">
                                        <ul className="space-y-2">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center">
                                                    <span className="flex-shrink-0 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                                        <span className="w-2 h-2 bg-[#0F4C81] rounded-full"></span>
                                                    </span>
                                                    <span className="text-gray-700">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="text-xl font-semibold text-gray-900">{service.price}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* About Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative">
                            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src="https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=800&q=80"
                                    alt="Wedding Videographer"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute top-12 -left-8 w-24 h-24 bg- rounded-full -z-10"></div>
                            <div className="absolute -bottom-6 right-12 w-32 h-32 bg-[#0f4c81c9] rounded-full -z-10"></div>
                            <div className="absolute -right-6 top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-xl p-6 z-20">
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900">250+</div>
                                        <div className="text-sm text-gray-600">Weddings Filmed</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900">12</div>
                                        <div className="text-sm text-gray-600">Years Experience</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-[#0f4c81c9]">5.0</div>
                                        <div className="text-sm text-gray-600">Star Rating</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="mb-6 inline-block px-4 py-2 bg-[#0F4C81] rounded-full">
                                <span className="text-white font-medium">About Us</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Telling Love Stories Through Cinematic Filmmaking
                            </h2>
                            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                                At Timeless Wedding Films, we're passionate about capturing authentic moments that tell the unique story of your love.
                            </p>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Our team uses cinematic techniques to ensure every heartfelt moment is beautifully preserved in a way that feels authentic to you.
                            </p>
                            <div className="flex flex-wrap gap-6">
                                <button style={{ borderRadius: '5px' }} className="bg-[#0F4C81] hover:bg-[#0f4c81c9] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300">
                                    Meet The Team
                                </button>
                                <button style={{ borderRadius: '5px' }} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-all duration-300">
                                    Our Process
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-5">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-300 rounded-full"></div>
                    <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-amber-300 rounded-full"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get In Touch</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Ready to capture your love story? Contact us to check availability for your special day.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="John Doe"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="you@example.com"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="(123) 456-7890"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="eventDate" className="text-sm font-medium text-gray-700">Event Date</label>
                                        <input
                                            type="date"
                                            name="eventDate"
                                            id="eventDate"
                                            value={formData.eventDate}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="location" className="text-sm font-medium text-gray-700">Wedding Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        id="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="City, State or Venue"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-gray-700">Your Message</label>
                                    <textarea
                                        name="message"
                                        id="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us about your wedding plans..."
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    style={{ borderRadius: '5px' }}
                                    className="w-full bg-[#0F4C81] hover:bg-rose-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Info Column */}
                        <div className="lg:pl-12 space-y-8">
                            {/* Contact details with icons */}
                            {[{
                                Icon: Phone, title: "Phone", detail: "(123) 456-7890", subtext: "Mon-Fri 9am-6pm"
                            }, {
                                Icon: Mail, title: "Email", detail: "info@timelessweddingfilms.com", subtext: "We'll respond within 24 hours"
                            }, {
                                Icon: MessageSquare, title: "Social Media", custom: true
                            }, {
                                Icon: Calendar, title: "Availability", detail: "Now booking for 2025-2026", subtext: "Limited dates available for 2024"
                            }].map((item, i) => (
                                <div key={i} className="flex items-start">
                                    <div className="flex-shrink-0 bg-gray-100 p-3">
                                        <item.Icon className="w-6 h-6 text-black" />
                                    </div>
                                    <div className="ml-5">
                                        <h4 className="text-lg font-medium text-gray-900">{item.title}</h4>
                                        {item.custom ? (
                                            <div className="flex space-x-4 mt-2">
                                                {/* Replace # with actual links */}
                                                <Link to="#" style={{ textDecoration: 'none', borderRadius: '50px' }} className=" px-3 py-2 text-black bg-gray-100 hover:text-white">FB</Link>
                                                <Link to="#" style={{ textDecoration: 'none', borderRadius: '50px' }} className=" px-3 py-2 text-black bg-gray-100 hover:text-white">IG</Link>
                                                <Link to="#" style={{ textDecoration: 'none', borderRadius: '50px' }} className=" px-3 py-2 text-black bg-gray-100 hover:text-white">YT</Link>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-gray-600">{item.detail}</p>
                                                <p className="text-gray-500 text-sm">{item.subtext}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default About;
