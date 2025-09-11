// src/pages/FaqView.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BsArrowLeftCircle } from "react-icons/bs";

const API_BASE = `${process.env.REACT_APP_BACKEND_API_BASEURL}/adminFaq`;

export default function FaqView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`${API_BASE}/getFaqById/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.getFaqById) {
          setFaq(data.getFaqById);
        } else {
          setError("FAQ not found");
        }
      })
      .catch(() => setError("Failed to load FAQ"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading FAQ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => navigate("/helpSupport/faq")}
          className="bg-yellow-400 text-red-600 font-semibold px-6 py-2 rounded-md shadow hover:bg-yellow-500"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!faq) return null;
  
  return (
    <div className="bg-gray-100 min-h-screen p-3">  
      {/* Header */}
      <div className="flex items-center mb-4 bg-white px-4 py-3 rounded-md shadow">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}>
              <BsArrowLeftCircle
                size={20}
                className="text-gray-700 md:text-black"
              />
            </button>
            <h2 className="text-lg text-gray-800 font-medium">
             View FAQ
            </h2>
          </div>
        </div>

      {/* FAQ Content */}
      <div className="bg-white rounded-md shadow mt-5 p-6">
        <h2 className="text-2xl font-bold text-red-500">{faq.question}</h2>
        <p className="mt-4 text-gray-700 leading-relaxed">{faq.answer}</p>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate(`/faq/edit/${faq._id}`, { state: faq })}
            className="bg-yellow-400 text-red font-semibold px-8 py-2 rounded-md shadow"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
