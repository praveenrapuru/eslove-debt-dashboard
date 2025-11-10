import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // setError('');
    try {
      const user = login(email, password);
      if (user.role === "ADMIN") {
        navigate("/dashboard");
      } else if (user.role === "AGENT") {
        navigate("/agent-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-80">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-4">
          <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="flex items-center mt-1 text-sm">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-1"
              />
              Show password
            </label>
          </div>
          <button className="bg-blue-600 text-white w-full py-2 rounded">Login</button>
        </form>

        <div className="bg-gray-100 rounded p-3 text-sm text-gray-600">
          <p className="font-semibold mb-1">Test accounts:</p>
          <p>Admin: admin@demo.com</p>
          <p>Password: admin</p>
          <p>Agent: agent@demo.com</p>
          <p>Password: agent</p>
        </div>
      </div>
    </div>
  );
}
