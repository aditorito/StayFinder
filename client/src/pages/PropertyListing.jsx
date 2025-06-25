import { useRecoilState } from 'recoil';
import { availabilityAtom, descriptionAtom, fromAtom, hostIdAtom, imagesAtom, LatitudeAtom, locationAtom, LongitudeAtom, pricePerNightAtom, titleAtom, toAtom } from '../store/atoms/Register';
import { Navbar } from '../components/Navbar';
import { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
const backendUrl = import.meta.env.VITE_BACKEND_URL;


export const PropertyListing = () => {
  const navigate = useNavigate();

  const [Longitude, setLongitude] = useRecoilState(LongitudeAtom);
  const [Latitude, setLatitude] = useRecoilState(LatitudeAtom);
  const [from, setFrom] = useRecoilState(fromAtom);
  const [to, setTo] = useRecoilState(toAtom);
  const [title, settitle] = useRecoilState(titleAtom);
  const [description, setdescription] = useRecoilState(descriptionAtom);
  const [location, setlocation] = useRecoilState(locationAtom);
  const [pricePerNight, setpricePerNight] = useRecoilState(pricePerNightAtom);
  const [image, setImage] = useRecoilState(imagesAtom);
  const [availability, setAvailability] = useRecoilState(availabilityAtom);
  

  // Add local state for address
  const [address, setAddress] = useState('');

  const handleSubmit = async () => {
    // Create the location object
    const newLocation = {
      type: 'Point',
      coordinates: [Longitude, Latitude],
      address: address,
    };

    // Create the availability array
    const newAvailability = [{
      from: from,
      to: to
    }];

    // Update the atoms
    setlocation(newLocation);
    setAvailability(newAvailability);

    const yourToken = localStorage.getItem('token');
    const decoded = jwtDecode(yourToken);
    const hostId = decoded.userId;
    
    // Create the final object with current values
    const obj = {
      title,
      description,
      location: newLocation, // Use the new location object
      pricePerNight,
      image,
      hostId,
      availability: newAvailability // Use the new availability array
    };





    const response = await axios.post(`${backendUrl}/listings/`, {
      title:title,
      description:description,
      location:newLocation,
      pricePerNight:pricePerNight,
      images:image,
      hostId:hostId,
      availability:newAvailability
      
    }, {
      headers: {
        "Authorization": `${yourToken}`, // Add this
      },

    });

    if (response) {
      setImage([]);
      navigate('/home');

    }


  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">List Your Property</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Luxury Beach House"
              onChange={(e) => {
                settitle(e.target.value)
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Price per night (₹)</label>
            <input
              type="number"
              name="pricePerNight"
              placeholder="3500"
              onChange={(e) => {
                setpricePerNight(parseFloat(e.target.value))
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              placeholder="Describe your property..."
              rows="4"
              onChange={(e) => {
                setdescription(e.target.value)
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Candolim Beach, Goa"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Coordinates (Lng, Lat)</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="longitude"
                placeholder="Longitude"
                step="any"
                onChange={(e) => {
                  setLongitude(parseFloat(e.target.value) || 0)
                }}
                className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
              />
              <input
                type="number"
                name="latitude"
                placeholder="Latitude"
                step="any"
                onChange={(e) => {
                  setLatitude(parseFloat(e.target.value) || 0);
                }}
                className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Available From</label>
            <input
              type="date"
              name="from"
              onChange={(e) => {
                setFrom(e.target.value)
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Available To</label>
            <input
              type="date"
              name="to"
              onChange={(e) => {
                setTo(e.target.value)
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <ImageUploader />
        </div>

        <button
          className="mt-6 w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-medium transition"
          onClick={handleSubmit}
        >
          Submit Listing
        </button>
      </div>
    </>
  );
};