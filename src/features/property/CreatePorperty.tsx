import { useState } from "react";
import AmenitiesStep from "./AmenitiesStep";
import "../../assets/style.css";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateProperty = () => {
  const { token } = useAuth();
  const [step, setStep] = useState(1);
  const navgiate = useNavigate();

 const [formData, setFormData] = useState({
  title: "",
  location: "",
  type: "",
  price: {
    amount: "",
    currency: "INR",
  },
  bedrooms: "",
  bathrooms: "",
  balconies: "",
  furnishedStatus: "",
  superBuiltupArea: {
    value: "",
    unit: "sqft",
  },
  developer: "",
  project: "",
  floor: "",
  transactionType: "",
  ageOfConstruction: "",
  description: "",
  latitude: "",
  longitude: "",
  amenities: [] as { icon: string; label: string }[],
  images: [] as File[],
});

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

 const handleSubmit = async () => {
  try {
    const form = new FormData();

    form.append("title", formData.title);
    form.append("location[address]", formData.location);
    form.append("type", formData.type);
    form.append("description", formData.description);
    form.append("latitude", formData.latitude);
    form.append("longitude", formData.longitude);
    form.append("transactionType", formData.transactionType);
    form.append("developer", formData.developer);
    form.append("project", formData.project);
    form.append("floor", formData.floor);
    form.append("ageOfConstruction", formData.ageOfConstruction);

    // 🔥 FIXED nested fields
    form.append("price[amount]", String(formData.price.amount));
    form.append("price[currency]", formData.price.currency);

    form.append("superBuiltupArea[value]", String(formData.superBuiltupArea.value));
    form.append("superBuiltupArea[unit]", formData.superBuiltupArea.unit);

    form.append("bedrooms", String(formData.bedrooms));
    form.append("bathrooms", String(formData.bathrooms));
    form.append("balconies", String(formData.balconies));
    form.append("furnishingStatus", formData.furnishedStatus);

    // amenities as JSON
    form.append("amenities", JSON.stringify(formData.amenities));

    // multiple images
    formData.images.forEach((image) => {
      form.append("images", image);
    });

    await axios.post("http://localhost:8080/api/properties", form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Property Created Successfully 🚀");

  } catch (error: any) {
    console.log(error.response?.data || error.message);
  }
};

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-2xl font-bold">Create Property</h4>
        <button onClick={()=> navgiate(-1)}>← Back to Properties</button>
      </div>  
      {/* Step Indicator */}
      <div className="flex justify-between mb-4">
        {["Basic", "Property Info", "Project & Area", "Amenities", "Location"].map((label, index) => (
          <div
            key={index}
            className={`pb-5 px-2 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
              step === index + 1 ? "text-indigo-600" : "text-gray-400"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <div className="space-y-6">

          <input
            type="text"
            name="title"
            placeholder="Property Title"
            className="input"
            onChange={handleChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            className="input"
            onChange={handleChange}
          />

          <select
            name="type"
            className="input"
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value, amenities: [] })
            }
          >
            <option value="">Select Type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>

          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Price"
              className="input"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: { ...formData.price, amount: e.target.value },
                })
              }
            />

            <select
              className="input"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: { ...formData.price, currency: e.target.value },
                })
              }
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          <button onClick={nextStep} className="btn">Next →</button>
        </div>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
          <div className="space-y-6">

            <div className="flex gap-4">
              <input type="number" name="bedrooms" placeholder="Bedrooms" className="input" onChange={handleChange} />
              <input type="number" name="bathrooms" placeholder="Bathrooms" className="input" onChange={handleChange} />
              <input type="number" name="balconies" placeholder="Balconies" className="input" onChange={handleChange} />
            </div>

            {/* Furnished Status */}
            <select
              className="input"
              onChange={(e) =>
                setFormData({ ...formData, furnishedStatus: e.target.value })
              }
            >
              <option value="">Select Furnishing</option>

              {formData.type === "residential" && (
                <>
                  <option value="furnished">Furnished</option>
                  <option value="semi-furnished">Semi Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </>
              )}

              {formData.type === "commercial" && (
                <>
                  <option value="virtual space">Virtual Space</option>
                  <option value="lockable">Lockable</option>
                  <option value="shops">Shops</option>
                  <option value="coworking">Coworking</option>
                </>
              )}
            </select>
              <div>
                <label className="block font-semibold mb-2">
                  Upload Property Images
                </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e: any) => {
                    const files = Array.from(e.target.files) as File[];
                    setFormData({ ...formData, images: files });
                  }}
                  className="border w-full py-2 px-4"
                />
              </div>
              
            <div className="flex justify-between">
              <button onClick={prevStep} className="btn-secondary">← Back</button>
              <button onClick={nextStep} className="btn">Next →</button>
            </div>
          </div>
        )}

      {/* ================= STEP 3 (AMENITIES) ================= */}
     {step === 3 && (
      <div className="space-y-6">

        {/* Super Built-up Area */}
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Super Built-up Area"
            className="input"
            onChange={(e) =>
              setFormData({
                ...formData,
                superBuiltupArea: {
                  ...formData.superBuiltupArea,
                  value: e.target.value,
                },
              })
            }
          />

          <select
            className="input"
            onChange={(e) =>
              setFormData({
                ...formData,
                superBuiltupArea: {
                  ...formData.superBuiltupArea,
                  unit: e.target.value,
                },
              })
            }
          >
            <option value="sqft">Sqft</option>
            <option value="sqyd">Sqyd</option>
            <option value="sqm">Sqm</option>
            <option value="acre">Acre</option>
          </select>
        </div>

        <input type="text" name="developer" placeholder="Developer" className="input" onChange={handleChange} />
        <input type="text" name="project" placeholder="Project Name" className="input" onChange={handleChange} />
        <input type="text" name="floor" placeholder="Floor" className="input" onChange={handleChange} />

        <select
          className="input"
          onChange={(e) =>
            setFormData({ ...formData, transactionType: e.target.value })
          }
        >
          <option value="">Transaction Type</option>
          <option value="new">New</option>
          <option value="resale">Resale</option>
        </select>

        <input
          type="number"
          name="ageOfConstruction"
          placeholder="Age of Construction (Years)"
          className="input"
          onChange={handleChange}
        />

        <div className="flex justify-between">
          <button onClick={prevStep} className="btn-secondary">← Back</button>
          <button onClick={nextStep} className="btn">Next →</button>
        </div>
      </div>
    )}

      {/* ================= STEP 4 ================= */}
      {step === 4 && (
        <AmenitiesStep formData={formData} setFormData={setFormData} prevStep={prevStep} nextStep={nextStep} />
      )}

      {/* =======step-5-========= */}
      {step === 5 && (
      <div className="space-y-6">

        <textarea
          name="description"
          placeholder="Property Description"
          rows={4}
          className="input"
          onChange={handleChange}
        />

        <input
          type="number"
          placeholder="Latitude"
          className="input"
          onChange={(e) =>
            setFormData({ ...formData, latitude: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Longitude"
          className="input"
          onChange={(e) =>
            setFormData({ ...formData, longitude: e.target.value })
          }
        />

        <div className="flex justify-between">
          <button onClick={prevStep} className="btn-secondary">← Back</button>
          <button onClick={handleSubmit} className="btn">Submit Property</button>
        </div>
      </div>
    )}
    </div>
  );
};

export default CreateProperty;