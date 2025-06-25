// PropertyDetails.jsx
import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { App } from '../components/AvailabilityDatePicker';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom"

import axios from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { checkInAtom, checkOutAtom, guestAtom, propertAtom, totalPriceAtom } from '../store/atoms/Booking';
import { isLoggedInAtom } from '../store/atoms/Auth';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


export const PropertyDetails = ({ propertyId }) => {
  const { id } = useParams();
  const navigate = useNavigate(); // Add this import: import { useNavigate, useParams } from 'react-router-dom';
  
  // Consolidated guest state management
  const [guestCounts, setGuestCounts] = useRecoilState(guestAtom);

  const updateGuestCount = (type, delta) => {
    setGuestCounts((prev) => {
      const updated = { ...prev, [type]: Math.max(0, prev[type] + delta) };
      // Ensure at least 1 adult
      if (type === 'adults' && updated.adults === 0) {
        updated.adults = 1;
      }
      return updated;
    });
  };

  const totalGuests = guestCounts.adults + guestCounts.children + guestCounts.infants;

  const [property, setProperty] = useRecoilState(propertAtom);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const setTotalPrice = useSetRecoilState(totalPriceAtom)
  const checkIn = useRecoilValue(checkInAtom);
  const checkOut = useRecoilValue(checkOutAtom);
  const [showBooking, setShowBooking] = useState(false);
  const isLogged = useRecoilValue(isLoggedInAtom);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const yourToken = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/listings/${id}`, {
          headers: {
            "Authorization": `${yourToken}`,
          },
        });
        setProperty(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property:', error);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const Price = calculateNights() * (property?.pricePerNight || 0);
  const serviceFee = Math.round(Price * 0.1);
  const finalTotal = Price + serviceFee;
  setTotalPrice(finalTotal)

  // Handle booking confirmation and navigation to payment
  const handleBookingConfirmation = () => {
    // Create booking data to pass to payment page
    const bookingData = {
      userId:id,
      propertyId: property._id,
      propertyTitle: property.title,
      checkIn,
      checkOut,
      guests: guestCounts,
      finalTotal,
    };

    // Store booking data in localStorage or state management
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    // Navigate to payment page
    navigate('/payment', { state: { bookingData } });
  };

  // Handle Reserve Now button click
  const handleReserveNow = () => {
    if (!isLogged) {
      navigate('/login')
      
    }
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    if (totalGuests === 0) {
      alert('Please select at least one guest');
      return;
    }

    setShowBooking(true);
  };

  // Default amenities based on property description
  const getDefaultAmenities = () => {
    const amenities = ["Private Pool", "Beach Access", "WiFi", "Air Conditioning"];
    if (property?.description?.toLowerCase().includes('chef')) {
      amenities.push("Chef Service");
    }
    if (property?.description?.toLowerCase().includes('beachfront')) {
      amenities.push("Beachfront Location");
    }
    return amenities;
  };

  // Fallback images if only one image is provided
  const getPropertyImages = () => {
    if (!property?.images || property.images.length === 0) {
      return ["https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"];
    }

    // If only one image, add some fallback images for gallery effect
    if (property.images.length === 1) {
      return [
        property.images[0],
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      ];
    }

    return property.images;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h2>
            <p className="text-gray-600">The property you're looking for doesn't exist.</p>
          </div>
        </div>
      </>
    );
  }

  const propertyImages = getPropertyImages();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to HomePage
          </button>
        </div>

        {/* Image Gallery */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Main Image */}
            <div className="relative">
              <img
                src={propertyImages[selectedImage]}
                alt={property.title}
                className="w-full h-96 md:h-[500px] object-cover rounded-xl"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                }}
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-2 gap-4">
              {propertyImages.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${property.title} ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                  }}
                  className={`w-full h-36 md:h-60 object-cover rounded-xl cursor-pointer transition ${selectedImage === index ? 'ring-4 ring-rose-500' : 'hover:opacity-80'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Property Info */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title and Location */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">4.8</span>
                    <span className="ml-1">(New listing)</span>
                  </div>
                  <span>•</span>
                  <span>📍 {property.location.address}</span>
                </div>
              </div>

              {/* Property Stats */}
              <div className="border-b border-gray-200 pb-6 mb-8">
                <div className="flex items-center gap-6 text-gray-600">
                  <span>🏠 Entire villa</span>
                  <span>👥 Up to 8 guests</span>
                  <span>🛏️ 4 bedrooms</span>
                  <span>🚿 3 bathrooms</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">About this property</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  This stunning villa offers breathtaking ocean views, luxurious amenities, and world-class service.
                  Perfect for families, couples, or groups looking for an unforgettable vacation experience.
                  The property features spacious bedrooms, a fully equipped kitchen, private beach access, and premium facilities.
                </p>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">What this place offers</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {getDefaultAmenities().map((amenity, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <span className="mr-3">
                        {amenity.includes('Pool') && '🏊‍♂️'}
                        {amenity.includes('Beach') && '🏖️'}
                        {amenity.includes('WiFi') && '📶'}
                        {amenity.includes('Air') && '❄️'}
                        {amenity.includes('Chef') && '👨‍🍳'}
                        {amenity.includes('Beachfront') && '🌊'}
                        {!amenity.includes('Pool') && !amenity.includes('Beach') && !amenity.includes('WiFi') && !amenity.includes('Air') && !amenity.includes('Chef') && !amenity.includes('Beachfront') && '✨'}
                      </span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Availability</h2>
                <div className="space-y-2">
                  {property.availability.map((period, index) => (
                    <div key={period._id || index} className="flex items-center text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Available from {formatDate(period.from)} to {formatDate(period.to)}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold text-gray-800">
                      {formatPrice(property.pricePerNight)}
                    </span>
                    <span className="text-gray-600 ml-1">per night</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">4.8</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <App 
                    availability={property.availability}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guests ({totalGuests} guest{totalGuests !== 1 ? 's' : ''})
                    </label>
                    <div className="space-y-2 text-gray-700">
                      {['adults', 'children', 'infants'].map((type) => {
                        const labelMap = {
                          adults: 'Adults (Age 13+)',
                          children: 'Children (Ages 2–12)',
                          infants: 'Infants (Under 2)',
                        };
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <div className="text-sm">{labelMap[type]}</div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateGuestCount(type, -1)}
                                disabled={type === 'adults' ? guestCounts[type] <= 1 : guestCounts[type] === 0}
                                className={`w-8 h-8 flex items-center justify-center rounded-full border ${(type === 'adults' ? guestCounts[type] <= 1 : guestCounts[type] === 0)
                                    ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                                    : 'text-gray-700 border-gray-400 hover:bg-gray-100'
                                  }`}
                              >
                                −
                              </button>
                              <span className="w-5 text-center">{guestCounts[type]}</span>
                              <button
                                type="button"
                                onClick={() => updateGuestCount(type, 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full border text-gray-700 border-gray-400 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {checkIn && checkOut && (
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span>
                        {formatPrice(property.pricePerNight)} × {calculateNights()} nights
                      </span>
                      <span>{formatPrice(Price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>{formatPrice(serviceFee)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-2 border-t">
                      <span>Total</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleReserveNow}
                  disabled={!checkIn || !checkOut}
                  className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {checkIn && checkOut ? 'Reserve Now' : 'Select dates'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-2">
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Confirmation Modal */}
        {showBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Booking Confirmation</h3>
              <div className="space-y-2 mb-6">
                <p><strong>Property:</strong> {property.title}</p>
                <p><strong>Check-in:</strong> {formatDate(checkIn)}</p>
                <p><strong>Check-out:</strong> {formatDate(checkOut)}</p>
                <p><strong>Guests:</strong> {totalGuests} ({guestCounts.adults} adults, {guestCounts.children} children, {guestCounts.infants} infants)</p>
                <p><strong>Nights:</strong> {calculateNights()}</p>
                <div className="border-t pt-2">
                  <p><strong>Subtotal:</strong> {formatPrice(Price)}</p>
                  <p><strong>Service fee:</strong> {formatPrice(serviceFee)}</p>
                  <p className="text-lg"><strong>Total:</strong> {formatPrice(finalTotal)}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowBooking(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookingConfirmation}
                  className="flex-1 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};