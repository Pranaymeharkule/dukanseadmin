import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsArrowLeftCircle } from "react-icons/bs";
import axios from "axios";

export default function FaqAdd() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAdd = async () => {
    if (!question.trim() || !answer.trim()) {
      alert("Please fill both Question and Answer");
      return;
    }

    try {
      const res = await axios.post(
        "https://dukanse-be.onrender.com/api/adminFaq/addFaq",
        { question, answer },
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",   // 🚀 prevent 304
          },
          params: { t: new Date().getTime() }, // 🚀 unique timestamp
        }
      );

      if (res.status === 200 || res.status === 201) {
        alert("FAQ Added Successfully");
        navigate("/helpSupport/faq"); // redirect to FAQ list
      }
    } catch (error) {
      console.error("Error adding FAQ:", error);
      alert("Failed to add FAQ");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-3">
      {/* Back */}
      <div className="flex items-center mb-4 bg-white px-4 py-3 rounded-md shadow">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}>
              <BsArrowLeftCircle
                size={20}
                className="text-gray-700 md:text-black"
              />
            </button>
            <h2 className="text-lg text-gray-800 font-medium">
              Add FAQ
            </h2>
          </div>
        </div>

      {/* Question & Answer */}
      <div className="bg-white p-4 md:p-6 rounded-md shadow">
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">
            Question
          </label>
          <input
            type="text"
            placeholder="Enter Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 md:p-3 text-sm md:text-base focus:outline-none focus:ring focus:ring-orange-500"
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-1">Answer</label>
          <textarea
            rows="6"
            placeholder="Enter Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 md:p-3 text-sm md:text-base focus:outline-none focus:ring focus:ring-orange-500"
          ></textarea>
        </div>

        {/* Add Button */}
        <div className="flex justify-center">
          <button
            onClick={handleAdd}
            className="bg-[#FEBC1D] text-red-600 px-4 md:px-6 py-2 md:py-3 rounded shadow font-semibold text-sm md:text-base"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
