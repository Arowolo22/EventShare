import Navbar from "@/components/ui/navbar" 


export default function create(){
    return (
      <>
        <Navbar />
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl text-center  mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-gray-900 font-bold text-3xl">
              Create Your Event
            </h1>
            <p className="text-gray-600 mt-2">
              Set up a shared photo pool for your guests
            </p>
          </div>
        </section>
      </>
    );
   

}