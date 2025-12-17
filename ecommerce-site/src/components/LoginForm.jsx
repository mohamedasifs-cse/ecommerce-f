import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState("login"); // login | register
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const passwordRef = useRef("");

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const password = passwordRef.current.value;

    // Basic validation
    if (mode === "register" && (!name || !email || !password)) {
      setError("Please fill name, email and password");
      return;
    }
    if (mode === "login" && (!email || !password)) {
      setError("Please enter email and password");
      return;
    }

    // Admin shortcut: preserve previous behavior for admin dashboard access
    if (mode === "login" && email === "admin" && password === "admin123") {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("role", "admin");
      sessionStorage.setItem("username", "Admin");
      // Initialize products if not exists (for admin add/edit)
      if (!sessionStorage.getItem("products")) {
        const initialProducts = [
          { id: 1, name: "Premium Shoes", image: "src/images/pro4.jpg", price: "2499", quantity: 0 },
          { id: 2, name: "Comfy Sneakers", image: "src/images/pro3.jpg", price: "1999", quantity: 0 },
          { id: 3, name: "Running Shoes", image: "src/images/pro2.jpg", price: "1499", quantity: 0 },
          { id: 4, name: "Trail Boots", image: "src/images/pro1.jpg", price: "2999", quantity: 0 }
        ];
        sessionStorage.setItem("products", JSON.stringify(initialProducts));
      }
      toast.success("Admin logged in");
      navigate("/admin");
      return;
    }

    const baseUrl = "http://localhost:3000/auth";
    const endpoint = mode === "login" ? "/login" : "/register";
    const body = mode === "login" ? { email, password } : { name, email, password };

    fetch(baseUrl + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg = data?.message || "Request failed";
          throw new Error(msg);
        }
        return data;
      })
      .then((data) => {
        if (mode === "login") {
          const token = data?.token;
          const user = data?.user;
          if (!token) {
            throw new Error("Login failed: token missing");
          }
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("role", user?.role || "user");
          if (user?.name) sessionStorage.setItem("username", user.name);
          // Seed sample orders for demo if absent
          if (!sessionStorage.getItem("orderHistory")) {
            const sampleOrders = [
              {
                id: Date.now(),
                items: [
                  { id: 1, name: "Premium Shoes", image: "src/images/pro4.jpg", price: "2499", quantity: 1 },
                  { id: 3, name: "Running Shoes", image: "src/images/pro2.jpg", price: "1499", quantity: 2 }
                ],
                subtotal: 2499 + 1499 * 2,
                shipping: 49,
                discount: 100,
                total: 2499 + 1499 * 2 + 49 - 100,
                date: new Date().toLocaleDateString()
              },
              {
                id: Date.now() + 1,
                items: [
                  { id: 2, name: "Comfy Sneakers", image: "src/images/pro3.jpg", price: "1999", quantity: 1 }
                ],
                subtotal: 1999,
                shipping: 49,
                discount: 50,
                total: 1999 + 49 - 50,
                date: new Date().toLocaleDateString()
              }
            ];
            sessionStorage.setItem("orderHistory", JSON.stringify(sampleOrders));
          }
          toast.success("Logged in successfully");

          const redirectPath = sessionStorage.getItem("redirectAfterLogin");
          if (redirectPath) {
            sessionStorage.removeItem("redirectAfterLogin");
            navigate(redirectPath);
          } else {
            navigate("/orders");
          }
        } else {
          toast.success("Registered successfully. Please login.");
          setMode("login");
        }
      })
      .catch((e) => {
        setError(e.message);
        toast.error(e.message);
      });
  };

  return (
    <div className="shadow-2xl bg-gray-800 m-auto mt-10 rounded-2xl p-5 w-[400px] text-main">
      <h2 className="text-center font-bold text-[20px] text-main">
        {mode === "login" ? "Login" : "Register"}
      </h2>
      {mode === "register" && (
        <>
          <label className="block accent">Enter name :</label>
          <input
            className="mb-5 w-full border-2 border-gray-700 bg-gray-900 text-main p-2 rounded"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </>
      )}
      <label className="block accent">Enter email :</label>
      <input
        className="mb-5 w-full border-2 border-gray-700 bg-gray-900 text-main p-2 rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleChangeEmail}
        required
      />
      <label className="block accent">Enter password :</label>
      <input
        className="mb-2 w-full border-2 border-gray-700 bg-gray-900 text-main p-2 rounded"
        type="password"
        placeholder="Password"
        ref={passwordRef}
        required
      />
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <button
        className="w-full btn-main rounded-xl p-2"
        onClick={handleSubmit}
      >
        {mode === "login" ? "Login" : "Register"}
      </button>
      <div className="mt-3 text-center">
        {mode === "login" ? (
          <button className="text-blue-400 hover:underline" onClick={() => setMode("register")}>Create an account</button>
        ) : (
          <button className="text-blue-400 hover:underline" onClick={() => setMode("login")}>Already have an account? Login</button>
        )}
      </div>
    </div>
  );
};

export default LoginForm;