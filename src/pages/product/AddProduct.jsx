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
        navigate("/product");
      }, 1000);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="bg-gray-100 max-h-screen p-4 space-y-4">
      {/* Header Card */}
      <div className="bg-white px-4 py-4 shadow-md rounded flex items-center space-x-2">
        <BsArrowLeftCircle
          className="text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2
          className="font-[Poppins] font-medium text-[24px] leading-[24px] tracking-[0px] 
               text-center align-middle font-normal tabular-nums proportional-nums text-[#262626]"
        >
          Add Product
        </h2>
      </div>

      {/* Product Form Card */}
      <div className="bg-white p-4 rounded shadow mt-3">
        <div className="overflow-x-auto scrollbar-hidden">
          <div className="max-h-[500px] min-w-[800px]">
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
            <div className="space-y-4 text-sm text-gray-800">
              <div>
                <label className="">Name of Product</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="">Type</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="">Net Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="">Pack Of</label>
                <input
                  type="text"
                  name="packOf"
                  value={formData.packOf}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="">Maximum Shelf Life</label>
                <input
                  type="text"
                  name="shelfLife"
                  value={formData.shelfLife}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="">Nutrient Content</label>
                <input
                  type="text"
                  name="nutrient"
                  value={formData.nutrient}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="">Product Description</label>
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
        {/* Save Button Card */}
        <div className="bg-white px-4 py-3 shadow flex justify-center sticky bottom-0 z-10 border-t">
          <button
            className="bg-[#FEBC1D] text-[#EC2D01] 
               w-[200px] h-[50px] rounded-[10px] 
               px-[10px] py-[10px] flex items-center justify-center gap-2 
               font-[Poppins] font-semibold text-[20px] leading-[20px] 
               tracking-[0px] text-center align-middle 
               hover:bg-yellow-600"
            onClick={handleSave}
          >
            Add
          </button>
          {showSuccess && (
            <SuccessOverlay message="Product is successfully added in the master catalog" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
