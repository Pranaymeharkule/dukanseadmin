import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  useForgotPasswordMutation,
  useLoginAdminMutation,
  useVerifyOtpMutation,
} from "../../redux/apis/authApi";
import { loginSuccess } from "../../redux/slices/authSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [open, setOpen] = useState(false);

  const otpRefs = useRef([]);

  const [loginAdmin, { isLoading }] = useLoginAdminMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const [verifyOtp] = useVerifyOtpMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password required");
      return;
    }

    try {
      const res = await loginAdmin({ email, password }).unwrap();
      dispatch(loginSuccess({ admin: res.admin, token: res.token }));
      toast.success("Login Successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
      console.error("Login error:", err);
    }
  };

  const handleForgetPassword = async () => {
    if (!email) {
      toast.error("Enter the email");
      return;
    }

    try {
      await forgotPassword(email).unwrap();
      toast.success("OTP sent to your email");
      setOpen(true);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send OTP");
      console.error("Forgot Password Error:", err);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) otpRefs.current[index + 1]?.focus();
    if (!value && index > 0) otpRefs.current[index - 1]?.focus();
  };
  const handleOtpVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      toast.error("Enter the full 4-digit OTP");
      return;
    }

    try {
      console.log("Verifying OTP with:", { email, otp: enteredOtp });
      const res = await verifyOtp({ email, otp: enteredOtp }).unwrap();
      toast.success("OTP verified");
      navigate("/reset", { state: { email } });
    } catch (err) {
      console.error("OTP Verify Error:", err);
      toast.error(err?.data?.message || "Invalid OTP");
    }
  };


  return (
    <div className="min-h-screen bg-brandYellow flex items-center justify-center px-4 relative">
      <div className="bg-white rounded-lg shadow-xl md:p-12 w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-6">
          {/* Logo */}
          <div className="mb-2 flex items-center justify-center">
            <img
              src={logo}
              alt="Dukaandi Logo"
              className="w-40 h-16 object-contain rounded-lg"
            />
          </div>

          {/* Title */}
          <h2 className="text-center text-lg font-semibold mb-2 text-gray-900">
            Dukaan Se Admin
          </h2>

          {/* Subtitle */}
          <p className="text-center text-[13px] text-gray-600 mb-2 font-bold">
            Please Log In To Your Account
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Enter Your Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FEBC1D]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="•••••••••"
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FEBC1D]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 bottom-2.5 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 font-semibold">Remember Me</span>
            <label
              htmlFor="rememberMe"
              className="relative inline-flex items-center cursor-pointer w-10 h-6"
            >
              <input type="checkbox" id="rememberMe" className="sr-only peer" />
              <div className="w-10 h-6 bg-gray-100 rounded-full peer-checked:bg-[#FEBC1D] transition-colors duration-300 ease-in-out z-10"></div>
              <div className="absolute top-1 left-1 w-4 h-4 bg-red-500 rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-4 z-20"></div>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brandYellow hover:bg-[#fcb100] text-brandRed font-semibold py-2 rounded-md transition"
          >
            {isLoading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <button
          onClick={handleForgetPassword}
          className="w-full mt-4 border border-red-600 text-red-600 hover:bg-orange-50 font-semibold py-2 rounded-md transition"
        >
          Forgot Password
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-[400px] border relative">
            <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-orange-300 to-yellow-400 blur-[1.5px] z-[-1]" />
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
              Verify Code
            </h2>
            <div className="text-center mb-5">
              <p className="text-sm text-gray-600">
                Please enter the code we just sent to email
              </p>
              <p className="text-sm text-blue-600 font-medium">{email}</p>
            </div>
            <div className="flex justify-center gap-3 mb-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength="1"
                  ref={(el) => (otpRefs.current[i] = el)}
                  className="w-12 h-12 rounded-lg border border-gray-300 text-center text-xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FEBC1D]"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-600 mb-5">
              Didn’t receive the code?{" "}
              <span className="text-red-500 font-semibold cursor-pointer hover:underline">
                Resend
              </span>
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setOpen(false)}
                className="w-1/2 border border-red-500 text-red-600 font-medium py-2 rounded-md hover:bg-red-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleOtpVerify}
                className="w-1/2 bg-[#FEBC1D] text-brandRed font-semibold py-2 rounded-md hover:opacity-90 transition"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
