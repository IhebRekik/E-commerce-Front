import { useEffect, useState } from "react";

export function SignUp() {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    role: "",
  });


  const [focusedField, setFocusedField] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [company, setCompany] = useState("");
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const [companys, setCompanys] = useState([]);

  // Completion %
  useEffect(() => {

    const fetchCompanies = async () => {
      setIsLoadingCompany(true);
      try {
        const response = await fetch("http://localhost:8080/entreprise/");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCompanys(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setIsLoadingCompany(false);
      }
    };

    fetchCompanies();

    const requiredFields = [
      "userName",
      "password",
      "confirmPassword",
      "firstName",
      "lastName",
      "phone",
      "company",
      "role",
    ];
    const filledFields = requiredFields.filter(
      (field) => formData[field] && formData[field].trim() !== ""
    ).length;
    setCompletionPercentage((filledFields / requiredFields.length) * 100);
  }, [formData]);

  // Password strength
  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName) newErrors.userName = "userName requis";


    if (!formData.firstName) newErrors.firstName = "Prénom requis";
    if (!formData.lastName) newErrors.lastName = "Nom requis";

    if (!formData.password) newErrors.password = "Mot de passe requis";
    else if (formData.password.length < 8)
      newErrors.password = "Au moins 8 caractères";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirmation requise";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mots de passe différents";
    if (!formData.role) newErrors.role = "Rôle requis";
    if (!formData.company) newErrors.company = "Nom de l'entreprise requis";

    if (!formData.phone) newErrors.phone = "Téléphone requis";
    else if (!/^[9425][0-9]{7}$/.test(formData.phone))
      newErrors.phone = "Numéro de téléphone invalide";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const addEntreprise = async () => {
    setIsLoadingCompany(true);
    try {
      const response = await fetch("http://localhost:8080/entreprise/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: company
        }), // send your form data
      });


      if (response.status != 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setCompany("");
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Erreur lors de l\'inscription. Veuillez réessayer.' });
    } finally {
      setIsLoadingCompany(false);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:8080/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: formData.userName,
            motdepass: formData.password,
            prenom: formData.firstName,
            nom: formData.lastName,
            telephone: formData.phone,
            entreprise: formData.company,
            role: formData.role
          }), // send your form data
        });


        if (response.status != 200) {
          if (response.status == 401) {
            const newErrors = {};
            newErrors.userName = "Nom d'utilisateur déjà pris";
            setErrors(newErrors);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const result = await response.body;
          alert(result.message || 'Inscription réussie !');
          window.location.reload();
        }


      } catch (error) {
        console.error('Error:', error);
        setErrors({ submit: 'Erreur lors de l\'inscription. Veuillez réessayer.' });
      } finally {
        setIsLoading(false);
      }
    }
  };


  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 60) return "bg-yellow-500";
    if (passwordStrength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Faible";
    if (passwordStrength < 60) return "Moyen";
    if (passwordStrength < 80) return "Fort";
    return "Très fort";
  };

  return (
    <section className="m-8 flex">
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
          alt="Pattern"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="w-full lg:w-3/5 max-w-lg mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
                Inscription
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Créez votre compte maintenant
              </p>
            </div>

            <div className="relative mb-6">
              <div className="relative">
                <input
                  name="company"
                  type="text"
                  value={company}
                  onChange={(e) => { setCompany(e.target.value); handleInputChange(e); }}
                  onFocus={() => setFocusedField("company")}
                  onBlur={() => setFocusedField("")}
                  className={`block py-4 px-4 w-full text-sm bg-white dark:bg-gray-800 border-2 rounded-xl appearance-none focus:outline-none transition-all duration-300 ${errors.company
                    ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20"
                    : focusedField === "company" || company
                      ? "border-blue-500 text-gray-900 dark:text-white shadow-lg"
                      : "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  aria-invalid={!!errors.userName}
                  aria-describedby={errors.userName ? "userName-error" : undefined}
                />
              </div>
              <label
                className={`text-sm duration-300 transform origin-[0] transition-all pointer-events-none ${errors.company
                  ? "text-red-500 scale-90 dark:bg-gray-900 px-2 left-3"
                  : focusedField === "company" || company
                    ? "text-blue-600 dark:text-blue-400 scale-90 dark:bg-gray-900 px-2 left-3"
                    : "text-gray-500 dark:text-gray-400 left-4"
                  }`}
              >
                Entreprise
              </label>

            </div>
            <button
              onClick={addEntreprise}
              disabled={isLoadingCompany}
              className="w-full bg-gradient-to-r from-purple-600 mb-10 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg disabled:shadow-none"
            >
              {isLoadingCompany ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Création en cours...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Ajouter Entreprise
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>

            {/* userName Input */}
            <div className="relative mb-6">
              <div className="relative">
                <input
                  name="userName"
                  type="text"
                  value={formData.userName}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("userName")}
                  onBlur={() => setFocusedField("")}
                  className={`block py-4 px-4 w-full text-sm bg-white dark:bg-gray-800 border-2 rounded-xl appearance-none focus:outline-none transition-all duration-300 ${errors.userName
                    ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20"
                    : focusedField === "userName" || formData.userName
                      ? "border-blue-500 text-gray-900 dark:text-white shadow-lg"
                      : "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  aria-invalid={!!errors.userName}
                  aria-describedby={errors.userName ? "userName-error" : undefined}
                />
              </div>
              <label
                className={`text-sm duration-300 transform origin-[0] transition-all pointer-events-none ${errors.userName
                  ? "text-red-500 scale-90 dark:bg-gray-900 px-2 left-3"
                  : focusedField === "userName" || formData.userName
                    ? "text-blue-600 dark:text-blue-400 scale-90 dark:bg-gray-900 px-2 left-3"
                    : "text-gray-500 dark:text-gray-400 left-4"
                  }`}
              >
                le nom d'utilisateur *
              </label>
              {errors.userName && (
                <div className="flex items-center mt-2 text-red-500" id="userName-error">
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{errors.userName}</span>
                </div>
              )}
            </div>

            {/* FirstName and LastName Inputs */}
            <div className="grid md:grid-cols-2 md:gap-6">
              {/* FirstName Input */}
              <div className="relative mb-6">
                <div className="relative">
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("firstName")}
                    onBlur={() => setFocusedField("")}
                    className={`block py-4 px-4 w-full text-sm bg-white dark:bg-gray-800 border-2 rounded-xl appearance-none focus:outline-none transition-all duration-300 ${errors.firstName
                      ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20"
                      : focusedField === "firstName" || formData.firstName
                        ? "border-blue-500 text-gray-900 dark:text-white shadow-lg"
                        : "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                    placeholder="Iheb"
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  />
                </div>
                <label
                  className={`text-sm duration-300 transform origin-[0] transition-all pointer-events-none ${errors.firstName
                    ? "text-red-500 scale-90 dark:bg-gray-900 px-2 left-3"
                    : focusedField === "firstName" || formData.firstName
                      ? "text-blue-600 dark:text-blue-400 scale-90 dark:bg-gray-900 px-2 left-3"
                      : "text-gray-500 dark:text-gray-400 left-4"
                    }`}
                >
                  Prénom *
                </label>
                {errors.firstName && (
                  <div className="flex items-center mt-2 text-red-500" id="firstName-error">
                    <svg
                      className="w-4 h-4 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">{errors.firstName}</span>
                  </div>
                )}
              </div>

              {/* LastName Input */}
              <div className="relative mb-6">
                <div className="relative">
                  <input
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("lastName")}
                    onBlur={() => setFocusedField("")}
                    className={`block py-4 px-4 w-full text-sm bg-white dark:bg-gray-800 border-2 rounded-xl appearance-none focus:outline-none transition-all duration-300 ${errors.lastName
                      ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20"
                      : focusedField === "lastName" || formData.lastName
                        ? "border-blue-500 text-gray-900 dark:text-white shadow-lg"
                        : "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                    placeholder="Rekik"
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  />
                </div>
                <label
                  className={`text-sm duration-300 transform origin-[0] transition-all pointer-events-none ${errors.lastName
                    ? "text-red-500 scale-90 dark:bg-gray-900 px-2 left-3"
                    : focusedField === "lastName" || formData.lastName
                      ? "text-blue-600 dark:text-blue-400 scale-90 dark:bg-gray-900 px-2 left-3"
                      : "text-gray-500 dark:text-gray-400 left-4"
                    }`}
                >
                  Nom *
                </label>
                {errors.lastName && (
                  <div className="flex items-center mt-2 text-red-500" id="lastName-error">
                    <svg
                      className="w-4 h-4 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">{errors.lastName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div className="relative mb-6">
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  className={`block py-4 px-4 w-full text-sm bg-white dark:bg-gray-800 border-2 rounded-xl appearance-none focus:outline-none transition-all duration-300 ${errors.password
                    ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20"
                    : focusedField === "password" || formData.password
                      ? "border-blue-500 text-gray-900 dark:text-white shadow-lg"
                      : "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  placeholder=""
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <label
                className={`text-sm duration-300 transform origin-[0] transition-all pointer-events-none ${errors.password
                  ? "text-red-500 scale-90 dark:bg-gray-900 px-2 left-3"
                  : focusedField === "password" || formData.password
                    ? "text-blue-600 dark:text-blue-400 scale-90 dark:bg-gray-900 px-2 left-3"
                    : "text-gray-500 dark:text-gray-400 left-4"
                  }`}
              >
                Mot de passe *
              </label>
              {errors.password && (
                <div className="flex items-center mt-2 text-red-500" id="password-error">
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{errors.password}</span>
                </div>
              )}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Force du mot de passe
                    </span>
                    <span
                      className={`text-xs font-semibold ${passwordStrength < 40
                        ? "text-red-500"
                        : passwordStrength < 60
                          ? "text-yellow-500"
                          : passwordStrength < 80
                            ? "text-blue-500"
                            : "text-green-500"
                        }`}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <p>
                      Utilisez au moins 8 caractères avec des majuscules,
                      minuscules, chiffres et symboles
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="relative mb-6">
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField("")}
                  className={`block py-4 px-4 w-full text-sm bg-white dark:bg-gray-800 border-2 rounded-xl appearance-none focus:outline-none transition-all duration-300 ${errors.confirmPassword
                    ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20"
                    : focusedField === "confirmPassword" || formData.confirmPassword
                      ? "border-blue-500 text-gray-900 dark:text-white shadow-lg"
                      : "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  placeholder=""
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showConfirmPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <label
                className={`text-sm duration-300 transform origin-[0] transition-all pointer-events-none ${errors.confirmPassword
                  ? "text-red-500 scale-90 dark:bg-gray-900 px-2 left-3"
                  : focusedField === "confirmPassword" || formData.confirmPassword
                    ? "text-blue-600 dark:text-blue-400 scale-90 dark:bg-gray-900 px-2 left-3"
                    : "text-gray-500 dark:text-gray-400 left-4"
                  }`}
              >
                Confirmer le mot de passe *
              </label>
              {errors.confirmPassword && (
                <div className="flex items-center mt-2 text-red-500" id="confirmPassword-error">
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* Phone Input */}
            <div className="relative mb-6">
              <div className="relative">
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField("")}
                  className={`block py-4 px-4 w-full text-sm bg-white dark:bg-gray-800 border-2 rounded-xl appearance-none focus:outline-none transition-all duration-300 ${errors.phone
                    ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20"
                    : focusedField === "phone" || formData.phone
                      ? "border-blue-500 text-gray-900 dark:text-white shadow-lg"
                      : "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  placeholder="92126511"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
              </div>
              <label
                className={`text-sm duration-300 transform origin-[0] transition-all pointer-events-none ${errors.phone
                  ? "text-red-500 scale-90 dark:bg-gray-900 px-2 left-3"
                  : focusedField === "phone" || formData.phone
                    ? "text-blue-600 dark:text-blue-400 scale-90 dark:bg-gray-900 px-2 left-3"
                    : "text-gray-500 dark:text-gray-400 left-4"
                  }`}
              >
                Téléphone *
              </label>
              {errors.phone && (
                <div className="flex items-center mt-2 text-red-500" id="phone-error">
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{errors.phone}</span>
                </div>
              )}
            </div>

            {errors.company && (
              <div className="flex items-center mt-2 text-red-500">
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{errors.company}</span>
              </div>
            )}
            <div className="relative mb-6">
              <div className="relative">
                <select name="company" id="company"
                  onFocus={() => setFocusedField("company")}
                  onBlur={() => setFocusedField("")}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className={`block py-4 px-4 w-full text-sm bg-white dark:bg-gray-800 border-2 rounded-xl appearance-none focus:outline-none transition-all duration-300 ${errors.company
                    ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20"
                    : focusedField === "company" || formData.company
                      ? "border-blue-500 text-gray-900 dark:text-white shadow-lg"
                      : "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                    }`}

                  aria-invalid={!!errors.company}
                  aria-describedby={errors.company ? "company-error" : undefined}>
                  <option value="">Select l'entreprise</option>
                  {companys.map((company) => (
                    <option key={company.name} value={company.name}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <label
                className={`text-sm duration-300 transform origin-[0] transition-all pointer-events-none ${errors.phone
                  ? "text-red-500 scale-90 dark:bg-gray-900 px-2 left-3"
                  : focusedField === "phone" || formData.phone
                    ? "text-blue-600 dark:text-blue-400 scale-90 dark:bg-gray-900 px-2 left-3"
                    : "text-gray-500 dark:text-gray-400 left-4"
                  }`}
              >
                Entreprise *
              </label>
              {errors.company && (
                <div className="flex items-center mt-2 text-red-500" id="company-error">
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{errors.company}</span>
                </div>
              )}
            </div>

            {errors.role && (
              <div className="flex items-center mt-2 text-red-500">
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{errors.role}</span>
              </div>
            )}
            <div className="relative mb-6">
              <div className="relative">
                <select name="role" id="role"

                  onFocus={() => setFocusedField("role")}
                  onBlur={() => setFocusedField("")}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={`block py-4 px-4 w-full text-sm bg-white dark:bg-gray-800 border-2 rounded-xl appearance-none focus:outline-none transition-all duration-300 ${errors.role
                    ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20"
                    : focusedField === "role" || formData.role
                      ? "border-blue-500 text-gray-900 dark:text-white shadow-lg"
                      : "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-500"
                    }`}

                  aria-invalid={!!errors.role}
                  aria-describedby={errors.role ? "role-error" : undefined}>
                  <option value="">Select your role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

              </div>
              <label
                className={`text-sm duration-300 transform origin-[0] transition-all pointer-events-none ${errors.role
                  ? "text-red-500 scale-90 dark:bg-gray-900 px-2 left-3"
                  : focusedField === "role" || formData.role
                    ? "text-blue-600 dark:text-blue-400 scale-90 dark:bg-gray-900 px-2 left-3"
                    : "text-gray-500 dark:text-gray-400 left-4"
                  }`}
              >
                Role *
              </label>
              {errors.role && (
                <div className="flex items-center mt-2 text-red-500" id="role-error">
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{errors.sub}</span>
                </div>
              )}
            </div>

            {errors.submit && (
              <div className="flex items-center mt-2 text-red-500">
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{errors.submit}</span>
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Création en cours...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Créer mon compte
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;