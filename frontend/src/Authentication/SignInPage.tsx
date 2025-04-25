import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:2507";

interface SignInForm {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

const SignIn: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<SignInForm>();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: SignInForm) => {
  try {
    const response = await axios.post<AuthResponse>(
      `${backendURL}/api/signin`,
      data,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // This is correct for cookies
      }
    );

    console.log("Login successful - Response:", response);
  
    navigate("/");
  } catch (error: any) {
    console.error("Full error:", error);
    console.error("Error response:", error.response);
    setErrorMessage(error.response?.data?.error || "Login failed. Try again.");
  }
};

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Sign In
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-500 hover:underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
