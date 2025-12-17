import { Link } from "react-router-dom";

const Header = () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true" || !!sessionStorage.getItem("token");
  const name = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("role");
  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("role");
    window.location.href = "/";
  };
  return (
    <header className="bg-main text-main shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* <div className="bg-white text-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              H
            </div> */}
            <span className="text-2xl font-bold tracking-wide group-hover:text-gray-200 transition-colors">
              Factory LOT
            </span>
          </Link>

          {/* Navigation Links */}
          <ul className="flex items-center space-x-8">
            <li>
              <Link
                to="/"
                className="hover:text-gray-300 transition-colors font-medium hover:scale-105 transform inline-block"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="hover:text-gray-300 transition-colors font-medium hover:scale-105 transform inline-block"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                className="hover:text-gray-300 transition-colors font-medium hover:scale-105 transform inline-block"
              >
                Orders
              </Link>
            </li>
            {role === "admin" && (
              <li>
                <Link
                  to="/admin-panel"
                  className="hover:text-gray-300 transition-colors font-medium hover:scale-105 transform inline-block"
                >
                  Admin Panel
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/cart"
                className="btn-main shadow-md hover:shadow-lg"
              >
                Cart
              </Link>
            </li>
            {isLoggedIn ? (
              <li className="flex items-center gap-3">
                <span className="text-sm">{role === "admin" ? "Admin" : name || "User"}</span>
                <button
                  onClick={handleLogout}
                  className="border-2 border-gray-400 px-4 py-2 rounded-lg font-semibold hover:bg-main hover:text-white transition-all duration-300"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="border-2 border-gray-400 px-4 py-2 rounded-lg font-semibold hover:bg-main hover:text-white transition-all duration-300"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
