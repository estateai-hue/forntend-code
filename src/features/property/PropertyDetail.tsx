import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import PropertyGallery from "../../components/property/PropertyGallery";
import PropertyMap from "../../components/property/PropertyMap";
import ReviewsSection from "../../components/property/ReviewSection";
import SimilarProperties from "../../components/property/SmiliarProperties";
import ContactAgentCard from "../../components/property/ContactAgentCard";
import EMICalculator from "../../components/property/EMICalculator";
import ScheduleVisitModal from "../../components/property/ScheduleVisitModal";
import PropertyInfo from "../../components/property/PropertyInfo";

const PropertyDetail = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    const res = await axios.get(
      `http://localhost:8080/api/properties/${id}`,
      {
        headers:{
          Authorization: `Bearer ${token}`,
        }
      }
    );
    setProperty(res.data);
  };

  if (!property) return <p className="p-10">Loading...</p>;

  return (
    <>
    <div className="container mx-auto space-y-10">
      <PropertyGallery images={property.images} />

      {/* 🔥 ROW 2 — Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-10">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-10">
          <PropertyInfo property={property} />

          <PropertyMap
            lat={property?.latitude}
            lng={property?.longitude}
          />

          <ReviewsSection />
          <SimilarProperties />
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6 sticky top-24 h-fit">
          <ContactAgentCard
            agentPhone={property.agents?.[0]?.phone}
            propertyTitle={property.title}
          />

          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 w-full text-white px-4 py-3 rounded-lg"
          >
            Schedule Visit
          </button>

          <EMICalculator />
        </div>
        </div>

      {/* Modal */}
      <ScheduleVisitModal 
        propertyId={property._id}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}    
      />

    </div>
    </>
  );
};

export default PropertyDetail;