import { useState, useEffect } from "react";
import axios from "axios";


const API_URL = "https://mvc-production-b35d.up.railway.app";

function App() {
  // ================= AUTH STATE =================

  const [authMode, setAuthMode] = useState("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // ================= PRODUCT STATE =================

  const [newProductInfo, setNewProductInfo] = useState({
    id: "",
    name: "",
    price: "",
    desc: "",
    imageUrl: "",
  });

  const [productId, setProductId] = useState("");

  const [products, setProducts] = useState([]);

  // ================= SIGNUP =================

  async function signupUser(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/user/signup`,
        {
          username,
          password,
        }
      );

      alert(response.data.message || "Signup successful!");

      // Clear form
      setUsername("");
      setPassword("");

      // Login page show
      setAuthMode("login");
    } catch (error) {
      console.log("Signup Error:", error);

      console.log(
        "Server Response:",
        error.response?.data
      );

      alert(
        error.response?.data?.error ||
          "Signup failed"
      );
    }
  }

  // ================= LOGIN =================

  async function loginUser(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/user/login`,
        {
          username,
          password,
        }
      );

      // Save JWT token
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Login successful
      setIsLoggedIn(true);

      // Clear login form
      setUsername("");
      setPassword("");

      alert("Login successful!");
    } catch (error) {
      console.log("Login Error:", error);

      console.log(
        "Server Response:",
        error.response?.data
      );

      alert(
        error.response?.data?.error ||
          "Login failed"
      );
    }
  }

  // ================= LOGOUT =================

  function logoutUser() {
    localStorage.removeItem("token");

    setIsLoggedIn(false);

    // Clear products
    setProducts([]);

    // Clear product form
    setNewProductInfo({
      id: "",
      name: "",
      price: "",
      desc: "",
      imageUrl: "",
    });

    setProductId("");
  }

  // ================= PRODUCT INPUT =================

  function handleIDChange(e) {
    setProductId(e.target.value);
  }

  function handleProductInfoChange(e) {
    setNewProductInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  // ================= GET PRODUCTS =================

  async function fetchProducts() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setProducts([]);
        return;
      }

      const response = await axios.get(
        `${API_URL}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(response.data);

      console.log(
        "Products:",
        response.data
      );
    } catch (error) {
      console.log(
        "Error fetching products:",
        error
      );

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        logoutUser();
      }
    }
  }

  // ================= FETCH AFTER LOGIN =================

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [isLoggedIn]);

  // ================= ADD PRODUCT =================

  async function addProduct(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/products`,
        {
          id: productId,
          name: newProductInfo.name,
          price: newProductInfo.price,
          desc: newProductInfo.desc,
          imageUrl: newProductInfo.imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Product added:",
        response.data
      );

      alert("Product added successfully!");

      // Clear form
      setNewProductInfo({
        id: "",
        name: "",
        price: "",
        desc: "",
        imageUrl: "",
      });

      setProductId("");

      // Refresh products
      fetchProducts();
    } catch (error) {
      console.log(
        "Error adding product:",
        error
      );

      if (error.response?.status === 401) {
        alert(
          "Session expired. Please login again."
        );

        logoutUser();
      } else {
        alert(
          error.response?.data?.error ||
            "Error adding product"
        );
      }
    }
  }

  // ================= UPDATE PRODUCT =================

  async function updateProduct(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await axios.put(
        `${API_URL}/products/${newProductInfo.id}`,
        {
          name: newProductInfo.name,
          price: newProductInfo.price,
          desc: newProductInfo.desc,
          imageUrl: newProductInfo.imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Product updated:",
        response.data
      );

      alert("Product updated successfully!");

      // Clear form
      setNewProductInfo({
        id: "",
        name: "",
        price: "",
        desc: "",
        imageUrl: "",
      });

      setProductId("");

      // Refresh products
      fetchProducts();
    } catch (error) {
      console.log(
        "Error updating product:",
        error
      );

      if (error.response?.status === 401) {
        alert(
          "Session expired. Please login again."
        );

        logoutUser();
      } else {
        alert(
          error.response?.data?.error ||
            "Error updating product"
        );
      }
    }
  }

  // ================= DELETE PRODUCT =================

  async function deleteProduct(id) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Product deleted:",
        response.data
      );

      alert("Product deleted successfully!");

      // Refresh products
      fetchProducts();
    } catch (error) {
      console.log(
        "Error deleting product:",
        error
      );

      if (error.response?.status === 401) {
        alert(
          "Session expired. Please login again."
        );

        logoutUser();
      } else {
        alert(
          error.response?.data?.error ||
            "Error deleting product"
        );
      }
    }
  }

  // ================= EDIT PRODUCT =================

  function loadProductForEdit(product) {
    setNewProductInfo({
      id: product.id,
      name: product.name,
      price: product.price,
      desc: product.desc || "",
      imageUrl: product.imageUrl || "",
    });

    setProductId(product.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ================= CANCEL EDIT =================

  function cancelEdit() {
    setNewProductInfo({
      id: "",
      name: "",
      price: "",
      desc: "",
      imageUrl: "",
    });

    setProductId("");
  }

  const isEditing = !!newProductInfo.id;

  // =================================================
  // ===================== UI =========================
  // =================================================

  return (
    <div className="min-h-screen bg-gray-100 py-10">

      {/* =================================================
          LOGIN / SIGNUP PAGE
      ================================================= */}

      {!isLoggedIn ? (
        <div className="w-full max-w-md mx-auto">

          <form
            onSubmit={
              authMode === "login"
                ? loginUser
                : signupUser
            }
            className="p-6 bg-white shadow-md rounded-lg"
          >

            <h2 className="text-2xl font-bold mb-5 text-center">
              {authMode === "login"
                ? "Login"
                : "Signup"}
            </h2>

            {/* Username */}

            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Password */}

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Submit */}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              {authMode === "login"
                ? "Login"
                : "Signup"}
            </button>

            {/* Switch Login / Signup */}

            <div className="text-center mt-4">

              {authMode === "login" ? (
                <p>
                  Don't have an account?{" "}

                  <button
                    type="button"
                    onClick={() =>
                      setAuthMode("signup")
                    }
                    className="text-blue-500 font-semibold"
                  >
                    Signup
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}

                  <button
                    type="button"
                    onClick={() =>
                      setAuthMode("login")
                    }
                    className="text-blue-500 font-semibold"
                  >
                    Login
                  </button>
                </p>
              )}

            </div>

          </form>
        </div>
      ) : (

        /* =================================================
           PRODUCT PAGE
        ================================================= */

        <div className="w-full">

          {/* Logout */}

          <div className="w-full max-w-md mx-auto mb-5">

            <button
              onClick={logoutUser}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>

          </div>

          {/* Add / Update Product Form */}

          <form
            onSubmit={
              isEditing
                ? updateProduct
                : addProduct
            }
            className="w-full max-w-md mx-auto p-6 bg-white shadow-md rounded-lg"
          >

            <h2 className="text-2xl font-bold mb-5 text-center">
              {isEditing
                ? "Update Product"
                : "Add Product"}
            </h2>

            {/* Product ID */}

            <input
              type="text"
              name="id"
              value={productId}
              placeholder="Enter Product ID"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleIDChange}
              disabled={isEditing}
              required
            />

            {/* Product Name */}

            <input
              type="text"
              name="name"
              value={newProductInfo.name}
              placeholder="Enter Product Name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleProductInfoChange}
              required
            />

            {/* Image URL */}

            <input
              type="text"
              name="imageUrl"
              value={newProductInfo.imageUrl}
              placeholder="Enter Image URL"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleProductInfoChange}
            />

            {/* Price */}

            <input
              type="number"
              name="price"
              value={newProductInfo.price}
              placeholder="Enter Price"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleProductInfoChange}
              required
            />

            {/* Description */}

            <textarea
              name="desc"
              value={newProductInfo.desc}
              placeholder="Enter Description"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleProductInfoChange}
            />

            {/* Submit */}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              {isEditing
                ? "Update Product"
                : "Add Product"}
            </button>

            {/* Cancel */}

            {isEditing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            )}

          </form>

          {/* =================================================
              PRODUCTS LIST
          ================================================= */}

          <div className="w-full max-w-md mx-auto mt-8 bg-white shadow-md rounded-lg p-6">

            <h2 className="text-xl font-bold mb-4">
              Products
            </h2>

            {products.length === 0 ? (
              <p className="text-gray-500">
                No products found.
              </p>
            ) : (
              <ul className="space-y-4">

                {products.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between border border-gray-200 rounded-md p-3"
                  >

                    {/* Product Info */}

                    <div className="flex items-center gap-3">

                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-md"
                        />
                      )}

                      <div>

                        <p className="font-semibold">
                          {product.name}
                        </p>

                        <p className="text-gray-500 text-sm">
                          Rs. {product.price}
                        </p>

                        {product.desc && (
                          <p className="text-gray-400 text-xs">
                            {product.desc}
                          </p>
                        )}

                      </div>

                    </div>

                    {/* Edit / Delete */}

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          loadProductForEdit(product)
                        }
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteProduct(product.id)
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>

                    </div>

                  </li>
                ))}

              </ul>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default App;