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
  const { data, isLoading, isError } = useGetProductByIdQuery(id);

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
      // Add cache-busting header & timestamp to prevent 304
      await updateProductById({
        id,
        data: form,
        extra: {
          headers: {
            "Cache-Control": "no-cache",
          },
          params: {
            t: Date.now(),
          },
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
    <div className="bg-gray-100">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-md sticky top-0 z-10 flex items-center space-x-2">
        <BsArrowLeftCircle
          className="text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-xl font-semibold">Edit Product</h2>
      </div>

      {/* Product Card */}
      <div className="overflow-x-auto scrollbar-thin bg-white mt-2 p-4 rounded shadow">
        <div className="max-h-[430px] min-w-[800px]">
          <div className="flex gap-6 mb-6">
            {/* Front Image */}
            <div className="w-52 h-[290px] bg-white rounded-lg border border-gray-300 flex flex-col items-center justify-between p-3 shadow">
              <img
                src={attaPreview}
                alt=""
                className="w-full h-48 object-contain"
              />
              <label className="w-full">
                <div className="bg-brandYellow text-brandRed font-semibold rounded-md py-2 text-center cursor-pointer hover:bg-yellow-500">
                  <span className="flex items-center justify-center gap-1">
                    <GrUpload className="text-lg" />
                    Upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAttaChange}
                    className="hidden"
                  />
                </div>
              </label>
            </div>

            {/* Back Image */}
            <div className="w-52 h-[290px] bg-white rounded-lg border border-gray-300 flex flex-col items-center justify-between p-3 shadow">
              <img
                src={backImgPreview}
                alt=""
                className="w-full h-48 object-contain"
              />
              <label className="w-full">
                <div className="bg-brandYellow text-brandRed font-semibold rounded-md py-2 text-center cursor-pointer hover:bg-yellow-500">
                  <span className="flex items-center justify-center gap-1">
                    <GrUpload className="text-lg" />
                    Upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBackImgChange}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-2 text-sm text-gray-800">
            <div>
              <label className="font-bold">Name of Product</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-bold">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-bold">Pack Of</label>
              <input
                type="text"
                name="packOf"
                value={formData.packOf}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-bold">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-bold">Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-bold">Net Weight</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-bold">Maximum Shelf Life</label>
              <input
                type="text"
                name="shelfLife"
                value={formData.shelfLife}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-bold">Nutrient Content</label>
              <input
                type="text"
                name="nutrient"
                value={formData.nutrient}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-bold">Product Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full mt-1 p-2 border rounded"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-white px-1 py-2 sticky bottom-0 z-10 flex justify-center border-t">
        <button
          className="bg-brandYellow text-brandRed px-5 py-1.5 rounded hover:bg-yellow-600"
          onClick={handleSave}
        >
          Save
        </button>
        {showSuccess && (
          <SuccessOverlay message="Your Information has been saved successfully !" />
        )}
      </div>
    </div>
  );
};

export default EditProduct;
