import React, { useState } from 'react';
import {
    FiCamera,
    FiChevronDown,
    FiEye,
    FiHeart,
    FiUser,
    FiCalendar,
    FiAward,
    FiUsers,
    FiStar,
    FiMail,
    FiPhone,
    FiMapPin,
    FiSend

} from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Photographers() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const categories = [
        { id: 'all', label: 'All Work' },
        { id: 'wedding', label: 'Weddings' },
        { id: 'portrait', label: 'Portraits' },
        { id: 'landscape', label: 'Landscape' },
        { id: 'event', label: 'Events' },
    ];

    const portfolioItems = [
        {
            id: 1,
            category: 'wedding',
            title: 'Sarah & John Wedding',
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=600&fit=crop',
        },
        {
            id: 2,
            category: 'portrait',
            title: 'Business Portraits',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop',
        },
        {
            id: 3,
            category: 'landscape',
            title: 'Mountain Vista',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=600&fit=crop',
        },
        {
            id: 4,
            category: 'event',
            title: 'Corporate Event',
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=600&fit=crop',
        },
        {
            id: 5,
            category: 'wedding',
            title: 'Beach Wedding',
            image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=500&h=600&fit=crop',
        },
        {
            id: 6,
            category: 'portrait',
            title: 'Family Session',
            image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&h=600&fit=crop',
        },
    ];

    const filteredItems =
        selectedCategory === 'all'
            ? portfolioItems
            : portfolioItems.filter((item) => item.category === selectedCategory);

    const services = [
        {
            icon: FiHeart,
            title: 'Wedding Photography',
            description:
                'Capture your special day with artistic storytelling and timeless elegance.',
            price: 'Starting at $2,500',
            features: ['8+ Hours Coverage', 'Engagement Session', '500+ Edited Photos', 'Online Gallery'],
        },
        {
            icon: FiUser,
            title: 'Portrait Sessions',
            description:
                'Professional headshots and personal portraits that showcase your personality.',
            price: 'Starting at $350',
            features: ['1-2 Hour Session', 'Multiple Outfits', '25+ Edited Photos', 'Print Release'],
        },
        {
            icon: FiCalendar,
            title: 'Event Photography',
            description:
                'Document your corporate events, parties, and special celebrations.',
            price: 'Starting at $800',
            features: ['4+ Hours Coverage', 'Same Day Preview', '200+ Edited Photos', 'Quick Turnaround'],
        },
        {
            icon: FiCamera,
            title: 'Commercial Work',
            description:
                'Professional product and brand photography for your business needs.',
            price: 'Custom Pricing',
            features: ['Creative Direction', 'High-Res Images', 'Commercial License', 'Retouching Included'],
        },
    ];

    const aboutStats = [
        { icon: FiUsers, number: '500+', label: 'Happy Clients' },
        { icon: FiAward, number: '50+', label: 'Awards Won' },
        { icon: FiStar, number: '5.0', label: 'Average Rating' },
    ];
    const contactInfo = [
        { icon: FiMail, title: 'Email', value: 'alex@lensvision.com', link: 'mailto:alex@lensvision.com' },
        { icon: FiPhone, title: 'Phone', value: '+1 (555) 123-4567', link: 'tel:+15551234567' },
        { icon: FiMapPin, title: 'Location', value: 'San Francisco, CA', link: '#' },
    ];

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div>
            {/* Hero Section */}
            <div
                id="home"
                className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/80 to-pink-900/70" />
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
                <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        Capturing Life&apos;s
                        <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Beautiful Moments
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
                        Professional photography services that tell your unique story through stunning visual narratives
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button style={{ borderRadius: '5px' }} className="bg-white text-gray-900 px-5 py-3 font-semibold hover:bg-gray-100 hover:scale-105 transition">
                            View Portolio
                        </button>
                        <button style={{ borderRadius: '5px' }} className="border-2  border-white px-5 py-3 font-semibold  hover:text-gray-900 transition">
                            Get In Touch
                        </button>
                    </div>
                </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white">
                    <FiChevronDown className="w-6 h-6" />
                </div>
            </div>

            {/* Portfolio Section */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Featured Work
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            A collection of our most cherished moments captured through the lens
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                style={{ borderRadius: '10px' }}
                                className={`px-6 py-3 font-medium transition-all ${selectedCategory === category.id
                                    ? 'bg-[#0F4C81] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/5] cursor-pointer"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <h3 className="text-white text-xl font-semibold mb-2">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center text-white/80">
                                            <FiEye className="w-4 h-4 mr-2" />
                                            <span>View Details</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="py-10 bg-gray-100">
                <div className=" mx-auto p-3">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Our Services
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Tailored photography solutions to meet your unique needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map(({ icon: Icon, title, description, price, features }) => (
                            <div
                                key={title}
                                className="bg-white p-6 rounded-2xl shadow-md flex flex-col"
                            >
                                <div className="bg-gray-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                    <Icon className="w-7 h-7 text-black" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                                <p className="text-gray-600 mb-4 flex-grow">{description}</p>
                                <div className="text-[#0a4d87] font-semibold mb-4">{price}</div>
                                <ul className="list-disc list-inside text-gray-600 mb-4">
                                    {features.map((feat) => (
                                        <li key={feat}>{feat}</li>
                                    ))}
                                </ul>
                                <button style={{ borderRadius: '5px' }} className="mt-auto bg-[#0F4C81] text-white px-6 py-3  hover:bg-blue-700 transition">
                                    Book Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* About Section */}
            <section id="about" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Image */}
                        <div className="relative">
                            <div className="relative z-10">
                                <img
                                    src="https://images.unsplash.com/photo-1556103255-4443dbae8e5a?w=600&h=700&fit=crop"
                                    alt="Photographer"
                                    className="rounded-2xl shadow-2xl"
                                />
                            </div>
                            <div className="absolute -bottom-6-right-6 w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl -z-10"></div>
                        </div>

                        {/* Content */}
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Meet Alex Johnson
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                With over 8 years of experience in photography, I specialize in capturing the authentic moments that tell your unique story. My passion for visual storytelling drives me to create images that not only look beautiful but also evoke genuine emotions.
                            </p>

                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Based in San Francisco, I work with clients worldwide to document their most precious moments. From intimate weddings to corporate events, I bring a creative eye and professional approach to every project.
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 mb-8">
                                {aboutStats.map(({ icon: Icon, number, label }, idx) => (
                                    <div key={idx} className="text-center">
                                        <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Icon className="w-8 h-8 text-black" />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">{number}</div>
                                        <div className="text-gray-600 font-medium">{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Let's Create Together</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Ready to capture your moments? Let’s talk.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-8">Get In Touch</h3>
                            <div className="space-y-6 mb-8">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center mr-4">
                                            <info.icon className="w-6 h-6 text-black" />
                                        </div>
                                        <div>
                                            <div className="text-gray-600 text-sm">{info.title}</div>
                                            <Link to={info.link} style={{ textDecoration: 'none' }} className="text-gray-900 font-semibold hover:text-[#0a4d87]">
                                                {info.value}
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                                <h4 className="text-xl font-bold mb-2">Quick Response Guarantee</h4>
                                <p className="text-blue-100">I usually respond within 24 hours. For urgent queries, call directly.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
                            <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl" />
                            <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-3  rounded-xl" />
                            <select name="service" required value={formData.service} onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-xl">
                                <option value="">Select a service</option>
                                <option value="wedding">Wedding Photography</option>
                                <option value="portrait">Portrait Session</option>
                                <option value="event">Event Photography</option>
                                <option value="commercial">Commercial Work</option>
                            </select>
                            <textarea name="message" rows={5} placeholder="Message..." required value={formData.message} onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-xl resize-none" />
                            <button type="submit"
                                style={{ borderRadius: '5px' }}
                                className="w-full bg-[#0a4d87] text-white py-3  flex items-center justify-center hover:bg-blue-700 transition">
                                <FiSend className="mr-2" /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}

