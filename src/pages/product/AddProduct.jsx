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
    data.append("unitsAvailable", "100"); // default value
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
    <div className="bg-gray-100">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-md sticky top-0 z-10 flex items-center space-x-2">
        <BsArrowLeftCircle
          className="text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-xl font-semibold">Add Product</h2>
      </div>

      {/* Product Card */}
      <div className="overflow-x-auto scrollbar-thin bg-white mt-2 p-4 rounded shadow">
        <div className="max-h-[430px] min-w-[800px]">
          <div className="flex gap-6 mb-6">
            {/* Front Image */}
            <div className="w-52 h-[290px] bg-white rounded-lg border border-gray-300 flex flex-col items-center justify-between p-3 shadow">
              <img
                src={attaPreview}
                alt="Front View"
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
                alt="Back View"
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
          className="bg-brandYellow text-brandRed px-5 py-1.5 rounded hover:bg-yellow-600 font-bold"
          onClick={handleSave}
        >
          Add
        </button>
        {showSuccess && (
          <SuccessOverlay message="Product is successfully added in the master catalog" />
        )}
      </div>
    </div>
  );
};

export default AddProduct;