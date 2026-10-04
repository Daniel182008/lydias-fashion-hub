"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string | null;
  description: string | null;
};

const categories = [
  "Male Wares",
  "Female Wares",
  "Glasses",
  "Caps",
  "Corporate Wares",
];

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadProducts() {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      alert("Could not load products.");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();

    if (!image) {
      alert("Please choose a product image.");
      return;
    }

    if (!name || !price || !category) {
      alert("Please fill in the product name, price and category.");
      return;
    }

    setLoading(true);

    try {
      const imageForm = new FormData();
      imageForm.append("file", image);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: imageForm,
      });

      if (!uploadResponse.ok) {
        throw new Error("Image upload failed");
      }

      const uploadData = await uploadResponse.json();

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price,
          category,
          image: uploadData.url,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Product save failed");
      }

      alert("Product added successfully!");

      clearForm();
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(product: Product) {
    setEditingId(product.id);
    setName(product.name);
    setPrice(String(product.price));
    setCategory(product.category);
    setDescription(product.description || "");
    setImage(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function updateProduct(e: React.FormEvent) {
    e.preventDefault();

    if (!editingId) return;

    if (!name || !price || !category) {
      alert("Please fill in the product name, price and category.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          name,
          price,
          category,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Product update failed");
      }

      alert("Product updated successfully!");

      clearForm();
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while updating the product.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Product deletion failed");
      }

      alert("Product deleted successfully!");

      await loadProducts();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting the product.");
    }
  }

  function clearForm() {
    setEditingId(null);
    setName("");
    setPrice("");
    setCategory("");
    setDescription("");
    setImage(null);
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white px-5 py-8 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-yellow-500 uppercase tracking-[0.3em] text-xs font-semibold">
                Lydia's Fashion Hub
              </p>

              <h1 className="text-3xl md:text-4xl font-black mt-2">
                Admin Dashboard
              </h1>

              <p className="text-gray-400 mt-2">
                Manage your products, prices and categories.
              </p>
            </div>

            <div className="bg-[#151515] border border-yellow-600/20 rounded-2xl px-6 py-4">
              <p className="text-gray-400 text-sm">Total Products</p>
              <p className="text-3xl font-black text-yellow-400">
                {products.length}
              </p>
            </div>
          </div>
        </header>

        {/* PRODUCT FORM */}
        <section className="bg-gradient-to-br from-[#181818] to-[#0f0f0f] border border-yellow-600/20 rounded-3xl p-6 md:p-8 shadow-2xl">

          <div className="flex items-center justify-between gap-4 mb-7">
            <div>
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                {editingId
                  ? "Update the product information below."
                  : "Add a new product to the marketplace."}
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={clearForm}
                className="text-sm text-gray-400 hover:text-white"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={editingId ? updateProduct : addProduct}
            className="grid gap-5"
          >
            {!editingId && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Product Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(e.target.files?.[0] || null)
                  }
                  className="w-full bg-black border border-gray-700 rounded-xl p-4 text-gray-300 file:bg-yellow-500 file:text-black file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4 file:font-bold"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Product Name
              </label>

              <input
                type="text"
                placeholder="e.g. Premium Black Shirt"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Price
              </label>

              <input
                type="number"
                placeholder="e.g. 25000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-yellow-500"
              >
                <option value="">Select category</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Description
              </label>

              <textarea
                placeholder="Product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-yellow-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#d4af37] via-[#f5d76e] to-[#c9a227] text-black rounded-xl p-4 font-black hover:scale-[1.01] transition-transform disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : editingId
                ? "Save Changes ✏️"
                : "Add Product ➕"}
            </button>
          </form>
        </section>

        {/* PRODUCTS */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Your Products
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Edit or remove products from your marketplace.
              </p>
            </div>

            <button
              onClick={loadProducts}
              className="border border-yellow-600/30 text-yellow-400 px-4 py-2 rounded-xl hover:bg-yellow-500 hover:text-black transition"
            >
              Refresh ↻
            </button>
          </div>

          {products.length === 0 ? (
            <div className="bg-[#111111] border border-yellow-600/20 rounded-2xl p-10 text-center text-gray-400">
              No products available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl bg-gradient-to-b from-[#1a1815] to-[#0e0e0e] border border-yellow-600/15 shadow-xl"
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-60 object-cover"
                    />
                  )}

                  <div className="p-5">
                    <p className="text-xs uppercase tracking-wider text-yellow-500">
                      {product.category}
                    </p>

                    <h3 className="text-xl font-bold mt-2">
                      {product.name}
                    </h3>

                    <p className="text-2xl font-black text-yellow-400 mt-3">
                      ₦{product.price.toLocaleString()}
                    </p>

                    {product.description && (
                      <p className="text-sm text-gray-400 mt-3 line-clamp-3">
                        {product.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 mt-5">
                      <button
                        onClick={() => startEditing(product)}
                        className="bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400"
                      >
                        Edit ✏️
                      </button>

                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-500"
                      >
                        Delete 🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="text-center py-10 mt-10 border-t border-yellow-600/10">
          <p className="text-yellow-400 font-bold">
            Lydia's Fashion Hub
          </p>

          <p className="text-gray-600 text-sm mt-2">
            Admin Management Panel
          </p>
        </footer>
      </div>
    </main>
  );
}