// Home.jsx
import React, { useState, useEffect } from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { Navbar } from '../components/Navbar';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { isHostAtom} from '../store/atoms/Auth';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


export const HomePage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Simulate API call  
        console.log(backendUrl);
              
        const fetchProperties = async () => {
            console.log();
            
            try {
                setLoading(true);
                const yourToken = localStorage.getItem('token');
                const response = await axios.get(`${backendUrl}/listings/`, {

                    headers: {
                        "Authorization": `${yourToken}`, // Add this
                    }
                });
                console.log(response);
                setTimeout(() => {
                    setProperties(response.data.data);
                    setLoading(false);
                }, 1000);

            } catch (err) {
                setError('Failed to fetch properties');
                setLoading(false);
                console.error('Error fetching properties:', err);
            }
        };

        fetchProperties();
    }, []);

    // Filter properties based on search term
    const filteredProperties = properties.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading properties...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Find Your Perfect Stay
                        </h1>
                        <p className="text-xl mb-8 opacity-90">
                            Discover amazing places to stay around the world
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by location, title, or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-6 py-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/80 text-lg focus:outline-none focus:ring-4 focus:ring-white/30 focus:bg-white/30 transition-all duration-300"
                                />
                                <div className="absolute right-2 top-2">
                                    <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-2 rounded-full hover:bg-white/30 transition-all duration-300">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Properties Section */}
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                            {filteredProperties.length} Properties Available
                        </h2>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-rose-500 hover:text-rose-600 font-medium"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>

                    {filteredProperties.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🏠</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No properties found
                            </h3>
                            <p className="text-gray-500">
                                {searchTerm
                                    ? "Try adjusting your search terms"
                                    : "Check back later for new listings"
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProperties.map((property) => (
                                <PropertyCard key={property._id} property={property} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};