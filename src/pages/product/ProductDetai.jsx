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
    <div className="bg-gray-100 min-h-screen p-4 md:p-6 font-poppins">
      {/* Header Card */}
      <div className="flex items-center mb-4 bg-white px-4 py-3 shadow rounded-md">
        <button onClick={() => navigate(-1)}>
          <BsArrowLeftCircle size={20} className="text-gray-700 md:text-black" />
        </button>
        <h2 className="ml-2 text-lg text-gray-800 font-medium">View Product Details</h2>
      </div>

      {/* Product Card */}
      <div className="bg-white shadow rounded-lg flex flex-col h-[80vh]">
        <div
          className="p-6 overflow-y-auto flex-1 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div className="flex flex-col items-start gap-6">
            {/* Images */}
            <div className="flex space-x-6">
              <img
                src={product?.productPhotoFront}
                alt="Front View"
                className="w-40 h-48 object-cover rounded shadow"
              />
              <img
                src={product?.productPhotoBack}
                alt="Back View"
                className="w-40 h-48 object-cover rounded shadow"
              />
            </div>

            {/* Basic Info */}
            <div className="w-full max-w-4xl space-y-4">
              {[
                ["Product Name:", product?.productName],
                ["Price:", `₹ ${product?.price}`],
                ["Brand:", product?.brand],
                ["Type:", product?.productType],
                ["Pack Of:", product?.productDetails?.packOf],
                ["Net Weight:", product?.productDetails?.netWeight],
                ["Maximum Shelf Life:", product?.productDetails?.shelfLife],
                ["Nutrient Content:", product?.productDetails?.nutrientContent],
                ["Product Description:", product?.productDetails?.productDescription],
              ].map(([label, value], idx) => (
                <div className="grid grid-cols-2 gap-4" key={idx}>
                  <span className="font-semibold text-gray-700">{label}</span>
                  <span className="text-gray-800">{value || "N/A"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 flex justify-center bg-white gap-4">
          <button
            className="w-[200px] h-[50px] rounded-lg bg-[#FEBC1D] text-[#EC2D01] font-semibold text-lg sm:text-xl shadow-md hover:opacity-90"
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