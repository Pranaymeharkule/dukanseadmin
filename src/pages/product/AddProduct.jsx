import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import atta from "../../assets/ashirwadaata.jpeg";
import backImg from "../../assets/download.jpeg";
import { BsArrowLeftCircle } from "react-icons/bs";
import { GrUpload } from "react-icons/gr";
import SuccessOverlay from "../../components/overlay/SuccessOverlay";
import { useAddProductMutation } from "../../redux/apis/productApi";

const AddProduct = () => {
  const navigate = useNavigate();
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [attaFile, setAttaFile] = useState(null);
  const [backImgFile, setBackImgFile] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [attaPreview, setAttaPreview] = useState(atta);
  const [backImgPreview, setBackImgPreview] = useState(backImg);

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
      setBackImgFile(file);
      setBackImgPreview(URL.createObjectURL(file));
    }
  };

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
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
    data.append("unitsAvailable", "100");
    data.append("productPhotoFront", attaFile);
    data.append("productPhotoBack", backImgFile);

    try {
      await addProduct(data).unwrap();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/product/product-add");
      }, 2500);
    } catch (error) {
      console.error("Error adding product:", error);
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
        <h2 className="text-xl font-bold text-gray-800">Add Product</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Upload Section */}
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Upload Product Images
          </h3>
          <div className="flex flex-wrap gap-6 mb-6">
            {/* Front Image */}
            <div className="w-52 h-[300px] bg-gray-50 rounded-lg border border-gray-300 flex flex-col items-center justify-between p-3 hover:shadow-md transition">
              <img
                src={attaPreview}
                alt="Front View"
                className="w-full h-48 object-contain rounded"
              />
              <label className="w-full">
                <div className="bg-brandYellow text-brandRed font-semibold rounded-md py-2 text-center cursor-pointer hover:bg-yellow-500 transition">
                  <span className="flex items-center justify-center gap-2">
                    <GrUpload className="text-lg" />
                    Upload Front
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
            <div className="w-52 h-[300px] bg-gray-50 rounded-lg border border-gray-300 flex flex-col items-center justify-between p-3 hover:shadow-md transition">
              <img
                src={backImgPreview}
                alt="Back View"
                className="w-full h-48 object-contain rounded"
              />
              <label className="w-full">
                <div className="bg-brandYellow text-brandRed font-semibold rounded-md py-2 text-center cursor-pointer hover:bg-yellow-500 transition">
                  <span className="flex items-center justify-center gap-2">
                    <GrUpload className="text-lg" />
                    Upload Back
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
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Product Details
          </h3>
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
                <label className="font-semibold text-gray-700">
                  {field.label}
                </label>
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

          <div className="mt-4">
            <label className="font-semibold text-gray-700">
              Product Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-brandYellow focus:outline-none"
              placeholder="Enter detailed description..."
            ></textarea>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="bg-white px-4 py-3 fixed bottom-0 left-0 w-full z-20 border-t flex justify-center shadow-lg">
        <button
          disabled={isLoading}
          className={`${
            isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-yellow-600"
          } bg-brandYellow text-brandRed px-6 py-2 rounded-lg font-bold shadow-md transition`}
          onClick={handleSave}
        >
          {isLoading ? "Saving..." : "Add Product"}
        </button>
        {showSuccess && (
          <SuccessOverlay message="Product is successfully added in the master catalog" />
        )}
      </div>
    </div>
  );
};

export default AddProduct;
