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

type CartItem = {
  product: Product;
  quantity: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [customerName, setCustomerName] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");

  useEffect(() => {
    async function loadProducts() {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    }

    loadProducts();
  }, []);

  function addToCart(product: Product) {
    const existing = cart.find(
      (item) => item.product.id === product.id
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  }

  function increaseQuantity(productId: number) {
    setCart(
      cart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(productId: number) {
    setCart(
      cart
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId: number) {
    setCart(
      cart.filter((item) => item.product.id !== productId)
    );
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  function orderOnWhatsApp() {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!customerName || !customerLocation) {
      alert("Please enter your name and location.");
      return;
    }

    const items = cart
      .map(
        (item) =>
          `• ${item.product.name} x${item.quantity} — ₦${(
            item.product.price * item.quantity
          ).toLocaleString()}`
      )
      .join("\n");

    const message = `Hello Lydia's Fashion Hub 👋

I want to place an order.

Customer: ${customerName}
Location: ${customerLocation}

Order:
${items}

Total: ₦${cartTotal.toLocaleString()}`;

    const whatsappUrl = `https://wa.me/2348145240065?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  }

  return (
    <main className="min-h-screen bg-[#0b0a09] text-white">
   <div className="overflow-hidden bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 text-black py-3">
  <div className="flex w-max whitespace-nowrap animate-[marquee_18s_linear_infinite] font-bold text-sm tracking-wide">
    <span className="mx-10">
      ✨ THANK YOU FOR PATRONISING LYDIA'S FASHION HUB
    </span>

    <span className="mx-10 text-red-700">
      🔥 NEW ARRIVALS AVAILABLE
    </span>

    <span className="mx-10 text-green-800">
      💬 ORDER EASILY ON WHATSAPP
    </span>

    <span className="mx-10">
      ✨ THANK YOU FOR PATRONISING LYDIA'S FASHION HUB
    </span>

    <span className="mx-10 text-red-700">
      🔥 NEW ARRIVALS AVAILABLE
    </span>

    <span className="mx-10 text-green-800">
      💬 ORDER EASILY ON WHATSAPP
    </span>
  </div>
</div>
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-black/95 border-b border-yellow-600/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-5 py-5 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">
            Lydia's Fashion Hub
          </h1>

          <nav className="hidden md:flex gap-6 text-sm text-gray-300">
            <a href="#" className="hover:text-yellow-400">
              Home
            </a>
            <a href="#products" className="hover:text-yellow-400">
              Shop
            </a>
            <a href="#categories" className="hover:text-yellow-400">
              Categories
            </a>
          </nav>

          <button
            onClick={() =>
              document
                .getElementById("cart")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-yellow-500 text-black px-5 py-2.5 rounded-full font-bold hover:bg-yellow-400"
          >
            🛒 Cart ({cartCount})
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_#6b4b12_0%,_#21180b_35%,_#0b0a09_70%)]">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-yellow-500/10 blur-3xl" />
<div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-red-900/10 blur-3xl" />
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
          <p className="text-yellow-400 uppercase tracking-[0.3em] text-sm mb-5">
            Luxury • Style • Confidence
          </p>

          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-2xl">
            Fashion That
            <span className="text-yellow-400"> Speaks </span>
            For You
          </h2>

          <p className="max-w-2xl mx-auto text-gray-300 text-lg mb-9">
            Discover stylish wears, accessories and more at
            Lydia's Fashion Hub.
          </p>

          <a
            href="#products"
           className="inline-block bg-gradient-to-r from-[#d4af37] via-[#f5d76e] to-[#c9a227] text-black px-9 py-4 rounded-full font-bold shadow-[0_0_30px_rgba(212,175,55,0.25)] hover:scale-105 transition-transform duration-300"
           >
            Shop Now
          </a>
        </div>
      </section>

     {/* CATEGORIES */}
<section
  id="categories"
  className="px-6 py-20 bg-[radial-gradient(circle_at_center,_#2a1d0b_0%,_#11100e_45%,_#0b0a09_100%)]"
>
  <h2 className="text-3xl font-bold text-center mb-10">
    Shop By Category
  </h2>

  <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
    {[
      "Male Wares",
      "Female Wares",
      "Glasses",
      "Caps",
      "Corporate Wares",
    ].map((category) => (
      <button
        key={category}
        onClick={() => {
          setSelectedCategory(category);
          document
            .getElementById("products")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        className="group relative p-8 rounded-2xl border border-[#d4af37]/25 bg-gradient-to-br from-[#211a0d] via-[#151311] to-[#0d0c0b] text-center shadow-lg shadow-black/30 hover:border-[#d4af37]/70 hover:-translate-y-1 transition-all duration-300 w-full overflow-hidden"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f5d76e]" />

        <span className="text-[#f5d76e] font-semibold text-lg">
          {category}
        </span>
      </button>
    ))}
  </div>
</section>

      {/* PRODUCTS */}
      <section
        id="products"
        className="px-6 py-20 bg-[radial-gradient(circle_at_top_left,_#1f170b_0%,_#0e0d0c_45%,_#080808_100%)]"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Latest Products
          </h2>

         {products.filter(
  (product) =>
    selectedCategory === "All" ||
    product.category === selectedCategory
).length === 0 ? (
  <div className="py-16 text-center">
    <div className="text-5xl mb-4">🛍️</div>

    <h3 className="text-2xl font-bold text-[#f5d76e]">
      No {selectedCategory} available yet
    </h3>

    <p className="text-gray-400 mt-2">
      New products will be added here soon.
    </p>
  </div>
) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
             {products
  .filter(
    (product) =>
      selectedCategory === "All" ||
      product.category === selectedCategory
  )
  .map((product) => (
                <div
                  key={product.id}
                 className="group overflow-hidden rounded-2xl bg-gradient-to-b from-[#1b1814] to-[#0e0d0c] border border-[#d4af37]/15 shadow-xl shadow-black/30 hover:border-[#d4af37]/60 hover:-translate-y-1 transition-all duration-300"
                 >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                     className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  <div className="p-5">
                    <p className="text-xs uppercase tracking-wider text-yellow-500">
                      {product.category}
                    </p>

                    <h3 className="text-xl font-semibold mt-2">
                      {product.name}
                    </h3>

                    <p className="text-2xl font-bold text-yellow-400 mt-3">
                      ₦{product.price.toLocaleString()}
                    </p>

                    {product.description && (
                      <p className="text-sm text-gray-400 mt-3">
                        {product.description}
                      </p>
                    )}

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full mt-5 bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    
      {/* WHY SHOP WITH US */}
      <section className="px-6 py-16 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Why Shop With Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#181818] border border-yellow-600/20 rounded-2xl p-7 text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">
                Quality Style
              </h3>
              <p className="text-gray-400">
                Discover stylish pieces selected to keep you looking your best.
              </p>
            </div>

            <div className="bg-[#181818] border border-yellow-600/20 rounded-2xl p-7 text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">
                Easy Ordering
              </h3>
              <p className="text-gray-400">
                Choose your items, enter your details and order easily.
              </p>
            </div>

            <div className="bg-[#181818] border border-yellow-600/20 rounded-2xl p-7 text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">
                WhatsApp Support
              </h3>
              <p className="text-gray-400">
                Send your order directly to Lydia's Fashion Hub on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/*CART*/}
      <section
        id="cart"
        className="px-6 py-16 bg-gradient-to-br from-[#17100a] to-[#251800]"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-10 text-yellow-400">
            Your Cart 🛒
          </h2>

          {cart.length === 0 ? (
            <div className="bg-black/40 border border-yellow-600/20 rounded-2xl p-10 text-center">
              <p className="text-gray-400">
                Your cart is empty.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-5">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-[#111111] border border-yellow-600/20 rounded-2xl p-4 flex flex-wrap items-center gap-5"
                  >
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                    )}

                    <div className="flex-1 min-w-[180px]">
                      <h3 className="font-bold text-lg">
                        {item.product.name}
                      </h3>

                      <p className="text-yellow-400 font-bold">
                        ₦{item.product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          decreaseQuantity(item.product.id)
                        }
                        className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700"
                      >
                        −
                      </button>

                      <span className="font-bold text-lg">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(item.product.id)
                        }
                        className="w-9 h-9 rounded-full bg-yellow-500 text-black font-bold hover:bg-yellow-400"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(item.product.id)
                      }
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="mt-8 bg-black border border-yellow-500/30 rounded-2xl p-6">
                <div className="flex justify-between text-xl">
                  <span>Total</span>
                  <span className="font-black text-yellow-400">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CHECKOUT */}
              <div className="mt-8 bg-[#111111] border border-yellow-600/20 rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-5">
                  Delivery Details
                </h3>

                <div className="grid gap-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={customerName}
                    onChange={(e) =>
                      setCustomerName(e.target.value)
                    }
                    className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-yellow-500"
                  />

                  <input
                    type="text"
                    placeholder="Your location"
                    value={customerLocation}
                    onChange={(e) =>
                      setCustomerLocation(e.target.value)
                    }
                    className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-yellow-500"
                  />

                  <button
                    onClick={orderOnWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold text-lg"
                  >
                    Order on WhatsApp 💬
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-yellow-600/20 text-center py-8">
        <p className="text-yellow-400 font-bold">
          Lydia's Fashion Hub
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Style. Confidence. You.
        </p>
      </footer>
    </main>
  );
}