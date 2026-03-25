import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [expertise, setExpertise] = useState('');
    const [bio, setBio] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const registerData = { username, email, password, role, expertise, bio };

        try {
            const response = await axios.post(
                import.meta.env.VITE_API_URL + "/auth/register",
                registerData
            );

            toast.success(response.data?.message || "Registration successful!");
            navigate("/login");
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Registration failed. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                <form className="space-y-4" onSubmit={handleRegister}>
                    <div>
                        <label className="block text-gray-700">Username</label>
                        <input onChange={(e)=>setUsername(e.target.value)} type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter your username" />
                    </div>
                    <div>               
                        <label className="block text-gray-700">Email</label>
                        <input onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full px-3 py-2 border rounded" placeholder="Enter your email" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full px-3 py-2 border rounded" placeholder="Enter your password" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Role</label>
                        <select onChange={(e)=>setRole(e.target.value)} className="w-full px-3 py-2 border rounded">
                            <option value="user">User</option>
                            <option value="mentor">Mentor</option>
                        </select>
                    </div>
                    {role === "mentor" && (
                        <>
                            <div>
                                <label className="block text-gray-700">Expertise</label>
                                <input onChange={(e)=>setExpertise(e.target.value)} type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter your expertise" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Bio</label>
                                <textarea onChange={(e)=>setBio(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Enter your bio"></textarea>
                            </div>
                        </>
                    )}
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">Register</button>
                    
                    <p className="text-sm text-gray-600 text-center mt-4">
                        Already have an account?{' '}
                     <Link to="/login">
                        <span className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                          Sign in
                          </span>
                     </Link>
                    </p>
                
                </form>
            </div>
        </div>
    );
}