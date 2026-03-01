interface Props {
  agentPhone: string;
  propertyTitle: string;
}

export default function ContactAgentCard({ agentPhone, propertyTitle }: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="text-xl font-bold mb-4">Contact Agent</h3>

      <input
        placeholder="Your Name"
        className="w-full border p-3 rounded-lg mb-3"
      />

      <input
        placeholder="Phone Number"
        className="w-full border p-3 rounded-lg mb-3"
      />

      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
        Submit
      </button>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${agentPhone}?text=I'm interested in ${propertyTitle}`}
        target="_blank"
        className="block mt-4 text-center bg-green-500 text-white py-3 rounded-lg font-semibold"
      >
        Chat on WhatsApp
      </a>
    </div>
  );
}