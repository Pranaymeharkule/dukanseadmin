import { useNavigate, useParams } from "react-router-dom";
import { BsArrowLeftCircle } from "react-icons/bs";
import { useGetProductByIdQuery } from "../../redux/apis/productApi";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const { data, isLoading, isError } = useGetProductByIdQuery(id, {
    refetchOnMountOrArgChange: true, 
  });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Failed to fetch product.</div>;

  const product = data?.product;

  return (
    <div className=" bg-gray-100 ">
      {/* Header */}
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-md sticky top-0 z-0 flex items-center space-x-2">
        <BsArrowLeftCircle
          className="text-2xl cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="text-xl font-semibold">Product Detail</h2>
      </div>

      {/* Product Card */}
      <div className=" overflow-x-auto scrollbar-thin  bg-white mt-2 p-2 rounded shadow">
        <div className="max-h-[440px] min-w-[800px]">
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
          <div className="text-sm font-medium text-white bg-yellow-500 w-fit px-3 py-1 mt-2 rounded">
            Price: ₹ {product?.price}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-1 gap-5 mt-4 text-sm text-gray-800">
            <p className="flex">
              <span className="w-48 font-semibold">Pack Of:</span>
              <span>{product?.productDetails?.packOf}</span>
            </p>
            <p className="flex">
              <span className="w-48 font-semibold">Brand:</span>
              <span>{product.brand}</span>
            </p>
            <p className="flex">
              <span className="w-48 font-semibold">Type:</span>
              <span>{product.productType}</span>
            </p>
            <p className="flex">
              <span className="w-48 font-semibold">Net Weight:</span>
              <span>{product?.productDetails?.netWeight}</span>
            </p>
            <p className="flex">
              <span className="w-48 font-semibold">Maximum Shelf Life:</span>
              <span>{product?.productDetails?.shelfLife}</span>
            </p>
            <p className="flex">
              <span className="w-48 font-semibold">Nutrient Content:</span>
              <span>{product?.productDetails?.nutrientContent}</span>
            </p>
            <p className="flex">
              <span className="w-48 font-semibold">Description:</span>
              <span>{product?.productDetails?.productDescription}</span>
            </p>
          </div>
        </div>
      </div>
      {/* Edit Button */}
      <div className="bg-white px-2 py-2  sticky bottom-0 z-8 flex justify-center ">
        <button
          className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
          onClick={() => navigate(`/product/detail/edit/${id}`)}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
