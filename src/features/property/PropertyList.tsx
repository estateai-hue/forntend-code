import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

type Currency = "INR" | "USD" | "AED";

const currencies: Currency[] = ["INR", "USD", "AED"];

const PropertyList = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedUnit, setSelectedUnit] = useState("sqft");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("INR");
  const [exchangeRate, setExchangeRate] = useState(1);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [totalPages, setTotalPages] = useState(1);

  const limit = 9;

  const currencySymbol: Record<Currency, string> = {
    INR: "₹",
    USD: "$",
    AED: "AED ",
  };

  // ================================
  // Exchange Rate
  // ================================
  const fetchRate = async (from: string, to: string) => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/exchange-rate",
        { params: { from, to } }
      );
      return res.data.rate;
    } catch {
      return 1;
    }
  };

  useEffect(() => {
    fetchRate("INR", selectedCurrency).then(setExchangeRate);
  }, [selectedCurrency]);

  // ================================
  // Fetch Properties
  // ================================
  const fetchProperties = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:8080/api/properties/get-filter",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page,
            limit,
            search,
            sort,
          },
        }
      );

      setProperties(res.data.data);
      setTotalPages(res.data.pages);

      setSearchParams({
        page: page.toString(),
        search,
        sort,
      });

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProperties();
    }, 500);

    return () => clearTimeout(delay);
  }, [page, sort, search]);

  // ================================
  // Convert Functions
  // ================================
  const convertArea = (area: number = 0) => {
    if (selectedUnit === "sqm") {
      return (area * 0.092903).toFixed(2);
    }
    return area.toFixed(0);
  };

  const convertPrice = (amount: number = 0) => {
    return (amount * exchangeRate).toLocaleString();
  };

  // ================================
  // Delete
  // ================================
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    await axios.delete(
      `http://localhost:8080/api/properties/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setProperties((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Enterprise Inventory</h1>
          <p className="text-gray-500">
            Verified properties currently active in the system.
          </p>
        </div>

        <button
          onClick={() => navigate("/superadmin/create-property")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl"
        >
          + Register Property
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">

        {/* Search */}
        <input
          type="text"
          placeholder="Search property..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border px-4 py-2 rounded-lg w-64"
        />

        {/* Sorting */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price-asc">Price Low → High</option>
          <option value="price-desc">Price High → Low</option>
        </select>

        {/* Unit */}
        <select
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="sqft">Sq Ft</option>
          <option value="sqm">Sq Meter</option>
        </select>

        {/* Currency */}
        <select
          value={selectedCurrency}
          onChange={(e) =>
            setSelectedCurrency(e.target.value as Currency)
          }
          className="border px-4 py-2 rounded-lg"
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currencySymbol[currency]} {currency}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {Array.isArray(properties) && properties.map((property) => (
            <div
              key={property._id}
              onClick={() =>
                navigate(`/superadmin/property/${property._id}`)
              }
              className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer"
            >
              <div className="relative">
                <img
                  src={property.images?.[0] || "/placeholder.jpg"}
                  alt={property.title}
                  className="h-56 w-full object-cover"
                />

                <div className="absolute top-4 left-4 bg-white px-4 py-1 rounded-full shadow font-semibold">
                  {currencySymbol[selectedCurrency]}
                  {convertPrice(property.price?.amount)}
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold line-clamp-2">
                  {property.title}
                </h2>

                <p className="text-gray-500 mt-2">
                  {property.location?.address}
                </p>

                <div className="flex justify-between mt-4 text-sm">
                  <span>{property.bedrooms} Beds</span>
                  <span>{property.bathrooms} Baths</span>
                  <span>
                    {convertArea(property.superBuiltupArea?.value)}{" "}
                    {selectedUnit}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(property._id);
                  }}
                  className="w-full mt-6 bg-red-50 text-red-600 py-3 rounded-2xl"
                >
                  Remove Listing
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-3">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`px-4 py-2 rounded ${
              page === index + 1
                ? "bg-indigo-600 text-white"
                : "bg-white border"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;