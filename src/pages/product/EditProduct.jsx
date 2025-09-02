import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BsArrowLeftCircle } from "react-icons/bs";
import { GrUpload } from "react-icons/gr";
import SuccessOverlay from "../../components/overlay/SuccessOverlay";
import {
  useUpdateProductByIdMutation,
  useGetProductByIdQuery,
} from "../../redux/apis/productApi";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [updateProductById] = useUpdateProductByIdMutation();

  const [attaFile, setAttaFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [attaPreview, setAttaPreview] = useState(null);
  const [backImgPreview, setBackImgPreview] = useState(null);

  const { data } = useGetProductByIdQuery(id);

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
      setAttaPreview(product.productPhotoFront || null);
      setBackImgPreview(product.productPhotoBack || null);
    }
  }, [data]);

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttaFile(file);
      setAttaPreview(URL.createObjectURL(file));
    }
  };

  const handleBackImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackFile(file);
      setBackImgPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
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
    if (attaFile) form.append("productPhotoFront", attaFile);
    if (backFile) form.append("productPhotoBack", backFile);

    try {
      await updateProductById({
        id,
        data: form,
        extra: {
          headers: { "Cache-Control": "no-cache" },
          params: { t: Date.now() },
        },
      }).unwrap();

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate(`/product/details/${id}`);
      }, 2500);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-md sticky top-0 z-10 flex items-center space-x-3">
        <BsArrowLeftCircle
          className="text-2xl cursor-pointer text-gray-700 hover:text-gray-900"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
      </div>

      {/* Scrollable Form */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* Image Upload Section */}
          <div className="flex flex-wrap gap-6">
            {[
              { label: "Front Image", preview: attaPreview, onChange: handleAttaChange },
              { label: "Back Image", preview: backImgPreview, onChange: handleBackImgChange },
            ].map((img, idx) => (
              <div
                key={idx}
                className="w-52 h-[300px] bg-gray-50 rounded-lg border border-gray-300 flex flex-col items-center justify-between p-3 hover:shadow-md transition"
              >
                <img src={img.preview} alt={img.label} className="w-full h-48 object-contain rounded" />
                <label className="w-full">
                  <div className="bg-brandYellow text-brandRed font-semibold rounded-md py-2 text-center cursor-pointer hover:bg-yellow-500 transition">
                    <span className="flex items-center justify-center gap-2">
                      <GrUpload className="text-lg" />
                      {img.label}
                    </span>
                    <input type="file" accept="image/*" onChange={img.onChange} className="hidden" />
                  </div>
                </label>
              </div>
            ))}
          </div>

          {/* Product Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
            {[
              { label: "Name of Product", name: "name", type: "text" },
              { label: "Price (₹)", name: "price", type: "number" },
              { label: "Pack Of", name: "packOf", type: "text" },
              { label: "Brand", name: "brand", type: "text" },
              { label: "Type", name: "type", type: "text" },
              { label: "Net Weight", name: "weight", type: "text" },
              { label: "Maximum Shelf Life", name: "shelfLife", type: "text" },
              { label: "Nutrient Content", name: "nutrient", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="font-semibold text-gray-700">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-brandYellow focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="font-semibold text-gray-700">Product Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-brandYellow focus:outline-none"
              placeholder="Enter detailed description..."
            ></textarea>
          </div>

          {/* Save Button at the end */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-brandYellow text-brandRed px-6 py-2 rounded-lg font-bold shadow-md hover:bg-yellow-600 transition"
              onClick={handleSave}
            >
              Save
            </button>
          </div>

          {showSuccess && (
            <SuccessOverlay message="Your Information has been saved successfully!" />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
