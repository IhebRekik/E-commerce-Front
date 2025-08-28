// src/components/SignIn.jsx
import { loginUser } from "@/Api/Auth";
import { EyeSlashIcon } from "@heroicons/react/24/solid";
import { EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SignIn() {
  const nav = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [focusedField, setFocusedField] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    if(localStorage.getItem("token")) {
      nav("../../dashboard");
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email requis";


    if (!formData.password) newErrors.password = "Mot de passe requis";
    else if (formData.password.length < 8) newErrors.password = "Au moins 8 caractères";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async () => {
  if (!validateForm()) return;

  setIsLoading(true);

  const result = await loginUser(formData.email, formData.password);

  if (!result.success) {
    setErrors({ submit: result.message });
    setIsLoading(false);
    return;
  }

  // Wait for the token to exist
  const interval = setInterval(() => {
    const token = localStorage.getItem("token");
    if (token) {
      clearInterval(interval);
      setIsLoading(false); // stop loading after token is found
      nav("../../dashboard"); // navigate once token exists
    }
  }, 100);
};


  return (
    <section className="m-8 flex">
      <div className="w-2/5 h-full hidden lg:block">
        <img src="/img/pattern.png" className="h-full w-full object-cover rounded-3xl" alt="Pattern" />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="w-full lg:w-3/5 max-w-lg mx-auto ">
         <form className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 max-w-md mx-auto">
  <div className="text-center mb-8">
    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
      Connexion
    </h2>
    <p className={`text-lg ${errors.submit ? "text-red-500" : "text-gray-600 dark:text-gray-400"}`}>
      {errors.submit ? errors.submit : "Connectez-vous à votre compte"}
    </p>
  </div>

  {/* Email */}
  <div className="relative mb-6">
    <input
      name="email"
      type="text"
      value={formData.email}
      onChange={handleInputChange}
      onFocus={() => setFocusedField("email")}
      onBlur={() => setFocusedField("")}
      placeholder=" "
      className={`block w-full px-4 pt-5 pb-2 text-sm bg-white dark:bg-gray-800 border-2 rounded-xl appearance-none focus:outline-none transition-all duration-300
        ${errors.email
          ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20"
          : focusedField === "email" || formData.email
          ? "border-blue-500 text-gray-900 dark:text-white shadow-lg"
          : "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
        }`}
    />
    <label
      className={`absolute left-4 text-sm duration-300 pointer-events-none transform origin-left
        ${focusedField === "email" || formData.email
          ? "-translate-y-3 scale-90 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 px-1"
          : "translate-y-1/2 text-gray-500 dark:text-gray-400"
        }`}
    >
      Adresse email *
    </label>
  </div>

  {/* Password */}
  <div className="relative mb-6 mt-10">
    <input
      name="password"
      type={showPassword ? "text" : "password"}
      value={formData.password}
      onChange={handleInputChange}
      onFocus={() => setFocusedField("password")}
      onBlur={() => setFocusedField("")}
      placeholder=" "
      className={`block w-full px-4 pt-5 pb-2 text-sm bg-white dark:bg-gray-800 border-2 rounded-xl appearance-none focus:outline-none transition-all duration-300
        ${errors.password
          ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20"
          : focusedField === "password" || formData.password
          ? "border-blue-500 text-gray-900 dark:text-white shadow-lg"
          : "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
        }`}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
    >
      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
    </button>
    <label
      className={`absolute left-4 text-sm duration-300 pointer-events-none transform origin-left
        ${focusedField === "password" || formData.password
          ? "-translate-y-3 scale-90 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 px-1"
          : "translate-y-1/2 text-gray-500 dark:text-gray-400"
        }`}
    >
      Mot de passe *
    </label>
  </div>

  {/* Submit button */}
  <button
    onClick={handleSubmit}
    disabled={isLoading}
    className="w-full bg-gradient-to-r mt-5 from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg disabled:shadow-none"
  >
    {isLoading ? "Connexion en cours..." : "Se connecter"}
  </button>
</form>

        </div>
      </div>
    </section>
  );
}

export default SignIn;
