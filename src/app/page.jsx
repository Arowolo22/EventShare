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
            Capture every moment together. Share photos instantly with everyone
            at your wedding, party, or gathering.
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
          <div className="grid grid-cols-1 text-center md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 shadow-md rounded-xl">
              <div className="bg-black rounded-full h-13 w-13 flex justify-center items-center p-3 mb-6">
                <Camera size={30} color="white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Real-Time Sharing
              </h3>
              <p className="text-gray-600">
                Photos appear instantly for all guests
              </p>
            </div>
          </div>
        </section>
      </>
    );
}