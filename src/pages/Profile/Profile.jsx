import { useNavigate } from "react-router-dom"; 
import { useGetAdminProfileQuery } from "../../redux/apis/authApi";
import { BsArrowLeftCircle } from "react-icons/bs";
import { FaUpload } from "react-icons/fa";  // ✅ Correct import

const Profile = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAdminProfileQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching profile</div>;

  const user = data?.admin;

  // ✅ Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      // TODO: Upload API call can be added here
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6 min-h-screen relative">
      {/* Back Header */}
      <div className="flex items-center mb-4 bg-white p-4 md:p-5 rounded shadow">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <BsArrowLeftCircle
              size={25}
              className="text-gray-700 md:text-black"
            />
          </button>
          <h2 className="text-lg md:text-xl font-semibold">Profile</h2>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-white p-6 rounded shadow min-h-[500px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-4">
            <ReadOnlyField label="Full Name" value={user?.fullName} />
            <ReadOnlyField label="Username" value={user?.userName} />
            <ReadOnlyField label="Gender" value={user?.gender} />
            <ReadOnlyField label="Email" value={user?.email} />
            <ReadOnlyField label="Phone" value={user?.phoneNumber} />

            
          </div>

          {/* Profile Image */}
          <div className="flex flex-col items-center justify-start">
            <img
              src={user?.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="rounded-full w-32 h-32 object-cover mb-3"
            />
            <label className="flex items-center bg-yellow-400 hover:bg-yellow-500 text-red-600 font-semibold px-4 py-2 rounded-md cursor-pointer transition-colors duration-200">
              <FaUpload className="mr-2" />  {/* ✅ Icon will now work */}
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <div className="flex justify-center">
              <button
                onClick={() => navigate("/profile/edit")}
                className="bg-yellow-400 hover:bg-yellow-500 text-red-600 font-semibold px-6 py-2 rounded-md mt-4"
              >
                Edit Profile
              </button>
            </div>
      </div>
    </div>
  );
};

const ReadOnlyField = ({ label, value }) => (
  <div className="flex items-center gap-4">
    <label className="w-32 font-medium">{label}</label>
    <input
      type="text"
      value={value || ""}
      disabled
      className="flex-1 px-3 py-1 border border-gray-300 rounded-md bg-white cursor-not-allowed"
    />
  </div>
);

export default Profile;
