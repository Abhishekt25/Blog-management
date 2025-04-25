import { useState } from "react";
import {useForm} from "react-hook-form";
import {Link , useNavigate} from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

interface SignUpForm {
    name: string;
    email: string;
    password: string;
}
interface AuthResponse {
    token: string;
}

const SignUpForm:React.FC = () => {

    const [errorMessage, setErrorMessage] = useState<string |null>(null);
    const {register, handleSubmit,  formState: { errors }} = useForm<SignUpForm>();
    const [showPassword, setShowPassword]= useState(false);
    const navigate = useNavigate(); 
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:2507";

    const onSubmit = async (data:SignUpForm)=>{
        console.log("Submitting data", data);

        try{
            const response = await axios.post<AuthResponse>(
                `${backendURL}/api/signup`,
                data,
                {
                  headers: { "Content-Type": "application/json" }
                }
              );

            console.log("Signup successful:", response.data);
            localStorage.setItem("token", response.data.token);
             navigate("/signin");

        }catch (error:any){
            console.error("Registration error:", error.response?.data || error.message);
            setErrorMessage(error.response?.data?.message || "Registration failed. Try again.");
        }
    }
    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-96 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
            {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div>
                <label className="block text-sm font-medium">Name</label>
                <input type="text" className="w-full p-2 border rounded mt-1" {...register("name", { required: "Name is required" })} />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
            
            <div className="mt-3">
                <label className="block text-sm font-medium">Email</label>
                <input type="email" className="w-full p-2 border rounded mt-1" {...register("email", { required: "Email is required" })} />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div className="mt-3 relative" >
                <label className="block text-sm font-medium">Password</label>
                <input type={showPassword ? "text" : "password"} className="w-full p-2 border rounded mt-1" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-9 text-gray-600 hover:text-gray-900"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            </div>

            <button type="submit" className="w-full mt-4 p-2 bg-blue-500 text-white rounded">
                Sign Up
            </button>
            </form>

            <div className="flex justify-between mt-4 text-sm">
                <Link to="/signin" className="text-blue-500 hover:underline">Already have an account? Sign In</Link>
                <Link to="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
            </div>
            </div>
        </div>
    )
}

export default SignUpForm;