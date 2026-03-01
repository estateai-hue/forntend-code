import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Review {
  _id: string;
  user: string;
  rating: number;
  comment: string;
}

export default function ReviewsSection() {
  const { id } = useParams();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [user, setUser] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // ✅ GET REVIEWS
  useEffect(() => {
  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/review/${id}`
      );

      setReviews(res.data); // ✅ axios uses res.data
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (id) fetchReviews();
}, [id]);

  // ✅ POST REVIEW
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      `http://localhost:8080/api/review/${id}`,
      {
        user,
        rating,
        comment,
      }
    );

    const newReview = res.data; 

    // Update UI instantly
    setReviews((prev) => [newReview, ...prev]);

    // Clear form
    setUser("");
    setRating(5);
    setComment("");
  } catch (error) {
    console.error("Error adding review:", error);
  }
};

  if (loading) return <p className="mt-10">Loading reviews...</p>;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>

      {/* ✅ Add Review Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8 space-y-4"
      >
        <input
          type="text"
          placeholder="Your Name"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
          className="w-full border p-3 rounded-lg"
        />

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border p-3 rounded-lg"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star
            </option>
          ))}
        </select>

        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="w-full border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Submit Review
        </button>
      </form>

      {/* ✅ Review List */}
      {reviews.length === 0 && (
        <p className="text-gray-500">No reviews yet.</p>
      )}

      {reviews.map((r) => (
        <div key={r._id} className="bg-white p-4 rounded-xl shadow mb-4">
          <p className="font-semibold">{r.user}</p>
          <p className="text-yellow-500">⭐ {r.rating}/5</p>
          <p className="text-gray-600">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}