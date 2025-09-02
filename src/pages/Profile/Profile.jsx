import { useNavigate } from "react-router-dom";
import { useGetAdminProfileQuery } from "../../redux/apis/authApi";

const Profile = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAdminProfileQuery();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error fetching profile
      </div>
    );

  const user = data?.admin;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className=" mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          Admin Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-5">
            <ReadOnlyField label="Full Name" value={user?.fullName} />
            <ReadOnlyField label="Username" value={user?.userName} />
            <ReadOnlyField label="Gender" value={user?.gender} />
            <ReadOnlyField label="Email" value={user?.email} />
            <ReadOnlyField label="Phone" value={user?.phoneNumber} />

            <button
              onClick={() => navigate("/profile/edit")}
              className=" w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-red-700 font-semibold px-5 py-2 rounded-lg shadow transition-all duration-200 transform hover:-translate-y-1"
            >
              Edit Profile
            </button>
          </div>

          {/* Profile Image */}
          <div className="flex flex-col items-center justify-start">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-yellow-400 shadow-md">
              <img
                src={user?.profileImage || "/default-profile.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReadOnlyField = ({ label, value }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      type="text"
      value={value || ""}
      disabled
      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
  </div>
);

export default Profile;
