import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Breadcrumb from "../../components/breadcrumbs/Breadcrumbs";
import CustomQuillEditor from "../../components/quill/CustomQuillEditor";
import Button from "../../components/buttons/Buttons";
import { toast } from "react-toastify";

export default function AccountDeletionEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(location.state?.message || "");

  const handleUpdate = () => {
    setLoading(true);

    // Just simulate a success message
    setTimeout(() => {
      toast.success(" updated successfully");
      setLoading(false);
      navigate("/account-deletion", { state: { message } });
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/account-deletion");
  };

  return (
    <div className="h-full flex flex-col relative bg-white">
      {/* Breadcrumb */}
      <div className="mb-4 shrink-0">
        <Breadcrumb titles={["Account Deletion Policy", "Edit"]} showBack={true} />
      </div>

      {/* Editor */}
      <div>
        <div className="h-[400px] overflow-y-auto scrollbar-hide">
          <CustomQuillEditor value={message} onChange={setMessage} />
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-end gap-3 mt-auto pb-2">
        <Button
          onClick={handleUpdate}
          className="px-10 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
        <Button
          onClick={handleCancel}
          className="px-10 py-2 rounded"
          variant="outlined"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
