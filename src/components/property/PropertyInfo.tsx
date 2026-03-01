interface Amenity {
  icon: string;
  label: string;
}

interface Property {
  _id: string;
  title: string;
  description: string;
  type: string;
  price: {
    amount: number;
  };
  bedrooms: number;
  bathrooms: number;

  location?: {
    address?: string;
  };

  superBuiltupArea?: {
    value: number;
    unit: string;
  };

  amenities?: Amenity[];
}

interface Props {
  property: Property;
}

export default function PropertyInfo({ property }: Props) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow space-y-8">
      
      {/* Title + Price */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {property.title}
          </h1>

          <p className="flex items-center text-gray-500 mt-2">
            <i className="fa-solid fa-location-dot mr-2 text-blue-600"></i>
            {property.location?.address}
          </p>
        </div>

        <div className="text-2xl font-bold text-blue-600">
          ₹ {property.price?.amount?.toLocaleString()}
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-xl">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-bed text-blue-600 text-xl"></i>
          <span>{property.bedrooms} Beds</span>
        </div>

        <div className="flex items-center gap-3">
          <i className="fa-solid fa-bath text-blue-600 text-xl"></i>
          <span>{property.bathrooms} Baths</span>
        </div>

        <div className="flex items-center gap-3">
          <i className="fa-solid fa-ruler-combined text-blue-600 text-xl"></i>
          <span>
            {property.superBuiltupArea?.value} {property.superBuiltupArea?.unit}
          </span>
        </div>

        <div>
          <span className="font-semibold text-slate-700">
            Type:
          </span>{" "}
          {property.type}
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-bold mb-3">Description</h2>
        <p className="text-gray-600 leading-relaxed">
          {property.description}
        </p>
      </div>

      {/* Amenities */}
      {property.amenities && property.amenities.length > 0 && (
      <div>
        <h2 className="text-xl font-bold mb-4">Amenities</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {property.amenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg"
            >
              <i className={`fa ${amenity.icon} text-blue-600`} />
              <span>{amenity.label}</span>
            </div>
          ))}
        </div>
      </div>
    )}
    </div>
  );
}