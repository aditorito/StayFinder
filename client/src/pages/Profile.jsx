import React, { useEffect, useState } from 'react';
import { User, MapPin, Calendar, Users, Home, BookOpen, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


// Sample data - replace with your actual data
const sampleData = {
    message: "Fetched user details",
    data: {
        "_id": "684ebd2e273d2d7357c31df3",
        "name": "Aditya Pratap",
        "email": "aditya@example.com",
        "password": "strongPass123",
        "role": "host",
        "createdAt": "2025-06-15T12:31:42.084Z",
        "updatedAt": "2025-06-15T12:31:42.084Z",
        "__v": 0
    },
    bookings: [
        {
            "_id": "68515858260135437c26e9b6",
            "userId": "684ebd2e273d2d7357c31df3",
            "listingId": "685157cb260135437c26e9ac",
            "checkIn": "2025-07-20T00:00:00.000Z",
            "checkOut": "2025-07-31T00:00:00.000Z",
            "guests": {
                "adults": 2,
                "childrens": 1,
                "_id": "68515858260135437c26e9b7"
            },
            "totalPrice": 17500,
            "status": "confirmed",
            "createdAt": "2025-06-17T11:58:16.145Z",
            "updatedAt": "2025-06-17T11:58:16.145Z",
            "__v": 0
        }
    ],
    listedProperty: [
        {
            "_id": "68559b69f384989b541e9aa8",
            "title": "Luxury Beach House",
            "description": "Beautiful beachfront property with stunning ocean views and modern amenities",
            "location": {
                "type": "Point",
                "coordinates": [45, 56],
                "address": "123 Ocean Drive, Miami Beach",
                "_id": "68559b69f384989b541e9aa9"
            },
            "pricePerNight": 3500,
            "images": [
                "https://res.cloudinary.com/dgawgfh4e/image/upload/v1750440800/s9kyirdnxt3xyjcdxdsd.png"
            ],
            "hostId": "684ebd2e273d2d7357c31df3",
            "availability": [
                {
                    "from": "2025-06-19T00:00:00.000Z",
                    "to": "2025-06-25T00:00:00.000Z",
                    "_id": "68559b69f384989b541e9aaa"
                }
            ],
            "__v": 0
        }
    ]
};

// Listed Property Component
const ListedPropertyCard = ({ property }) => {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="relative h-48">
                <img
                    src={property.images?.[0] || "/api/placeholder/400/200"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg text-sm font-semibold text-gray-700">
                    ₹{property.pricePerNight}/night
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{property.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>

                <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.location?.address}</span>
                </div>

                {property.availability?.length > 0 && (
                    <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                            Available: {formatDate(property.availability[0].from)} - {formatDate(property.availability[0].to)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

// Booking Component
const BookingCard = ({ booking }) => {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                    <BookOpen className="w-5 h-5 text-pink-500 mr-2" />
                    <span className="font-semibold text-gray-900">Booking #{booking._id.slice(-6)}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                    <div className="flex items-center text-gray-500 text-sm mb-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Check-in</span>
                    </div>
                    <p className="font-medium text-gray-900">{formatDate(booking.checkIn)}</p>
                </div>
                <div>
                    <div className="flex items-center text-gray-500 text-sm mb-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Check-out</span>
                    </div>
                    <p className="font-medium text-gray-900">{formatDate(booking.checkOut)}</p>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-500 text-sm">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{booking.guests?.adults || 0} Adults, {booking.guests?.childrens || 0} Children</span>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹{booking.totalPrice?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Price</p>
                </div>
            </div>
        </div>
    );
};


export const Profile = () => {
    const [userData, setUserData] = useState(sampleData);
    useEffect(() => {
        const fetchProile = async () => {
            const yourToken = localStorage.getItem('token');
            const response = await axios.get(`${backendUrl}/users/profile`, {
                headers: {
                    Authorization: yourToken
                }
            })

            const data = response.data

            console.log("this is the data");
            setUserData(data)

            console.log(userData);



        }
        fetchProile();
    }, [])

    return (
        <ProfileComponent userData={userData} />
    )

}
// Main Profile Component
const ProfileComponent = ({ userData = sampleData }) => {



    const [activeTab, setActiveTab] = useState('overview');
    const [showPassword, setShowPassword] = useState(false);

    const { data: user, bookings = [], listedProperty = [] } = userData;

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Navbar />

            {/* Profile Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* User Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                                <p className="text-gray-600">{user?.email}</p>
                                <div className="flex items-center mt-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user?.role === 'host' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user?.role}
                                    </span>
                                    <span className="ml-3 text-sm text-gray-500">
                                        Member since {formatDate(user?.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm text-gray-500">Password:</span>
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-pink-500 hover:text-pink-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="font-mono text-sm bg-yellow-50 px-3 py-1 rounded border">
                                {showPassword ? user?.password : '••••••••••••'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'overview'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Overview
                    </button>
                    {bookings.length > 0 && (
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'bookings'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            My Bookings ({bookings.length})
                        </button>
                    )}
                    {listedProperty.length > 0 && (
                        <button
                            onClick={() => setActiveTab('properties')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'properties'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            My Properties ({listedProperty.length})
                        </button>
                    )}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Stats Cards */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Bookings</p>
                                    <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                                </div>
                                <BookOpen className="w-8 h-8 text-pink-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Listed Properties</p>
                                    <p className="text-2xl font-bold text-gray-900">{listedProperty.length}</p>
                                </div>
                                <Home className="w-8 h-8 text-pink-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Earnings</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ₹{bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 font-bold">₹</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'bookings' && bookings.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {bookings.map((booking) => (
                            <BookingCard key={booking._id} booking={booking} />
                        ))}
                    </div>
                )}

                {activeTab === 'properties' && listedProperty.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listedProperty.map((property) => (
                            <ListedPropertyCard key={property._id} property={property} />
                        ))}
                    </div>
                )}

                {/* Empty States */}
                {activeTab === 'bookings' && bookings.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                        <p className="text-gray-500">Start exploring properties to make your first booking!</p>
                    </div>
                )}

                {activeTab === 'properties' && listedProperty.length === 0 && (
                    <div className="text-center py-12">
                        <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No properties listed</h3>
                        <p className="text-gray-500">List your first property to start earning!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

