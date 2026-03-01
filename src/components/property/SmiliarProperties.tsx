import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Property {
  _id: string;
  title: string;
  images: string[];
  price: {
    amount: number;
  };
}

export default function SimilarProperties() {
  const { id } = useParams(); // get current property id
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/properties/similar/${id}`
        );

        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching similar properties:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSimilar();
  }, [id]);

  if (loading) {
    return <p className="mt-10 text-gray-500">Loading similar properties...</p>;
  }

  if (!properties.length) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {properties.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
            <img
              src={p.images?.[0] || "/placeholder.jpg"}
              className="h-48 w-full object-cover rounded-lg"
              alt={p.title}
            />
            <h3 className="font-semibold mt-3 line-clamp-2">
              {p.title}
            </h3>
            <p className="text-blue-600 font-bold">
              ₹ {p.price?.amount?.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}