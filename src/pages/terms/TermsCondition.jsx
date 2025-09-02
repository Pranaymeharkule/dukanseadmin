import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumbs";

export default function TermsCondition() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  const handleEdit = () => {
    navigate("/terms-condition/edit");
  };

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/settings/getUserTerms?timestamp=${Date.now()}`,
          { headers: { "Cache-Control": "no-cache" } }
        );

        if (response.data?.success && response.data?.termsAndCondition?.description) {
          setContent(response.data.termsAndCondition.description);
        } else {
          setContent("<p>No Terms & Conditions available.</p>");
        }
      } catch (error) {
        console.error("Error fetching terms:", error);
        setContent("<p>Failed to load Terms & Conditions.</p>");
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, [API_BASE_URL]);

  return (
    <div className="flex flex-col lg:h-full">
      {/* Header: Breadcrumb & Edit Button */}
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb titles={["Terms & Conditions"]} />
        <button
          className="bg-brandYellow text-white px-6 py-2 rounded-md flex items-center gap-2 font-medium"
          onClick={handleEdit}
        >
          <FiEdit className="text-lg" />
          Edit
        </button>
      </div>

      {/* Terms and Conditions Content */}
      <div
        className="text-gray-700 h-[65vh] overflow-y-auto scrollbar-hide p-4 border border-gray-200 rounded-md prose"
        dangerouslySetInnerHTML={{
          __html: loading ? "<p>Loading...</p>" : content,
        }}
      />
    </div>
  );
}
