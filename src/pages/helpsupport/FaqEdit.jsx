import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BsArrowLeftCircle } from "react-icons/bs";
import axios from "axios";

const API_BASE = `${process.env.REACT_APP_BACKEND_API_BASEURL}/adminFaq`;

export default function FaqEdit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data if location.state is missing
  useEffect(() => {
    if (location.state) {
      setQuestion(location.state.question || "");
      setAnswer(location.state.answer || "");
      setLoading(false);
    } else {
      axios
        .get(`${API_BASE}/getFaqById/${id}`)
        .then((res) => {
          if (res.data && res.data.getFaqById) {
            setQuestion(res.data.getFaqById.question || "");
            setAnswer(res.data.getFaqById.answer || "");
          } else {
            setError("FAQ not found");
          }
        })
        .catch(() => setError("Failed to fetch FAQ"))
        .finally(() => setLoading(false));
    }
  }, [id, location.state]);

  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) {
      alert("Please fill both Question and Answer");
      return;
    }

    try {
      const res = await axios.put(`${API_BASE}/updateFaqById/${id}`, {
        question,
        answer,
      });

      if (res.status === 200) {
        alert("FAQ Updated Successfully");
        navigate("/helpSupport/faq");
      }
    } catch (err) {
      console.error("Error updating FAQ:", err);
      alert("Failed to update FAQ");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading FAQ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <p className="text-red-500 text-lg mb-4 text-center">{error}</p>
        <button
          onClick={() => navigate("/helpSupport/faq")}
          className="bg-yellow-400 text-red-600 font-semibold px-4 md:px-6 py-2 md:py-3 rounded-md shadow hover:bg-yellow-500"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      {/* Back */}
      <div className="flex items-center mb-4 bg-white p-4 md:p-5 rounded shadow">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <BsArrowLeftCircle
              size={25}
              className="text-gray-700 md:text-black"
            />
          </button>
          <h2 className="text-lg md:text-xl font-semibold">Edit FAQ</h2>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white p-4 md:p-6 rounded-md shadow">
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">
            Question
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 md:p-3 text-sm md:text-base focus:outline-none focus:ring focus:ring-orange-500"
          />
        </div>

        {/* Answer */}
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-1">Answer</label>
          <textarea
            rows="6"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 md:p-3 text-sm md:text-base focus:outline-none focus:ring focus:ring-orange-500"
          ></textarea>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="bg-[#FEBC1D] text-red-600 px-4 md:px-6 py-2 md:py-3 rounded shadow font-semibold text-sm md:text-base"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
