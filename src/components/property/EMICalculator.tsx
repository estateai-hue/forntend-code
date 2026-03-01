import { useState } from "react";

export default function EMICalculator() {
  const [amount, setAmount] = useState(5000000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);

  const calculateEMI = () => {
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;

    const emi =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return emi.toFixed(0);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow mt-6">
      <h3 className="text-xl font-bold mb-4">EMI Calculator</h3>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        type="number"
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        type="number"
        value={years}
        onChange={(e) => setYears(Number(e.target.value))}
        className="w-full border p-2 mb-3 rounded"
      />

      <p className="text-lg font-semibold">
        Monthly EMI: ₹ {calculateEMI()}
      </p>
    </div>
  );
}