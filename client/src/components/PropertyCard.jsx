import { Link } from "react-router-dom";
// PropertyCard.jsx

export const PropertyCard = ({ property }) => {
  // Format price with Indian currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format date for availability
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get the first image or a placeholder
  const getImageUrl = () => {
    return property.images && property.images.length > 0 
      ? property.images[0] 
      : 'https://via.placeholder.com/400x250?text=No+Image';
  };

  // Get next available period
  const getNextAvailability = () => {
    if (property.availability && property.availability.length > 0) {
      const nextAvailable = property.availability[0];
      return `${formatDate(nextAvailable.from)} - ${formatDate(nextAvailable.to)}`;
    }
    return 'Availability not specified';
  };

  return (
    <Link to={`/listing/${property._id}`}>
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl()}
          alt={property.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x250?text=Image+Not+Found';
          }}
        />
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full">
          <span className="text-sm font-semibold text-gray-800">
            {formatPrice(property.pricePerNight)}/night
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {property.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          📍 {property.location.address}
        </p>
        

        {/* Availability */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Next Available:</p>
          <p className="text-sm text-green-600 font-medium">
            {getNextAvailability()}
          </p>
        </div>

        {/* Images count */}
        {property.images && property.images.length > 1 && (
          <div className="flex items-center text-xs text-gray-500">
            <span>📷 {property.images.length} photos</span>
          </div>
        )}
      </div>
    </div>
    </Link>
  );
};