import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumbs";
import CustomQuillEditor from "../../components/quill/CustomQuillEditor";
import Button from "../../components/buttons/Buttons";
import SuccessOverlay from "../../components/overlay/SuccessOverlay";

export default function EditTermsCondition() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASEURL;

  // Fetch existing terms when edit page loads
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/settings/getUserTerms`
        );
        if (response.data?.success && response.data?.termsAndCondition?.description) {
          setEditedMessage(response.data.termsAndCondition.description);
        }
      } catch (error) {
        console.error("Error fetching terms:", error);
      }
    };
    fetchTerms();
  }, [API_BASE_URL]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${API_BASE_URL}/settings/updateUserTerms`,
        { description: editedMessage }
      );

      if (response.data?.success && response.data?.updated?.description) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/terms-condition");
        }, 2500);
      } else {
        alert("Failed to update Terms & Conditions");
      }
    } catch (error) {
      console.error("Error updating terms:", error);
      alert("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/terms-condition");
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col min-h-[600px]">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb titles={["Terms & Conditions", "Edit"]} showBack={true} />
      </div>

      {/* Editor */}
      <div className="h-[400px] overflow-y-auto scrollbar-hide">
        <CustomQuillEditor value={editedMessage} onChange={setEditedMessage} />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <Button
          onClick={handleUpdate}
          className="px-10 py-2 rounded bg-brandYellow"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </Button>

        <Button
          onClick={handleCancel}
          className="px-10 py-2 rounded bg-brandYellow"
          variant="outlined"
        >
          Cancel
        </Button>
      </div>

      {/* Success Overlay */}
      {showSuccess && (
        <SuccessOverlay message="Terms & Conditions updated successfully!" />
      )}
    </div>
  );
}
