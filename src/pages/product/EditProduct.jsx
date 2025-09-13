import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { GrUpload } from "react-icons/gr";
import SuccessOverlay from "../../components/overlay/SuccessOverlay";
import { BsArrowLeftCircle } from "react-icons/bs";
import {
  useUpdateProductByIdMutation,
  useGetProductByIdQuery,
} from "../../redux/apis/productApi";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [updateProductById] = useUpdateProductByIdMutation();
  const { data, isLoading, isError } = useGetProductByIdQuery(id);

  // Files
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);

  // Form Data
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

  // Messages
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (data?.product) {
      const product = data.product;
      setFormData({
        name: product.productName || "",
        price: product.price || "",
        packOf: product.productDetails?.packOf || "",
        brand: product.brand || "",
        type: product.productType || "",
        weight: product.productDetails?.netWeight || "",
        shelfLife: product.productDetails?.shelfLife || "",
        nutrient: product.productDetails?.nutrientContent || "",
        description: product.productDetails?.productDescription || "",
      });
      setFrontPreview(product.productPhotoFront || null);
      setBackPreview(product.productPhotoBack || null);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "front") {
        setFrontFile(file);
        setFrontPreview(URL.createObjectURL(file));
      } else {
        setBackFile(file);
        setBackPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    const form = new FormData();
    form.append("productName", formData.name);
    form.append("price", formData.price);
    form.append("packOf", formData.packOf);
    form.append("brand", formData.brand);
    form.append("productType", formData.type);
    form.append("netWeight", formData.weight);
    form.append("shelfLife", formData.shelfLife);
    form.append("nutrientContent", formData.nutrient);
    form.append("productDescription", formData.description);
    if (frontFile) form.append("productPhotoFront", frontFile);
    if (backFile) form.append("productPhotoBack", backFile);

    try {
      await updateProductById({ id, data: form }).unwrap();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate(`/product/details/${id}`);
      }, 1500);
    } catch (err) {
      console.error("Update failed", err);
      setError("❌ Failed to update product. Please try again.");
    }
  };

  const handleBackNavigation = () => {
    navigate(-1);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 flex flex-col">
      {/* Sticky Header */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t z-30 p-4 flex rounded-md shadow">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <BsArrowLeftCircle size={20} className="text-gray-700 md:text-black" />
          </button>
          <h2 className="text-lg text-gray-800 font-medium">Edit Product Details</h2>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded shadow mt-4 pb-10"
      >
        {/* Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Upload Images */}
        <div className="flex gap-6 mb-6">
          {/* Front Image */}
          <div className="w-52 h-[290px] bg-white shadow rounded-lg border border-gray-300 flex flex-col items-center justify-between p-3 shadow">
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
          form="edit-product-form"
          onClick={handleSave}
          className="bg-[#FEBC1D] text-red-600 font-semibold px-6 py-2 rounded-md hover:bg-yellow-500"
        >
          Save
        </button>
        {showSuccess && (
          <SuccessOverlay message="Product updated successfully!" />
        )}
      </div>
    </div>
  );
}
