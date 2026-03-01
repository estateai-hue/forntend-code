import React from "react";

const commercialAmenities = [
  { icon: "fa-utensils", label: "Cafeteria/Food Court" },
  { icon: "fa-bolt", label: "Power Back Up" },
  { icon: "fa-elevator", label: "Lift" },
  { icon: "fa-shield-halved", label: "Security" },
  { icon: "fa-square-parking", label: "Reserved Parking" },
  { icon: "fa-truck-ramp-box", label: "Service/Goods Lift" },
  { icon: "fa-car", label: "Visitor Parking" },
  { icon: "fa-user-gear", label: "Maintenance Staff" },
  { icon: "fa-droplet", label: "Rain Water Harvesting" },
  { icon: "fa-water", label: "Water Storage" },
  { icon: "fa-compass", label: "Vaastu Compliant" },
  { icon: "fa-fingerprint", label: "Fingerprint Access" },
  { icon: "fa-building-shield", label: "Earthquake Resistant" },
  { icon: "fa-shield", label: "3 Tier Security System" },
  { icon: "fa-tree-city", label: "Large Open Space" },
  { icon: "fa-archway", label: "Grand Entrance Lobby" },
  { icon: "fa-people-group", label: "Multipurpose Hall" },
  { icon: "fa-concierge-bell", label: "Concierge Services" },
  { icon: "fa-fire-extinguisher", label: "Fire Fighting Equipment" },
];

const residentialAmenities = [
  { icon: "fa-swimming-pool", label: "Swimming Pool" },
  { icon: "fa-dumbbell", label: "Gymnasium" },
  { icon: "fa-champagne-glasses", label: "Banquet Hall" },
  { icon: "fa-person-running", label: "Jogging Track" },
  { icon: "fa-child", label: "Kids Play Area" },
  { icon: "fa-tree", label: "Curated Garden" },
  { icon: "fa-heart-pulse", label: "Aerobics Room" },
  { icon: "fa-table-tennis-paddle-ball", label: "Indoor Games Room" },
  { icon: "fa-basketball", label: "Multipurpose Courts" },
  { icon: "fa-table-tennis", label: "Badminton Court" },
];

const AmenitiesStep = ({ formData, setFormData, prevStep, nextStep }: any) => {
  
  const amenitiesList =
    formData.type === "commercial"
      ? commercialAmenities
      : residentialAmenities;

  const toggleAmenity = (amenity: any) => {
    const exists = formData.amenities.find(
      (a: any) => a.label === amenity.label
    );

    if (exists) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter(
          (a: any) => a.label !== amenity.label
        ),
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {formData.type === "commercial"
          ? "Commercial Amenities"
          : "Residential Amenities"}
      </h2>

      <div className="grid md:grid-cols-6 gap-4">
        {amenitiesList.map((amenity) => {
          const selected = formData.amenities.some(
            (a: any) => a.label === amenity.label
          );

          return (
            <div
              key={amenity.label}
              onClick={() => toggleAmenity(amenity)}
              className={`cursor-pointer p-4 rounded-2xl text-center border transition-all duration-300 ${
                selected
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                  : "hover:bg-gray-100"
              }`}
            >
              <i className={`fas ${amenity.icon} text-2xl mb-2`}></i>
              <p className="text-sm font-medium">{amenity.label}</p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={prevStep} className="btn-secondary">
          ← Back
        </button>
        <button onClick={nextStep} className="btn">
          Next →
        </button>
      </div>
    </div>
  );
};

export default AmenitiesStep;