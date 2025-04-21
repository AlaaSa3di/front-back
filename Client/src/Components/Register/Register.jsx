import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../images/log.png";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^07[0-9]{8}$/;

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email address";

    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!phoneRegex.test(formData.phoneNumber)) newErrors.phoneNumber = "Please enter a valid phone number";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      });
      navigate("/");
    } catch (error) {
      let errorMessage = "An error occurred during registration";
      if (error.response?.status === 400) {
        errorMessage = error.response.data.message || "Validation failed";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later";
      }
      setErrors({ server: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F1F1F1] overflow-hidden">
      <div
        className="hidden lg:flex lg:w-1/2 relative"
        style={{
          background: "linear-gradient(135deg, #21209C 0%, #23120B 100%)",
          backgroundImage: "url('https://png.pngtree.com/background/20210709/original/pngtree-black-simple-atmosphere-halo-picture-image_965040.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-8 left-8 z-10 flex items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="SpotFlash" className="h-16" />
          </Link>
        </div>
        <div className="absolute bottom-24 left-8 right-8 text-white z-10">
          <h1 className="text-4xl font-bold mb-4">
            Step Into the Future of <span style={{ color: "#FDB827" }}>Digital Advertising!</span>
          </h1>
          <p className="mb-6 text-lg">
            The top platform for renting premium digital billboard ad spaces!
            Whether you're an advertiser or a screen owner, you're in the right place!
          </p>
        </div>
      </div>

      <div className="w-full md:w-3/5 flex flex-col p-4 md:p-0">
        <div className="max-w-md mx-auto w-full px-4 md:px-0 flex flex-col justify-center h-full">
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-2 text-[#23120B]">Create your account</h1>
            <p className="text-xs text-[#23120B]/70">Begin your cosmic journey with ExploreMe</p>
          </div>

          {errors.server && (
            <div className="p-3 mb-4 text-xs text-[#23120B] bg-red-100 rounded-lg border-l-4 border-red-500" role="alert">
              <p className="font-medium">Registration Error</p>
              <p>{errors.server}</p>
            </div>
          )}

          <form className="space-y-3" onSubmit={handleSubmit}>
            {["fullName", "email", "phoneNumber"].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-xs font-medium text-[#23120B]/80 mb-1">
                  {field === "fullName" ? "Full Name" : field === "email" ? "Email Address" : "Phone Number"}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field === "email" ? "email" : field === "phoneNumber" ? "tel" : "text"}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors[field] ? "border-red-500" : "border-[#23120B]/20"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21209C] focus:border-[#21209C] bg-white text-sm`}
                  placeholder={`Enter your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                />
                {errors[field] && <p className="mt-1 text-xs text-red-500">{errors[field]}</p>}
              </div>
            ))}

            {["password", "confirmPassword"].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-xs font-medium text-[#23120B]/80 mb-1">
                  {field === "password" ? "Password" : "Confirm Password"}
                </label>
                <div className="relative">
                  <input
                    id={field}
                    name={field}
                    type={
                      field === "password"
                        ? showPassword ? "text" : "password"
                        : showConfirmPassword ? "text" : "password"
                    }
                    value={formData[field]}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors[field] ? "border-red-500" : "border-[#23120B]/20"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21209C] focus:border-[#21209C] bg-white text-sm`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-[#23120B]/60 hover:text-[#23120B]"
                    onClick={() => field === "password"
                      ? setShowPassword(!showPassword)
                      : setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {field === "password"
                      ? showPassword ? <EyeOff size={16} /> : <Eye size={16} />
                      : showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors[field] && <p className="mt-1 text-xs text-red-500">{errors[field]}</p>}
              </div>
            ))}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 text-black font-medium rounded-lg transition ${
                  isSubmitting ? "bg-gray-400" : "bg-[#FDB827] hover:bg-[#F26B0F]/90"
                } focus:ring-4 focus:ring-[#21209C]/30 text-sm`}
              >
                {isSubmitting ? "Processing..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <p className="text-xs text-[#23120B]/70">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-[#21209C] hover:text-[#21209C]/80">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
