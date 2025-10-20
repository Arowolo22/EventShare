import Navbar from "@/components/ui/navbar" 
import Link from "next/link";
import {Zap, User,Camera} from "lucide-react"
export default function Home() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 py-16">
        <div className="flex justify-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl font-bold text-center text-gray-900 max-w-3xl leading-snug">
            Create or Join a Shared Photo Pool for Your Event
          </h1>
        </div>
        <p className="text-lg text-center mx-auto mt-4 max-w-2xl text-gray-600">
          Capture every moment together. Share photos instantly with everyone at
          your wedding, party, or gathering.
        </p>

        <div className=" text-center mt-7  ">
          <Link
            href="/create"
            className="inline-flex px-4 py-3 rounded-md bg-green-900  text-white "
          >
            Create Event
          </Link>

          <Link
            href="/join"
            className="inline-flex px-4 py-3 rounded-md border-black bg-white hover:bg-green-900 hover:text-white  text-black ml-4"
          >
            Join Event
          </Link>
        </div>
      </div>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            <div className="w-full max-w-sm bg-white p-6 shadow-md rounded-xl text-center">
              <div className="mx-auto bg-green-100 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                <Zap size={20} color="green" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Real-Time Sharing
              </h3>
              <p className="text-gray-600">
                Photos appear instantly for all guests.
              </p>
            </div>

            <div className="w-full max-w-sm bg-white p-6 shadow-md rounded-xl text-center">
              <div className="mx-auto bg-green-100 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                <User size={20} color="green" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Easy Access
              </h3>
              <p className="text-gray-600">
                Simple event codes, no signup required
              </p>
            </div>

            <div className="w-full max-w-sm bg-white p-6 shadow-md rounded-xl text-center">
              <div className="mx-auto bg-green-100 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                <Camera size={20} color="green" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Unlimited Photos
              </h3>
              <p className="text-gray-600">
                Share as many memories as you want
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}