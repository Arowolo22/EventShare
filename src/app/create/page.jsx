import Navbar from "@/components/ui/navbar";

export default function create() {
  return (
    <>
      <Navbar />
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl text-center  mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-gray-900 font-bold text-3xl">
            Create Your Event
          </h1>
          <p className="text-gray-600 mt-2">
            Set up a shared photo pool for your guests
          </p>

          <form className="mt-8 max-w-2xl mx-auto text-left">
            <div className="mb-6">
              <label
                htmlFor="eventName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Event Name
              </label>
              <input
                type="text"
                id="eventName"
                name="eventName"
                placeholder="Arowolo's Wedding"
                className="w-full px-4 py-3 border text-black border-gray-500 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows="6"
                placeholder="Share your favorite moments from our special day!"
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full  bg-green-900  text-white font-semibold py-3 px-6 rounded-lg "
            >
              Create Event
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
