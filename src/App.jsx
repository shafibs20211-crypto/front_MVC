
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [newProductInfo, setNewProductInfo] = useState({
    id: "",
    name: "",
    price: "",
    desc: "",
    imageUrl: "",
  });
  const [productId,setProductId]=useState("")

  const [products, setProducts] = useState([]);

  // Input change
  const handleIDChange = (e) => {
    setProductId(e.target.value);
  };
  const handleProductInfoChange = (e) => {
    setNewProductInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // GET products
  async function fetchProducts() {
    try {
    const productRes = await axios.get('https://mvc-production-b35d.up.railway.app/api/products');
      setProducts(productRes.data);
      console.log("Products:", productRes.data);
    } catch (err) {
      console.log("Error fetching products:", err);
    }
  }

  // Page load par products fetch karo
  useEffect(() => {
    fetchProducts();
  }, []);

  // POST - Add product
  async function addProduct(e) {
    e.preventDefault();

    try {
      const response = await axios.post("https://mvc-production-b35d.up.railway.app/products", {
        id:productId,
        name: newProductInfo.name,
        price: newProductInfo.price,
        desc: newProductInfo.desc,
        imageUrl: newProductInfo.imageUrl,
      });

      console.log("Product added:", response.data);

      // Form clear
      setNewProductInfo({ id: "", name: "", price: "", desc: "", imageUrl: "" });

      // Products dobara fetch
      fetchProducts();
    } catch (err) {
      console.log("Error adding product:", err);
    }
  }

  // PUT - Update product
  async function updateProduct(e) {
    e.preventDefault();

    try {
      const response = await axios.put(
        `https://mvc-production-b35d.up.railway.app/products/${newProductInfo.id}`,
        {
          name: newProductInfo.name,
          price: newProductInfo.price,
          desc: newProductInfo.desc,
          imageUrl: newProductInfo.imageUrl,
        }
      );

      console.log("Product updated:", response.data);

      // Form clear
      setNewProductInfo({ id: "", name: "", price: "", desc: "", imageUrl: "" });

      fetchProducts();
    } catch (err) {
      console.log("Error updating product:", err);
    }
  }

  // DELETE - Delete product
  async function deleteProduct(productId) {
    try {
      const response = await axios.delete(
        `https://mvc-production-b35d.up.railway.app/products/${productId}`
      );
      console.log("Product deleted:", response.data);
      fetchProducts();
    } catch (err) {
      console.log("Error deleting product:", err);
    }
  }

  // Edit button - form main product load karo
  function loadProductForEdit(product) {
    setNewProductInfo({
      id: product.id,
      name: product.name,
      price: product.price,
      desc: product.desc || "",
      imageUrl: product.imageUrl || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Cancel edit
  function cancelEdit() {
    setNewProductInfo({ id: "", name: "", price: "", desc: "", imageUrl: "" });
  }

  const isEditing = !!newProductInfo.id;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
       {/* Add  Update Form  */}
      <form
        onSubmit={isEditing ? updateProduct : addProduct}
        className="w-full max-w-md mx-auto p-6 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-5 text-center">
          {isEditing ? "Update Product" : "Add Product"}
        </h2>

        {/* id */}
        <input
          type="text"
          id="id"
          name="id"
          value={productId}
          placeholder="Enter Product ID"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleIDChange}
        />
        {/* Name */}
        <input
          type="text"
          id="name"
          name="name"
          value={newProductInfo.name}
          placeholder="Enter Product Name"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleProductInfoChange}
        />

        {/* Image URL */}
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={newProductInfo.imageUrl}
          placeholder="Enter Image URL"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleProductInfoChange}
        />

        {/* Price */}
        <input
          type="number"
          id="price"
          name="price"
          value={newProductInfo.price}
          placeholder="Enter Price"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleProductInfoChange}
        />

        {/* Description */}
        <textarea
          id="desc"
          name="desc"
          value={newProductInfo.desc}
          placeholder="Enter Description"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleProductInfoChange}
        ></textarea>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          {isEditing ? "Update Product" : "Add Product"}
        </button>

        {/* Cancel button (sirf editing ke waqt) */}
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

      {/* Products List */}
      <div className="w-full max-w-md mx-auto mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Products</h2>

        {products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <ul className="space-y-4">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between border border-gray-200 rounded-md p-3"
              >
                <div className="flex items-center gap-3">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-gray-500 text-sm">Rs. {product.price}</p>
                    {product.desc && (
                      <p className="text-gray-400 text-xs">{product.desc}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => loadProductForEdit(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProduct(product.id)}
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
  );
}

export default App;