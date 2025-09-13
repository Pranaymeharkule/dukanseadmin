import React, { useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { GrUpload } from "react-icons/gr";
import { useAddProductMutation } from "../../redux/apis/productApi";
import SuccessOverlay from "../../components/overlay/SuccessOverlay";

export default function AddProduct() {
  const navigate = useNavigate();
  const [addProduct, { isLoading }] = useAddProductMutation();

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    packOf: "",
    brand: "",
    type: "",
    weight: "",
    shelfLife: "",
    nutrient: "",
    description: "",
  });

  // Images
  const [frontImg, setFrontImg] = useState(null);
  const [backImg, setBackImg] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);

  // Messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "front") {
        setFrontImg(file);
        setFrontPreview(URL.createObjectURL(file));
      } else {
        setBackImg(file);
        setBackPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.name || !formData.price || !formData.brand) {
      setError("⚠️ Please fill required fields: Name, Price, and Brand.");
      return;
    }

    const data = new FormData();
    data.append("productName", formData.name);
    data.append("price", formData.price);
    data.append("packOf", formData.packOf);
    data.append("brand", formData.brand);
    data.append("productType", formData.type);
    data.append("netWeight", formData.weight);
    data.append("shelfLife", formData.shelfLife);
    data.append("nutrientContent", formData.nutrient);
    data.append("productDescription", formData.description);
    data.append("unitsAvailable", "100"); // default
    if (frontImg) data.append("productPhotoFront", frontImg);
    if (backImg) data.append("productPhotoBack", backImg);

    try {
      await addProduct(data).unwrap();
      setSuccess("✅ Product added successfully!");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/product");
      }, 1500);
    } catch (err) {
      console.error("Error adding product:", err);
      setError("❌ Failed to add product. Please try again.");
    }
  };

  const handleBackNavigation = () => {
    navigate(-1);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 flex flex-col">
      {/* Sticky Header */}
      <div className="flex items-center mb-4 bg-white px-4 py-3 rounded-md shadow">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <BsArrowLeftCircle size={20} className="text-gray-700 md:text-black" />
          </button>
          <h2 className="text-lg text-gray-800 font-medium">ADD Product</h2>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded shadow mt-2 pb-10"
      >
        {/* Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Upload Images */}
        <div className="flex gap-6 mb-6">
          {/* Front Image */}
          <div className="w-52 h-[290px] bg-white rounded-lg border border-gray-300 flex flex-col items-center justify-between p-3 shadow">
            {frontPreview ? (
              <img
                src={frontPreview}
                alt="Front Preview"
                className="w-full h-48 object-contain"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-gray-400 border">
                No Front Image
              </div>
            )}
            <label className="w-full">
              <div className="bg-brandYellow text-brandRed font-semibold rounded-md py-2 text-center cursor-pointer hover:bg-yellow-500">
                <span className="flex items-center justify-center gap-1">
                  <GrUpload className="text-lg" /> Upload
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "front")}
                  className="hidden"
                />
              </div>
            </label>
          </div>

          {/* Back Image */}
          <div className="w-52 h-[290px] bg-white rounded-lg border border-gray-300 flex flex-col items-center justify-between p-3 shadow">
            {backPreview ? (
              <img
                src={backPreview}
                alt="Back Preview"
                className="w-full h-48 object-contain"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-gray-400 border">
                No Back Image
              </div>
            )}
            <label className="w-full">
              <div className="bg-brandYellow text-brandRed font-semibold rounded-md py-2 text-center cursor-pointer hover:bg-yellow-500">
                <span className="flex items-center justify-center gap-1">
                  <GrUpload className="text-lg" /> Upload
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "back")}
                  className="hidden"
                />
              </div>
            </label>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4 text-sm text-gray-800">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Name of Product
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Type
            </label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Net Weight
            </label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Pack Of
            </label>
            <input
              type="text"
              name="packOf"
              value={formData.packOf}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Maximum Shelf Life
            </label>
            <input
              type="text"
              name="shelfLife"
              value={formData.shelfLife}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Nutrient Content
            </label>
            <input
              type="text"
              name="nutrient"
              value={formData.nutrient}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Product Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 p-2 border rounded"
            ></textarea>
          </div>
        </div>
      </form>

      {/* Sticky Submit */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t shadow-md z-30 p-4 flex justify-center">
        <button
          type="submit"
          form="add-product-form"
          onClick={handleSave}
          className={`font-poppins px-10 py-4 rounded-lg text-lg font-bold shadow-md transition-colors ${isLoading
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : "bg-brandYellow text-red-600 hover:bg-yellow-600"
            }`}
          disabled={isLoading}
        >
          {isLoading ? "Adding Product..." : "Add Product"}
        </button>
        {showSuccess && (
          <SuccessOverlay message="Product is successfully added in the master catalog" />
        )}
      </div>
    </div>
  );
}
