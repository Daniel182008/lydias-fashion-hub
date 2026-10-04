export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-2">
        Admin Dashboard
      </h1>

      <p className="text-gray-600 mb-8">
        Welcome to Lydia&apos;s Fashion Hub Admin.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Products</h2>
          <p className="text-gray-500 mt-2">
            Manage your products
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Orders</h2>
          <p className="text-gray-500 mt-2">
            View customer orders
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Add Product</h2>
          <p className="text-gray-500 mt-2">
            Add new products to the store
          </p>
        </div>
      </div>
    </main>
  );
}