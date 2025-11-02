import Navbar from "@/components/ui/navbar";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-gray-900 font-bold text-3xl">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage your events and view analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 shadow-md rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Total Events
              </h3>
              <p className="text-3xl font-bold text-green-900">0</p>
            </div>

            <div className="bg-white p-6 shadow-md rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Active Events
              </h3>
              <p className="text-3xl font-bold text-green-900">0</p>
            </div>

            <div className="bg-white p-6 shadow-md rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Total Photos
              </h3>
              <p className="text-3xl font-bold text-green-900">0</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Events
            </h2>
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No events yet</p>
              <a
                href="/create"
                className="inline-flex px-4 py-2 rounded-md bg-green-900 text-white hover:bg-green-800 transition"
              >
                Create Your First Event
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
