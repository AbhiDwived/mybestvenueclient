
import { FaCamera } from 'react-icons/fa';


const PreviewProfileScreen = () => {
  window.scrollTo({ top: 0, category: "top" })
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 ">
        {/* Left Section */}
        <div className="lg:col-span-4 space-y-6">
          {/* About */}
          <div>
            <h2 className="text-xl font-semibold mb-2">About Dream Wedding Photography</h2>
            <p className="text-gray-700 text-sm md:text-base">
              Capturing your special moments with creativity and passion. Our team of experienced photographers specializes in candid wedding photography,
              traditional portraits, and creative pre-wedding shoots. We use state-of-the-art equipment to ensure your memories are preserved in the highest quality.
            </p>
          </div>

          {/* Services */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
              <span><FaCamera className="inline mr-2" /> Wedding Photography</span>
              <span><FaCamera className="inline mr-2" /> Pre-wedding Shoot</span>
              <span><FaCamera className="inline mr-2" /> Candid Photography</span>
              <span><FaCamera className="inline mr-2" /> Traditional Photography</span>
              <span><FaCamera className="inline mr-2" /> Video Coverage</span>
              <span><FaCamera className="inline mr-2" /> Drone Shots</span>
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Pricing</h2>
            <p className="text-gray-700 mb-4 text-sm md:text-base">We offer customized packages to suit your needs:</p>

            <div className="space-y-4 text-sm md:text-base">
              {/* Basic Package */}
              <div>
                <h3 className="font-semibold">Basic Package (₹10,000 - ₹20,000)</h3>
                <ul className="list-disc list-inside text-gray-700">
                  <li>6 hours of coverage</li>
                  <li>One photographer</li>
                  <li>100 edited digital photos</li>
                </ul>
              </div>

              {/* Premium Package */}
              <div className="border p-4 rounded-md bg-gray-50">
                <h3 className="font-semibold">Premium Package (₹20,000 - ₹35,000)</h3>
                <ul className="list-disc list-inside text-gray-700">
                  <li>10 hours of coverage</li>
                  <li>Two photographers</li>
                  <li>300 edited digital photos</li>
                  <li>Wedding album (20 pages)</li>
                  <li>Pre-wedding shoot (2 hours)</li>
                </ul>
              </div>

              {/* Deluxe Package */}
              <div>
                <h3 className="font-semibold">Deluxe Package (₹35,000 - ₹50,000)</h3>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Full day coverage (up to 16 hours)</li>
                  <li>Team of 3+ photographers</li>
                  <li>500+ edited digital photos</li>
                  <li>Wedding album + video highlights</li>
                  <li>Premium wedding album (30 pages)</li>
                  <li>Drone coverage</li>
                  <li>Same-day edit highlights</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Right Section */}
        {/*  */}
      </div>

      {/* <SimilarVendors /> */}
    </>
  );
};

export default PreviewProfileScreen;
