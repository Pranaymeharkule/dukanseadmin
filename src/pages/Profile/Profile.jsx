import { useNavigate } from "react-router-dom";
import { useGetAdminProfileQuery } from "../../redux/apis/authApi";

const Profile = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAdminProfileQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching profile</div>;

  const user = data?.admin;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-semibold mb-5">Admin Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-4">
            <ReadOnlyField label="Full Name" value={user?.fullName} />
            <ReadOnlyField label="Username" value={user?.userName} />
            <ReadOnlyField label="Gender" value={user?.gender} />
            <ReadOnlyField label="Email" value={user?.email} />
            <ReadOnlyField label="Phone" value={user?.phoneNumber} />

            <button
              onClick={() => navigate("/profile/edit")}
              className="bg-yellow-400 hover:bg-yellow-500 text-red-600 font-semibold px-4 py-2 rounded-md mt-4"
            >
              Edit Profile
            </button>
          </div>

          {/* Profile Image */}
          <div className="flex flex-col items-center justify-start">
            <img
              src={user.profileImage}
              alt="Profile"
              className="rounded-full w-32 h-32 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ReadOnlyField = ({ label, value }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input
      type="text"
      value={value}
      disabled
      className="w-full px-3 py-1 border rounded-md bg-gray-100 cursor-not-allowed"
    />
  </div>
);

export default Profile;
