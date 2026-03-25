import React, { useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  // State variables for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // පිටුව Refresh වෙන එක නවත්වන්න
    
    const loginData = { email, password };
    console.log("Login Data ready to send to backend:", loginData);
    
    axios.post(import.meta.env.VITE_API_URL + "/auth/login", loginData)
      .then(response => {
        console.log("Login successful:", response.data);
        localStorage.setItem("token", response.data.token); // Save token to localStorage
        
        toast.success("Login successful!"); // Show success toast
        

        if(response.data.user.role === "admin") {
          navigate("/admin"); // Redirect to admin dashboard
        }else if (response.data.user.role === "mentor") {
          navigate("/mentor/dashboard"); // Redirect to mentor dashboard
        }else{
          navigate("/"); // Redirect to user page
        }
      })
      .catch(error => {
        
        toast.error(error.response.data.message || "Login failed. Please try again."); // Show error toast
        
      });
  };
  
  return (
    // Container
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Form Card */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-[350px]">
        
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          
          {/* Email Input Group */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2.5 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Password Input Group */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2.5 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Forget Password Link */}
          <p className="text-sm text-blue-600 hover:text-blue-800 text-right cursor-pointer font-medium mt-1">
            Forgot Password?
          </p>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="mt-2 p-2.5 bg-blue-600 text-white rounded font-bold text-base hover:bg-blue-700 transition-colors duration-200"
          >
            Login
          </button>

          <p className="text-sm text-gray-600 text-center mt-4">
            Don't have an account?{' '}
            <span className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;



//supabase credentials
//https://ixytspnfduqnpftuuadg.supabase.co
//S@vidu200374
//public-anonymous-key-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4eXRzcG5mZHVxbnBmdHV1YWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzg0NjQsImV4cCI6MjA4OTk1NDQ2NH0.tUMKNBc94QyDk6fszBgR314O6grGmYdO1xlAPlzkGW0