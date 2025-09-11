import { useNavigate, useParams } from "react-router-dom";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useGetProductByIdQuery } from "../../redux/apis/productApi";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, isError } = useGetProductByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading)
    return <div className="p-4 font-poppins text-gray-600">Loading...</div>;
  if (isError)
    return (
      <div className="p-4 font-poppins text-red-500">
        Failed to fetch product.
      </div>
    );

  const product = data?.product;

  return (
    <div className="bg-gray-100 gap-4 p-4 font-poppins">
      {/* Header Card */}
      <div className="bg-white px-4 py-4 rounded-lg sticky top-4 z-10 flex items-center gap-3 shadow-sm">
        <BsArrowLeftCircle
          className="text-2xl cursor-pointer text-gray-700 hover:text-gray-900"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-lg text-gray-800 font-poppins font-medium">
          View Product Detail
        </h2>
      </div>

      {/* Product Card */}
      <div className="overflow-x-auto scrollbar-thin bg-white mt-4 space-y-6 px-4 rounded-lg shadow">
        <div className="max-h-full min-w-full p-4">
          {/* Images */}
          <div className="flex space-x-6 mb-6">
            <img
              src={product?.productPhotoFront}
              alt="Front View"
              className="w-40 h-48 object-cover border rounded"
            />
            <img
              src={product?.productPhotoBack}
              alt="Back View"
              className="w-40 h-48 object-cover border rounded"
            />
          </div>

          {/* Product Name & Price */}
          <div className="mt-2">
            <h3 className="text-base font-poppins sm:text-xl font-semibold text-gray-800 mb-2">
              {product?.productName || "Product Name"}
            </h3>

            <div className="text-sm sm:text-base font-semibold text-gray-800 bg-brandYellow w-fit px-3 py-1 rounded">
              Price: ₹ {product?.price}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="mt-6">
            <h3 className="text-base sm:text-lg font-poppins font-semibold text-gray-800 mb-4">
              Product Details
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 text-sm sm:text-base text-gray-700">
              <p className="flex">
                <span className="w-48 text-base font-poppins font-semibold flex-shrink-0">
                  Pack Of:
                </span>
                <span className="flex-1 font-poppins text-base font-normal text-gray-800">
                  {product?.productDetails?.packOf}
                </span>
              </p>

              <p className="flex">
                <span className="w-48 font-poppins font-semibold flex-shrink-0">Brand:</span>
                <span className="flex-1 font-poppins text-base font-normal text-gray-800">
                  {product.brand}
                </span>
              </p>

              <p className="flex">
                <span className="w-48 font-poppins font-semibold flex-shrink-0">Type:</span>
                <span className="flex-1 font-poppins text-base font-normal text-gray-800">
                  {product.productType}
                </span>
              </p>

              <p className="flex">
                <span className="w-48 font-poppins font-semibold flex-shrink-0">
                  Net Weight:
                </span>
                <span className="flex-1 font-poppins text-base font-normal text-gray-800">
                  {product?.productDetails?.netWeight}
                </span>
              </p>

              <p className="flex">
                <span className="w-48 font-poppins font-semibold flex-shrink-0">
                  Maximum Shelf Life:
                </span>
                <span className="flex-1 font-poppins text-base font-normal text-gray-800">
                  {product?.productDetails?.shelfLife}
                </span>
              </p>

              <p className="flex">
                <span className="w-48 font-poppins font-semibold flex-shrink-0">
                  Nutrient Content:
                </span>
                <span className="flex-1 font-poppins text-base font-normal text-gray-800">
                  {product?.productDetails?.nutrientContent}
                </span>
              </p>

              <p className="flex">
                <span className="w-48 font-poppins font-semibold flex-shrink-0">
                  Product Description:
                </span>
                <span className="flex-1 font-poppins text-base font-normal text-gray-800">
                  {product?.productDetails?.productDescription}
                </span>
              </p>
            </div>

          </div>
        </div>

        {/* Edit Button */}
        <div className="bg-white flex justify-center mt-6 p-4">
          <button
            className="w-[200px] h-[50px] rounded-lg bg-[#FEBC1D] text-[#EC2D01] font-semibold text-lg sm:text-xl leading-[100%] text-center px-4 py-2 shadow-md hover:opacity-90"
            onClick={() => navigate(`/product/detail/edit/${id}`)}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
