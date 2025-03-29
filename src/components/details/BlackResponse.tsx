import Image from "next/image";
import { Geologica } from "next/font/google";
import { useState, useEffect } from "react";

const geologica = Geologica({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const BlackResponse = () => {
  const [rateData, setRateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRate() {
      try {
        const response = await fetch("/api/exchangeRate");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRateData(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchRate();
  }, []);

  // Extract the rate from the response data structure
  // Adjust this extraction logic based on the actual structure returned by the API
  const displayRate = () => {
    if (!rateData) return null;
    
    // Check for common patterns in rate API responses
    // You may need to adjust this based on the actual response structure
    if (rateData.data && rateData.data.rate) {
      return rateData.data.rate;
    } else if (rateData.rate) {
      return rateData.rate;
    } else if (rateData.data && rateData.data.price) {
      return rateData.data.price;
    } else if (rateData.data && rateData.data.rates && rateData.data.rates.NGN) {
      return rateData.data.rates.NGN;
    }
    
    // If we can't find the rate in expected places, return the raw data for debugging
    return JSON.stringify(rateData);
  };

  return (
    <div className="flex flex-row h-[32px] justify-between p-[10px] rounded-br-[12px] rounded-bl-[12px] bg-black">
      <div className="flex flex-row gap-[4px] h-[12px]">
        <Image src="/circleDetail.svg" alt="Home" width={12} height={12} />
        <h1 className={`${geologica.className} text-white my-auto font-medium text-[8px] leading-[8px] tracking-normal`}>
          fee: 0.5% + ₦500
        </h1>
      </div>
      <h1 className={`${geologica.className} text-white font-medium text-[8px] leading-[8px] tracking-normal`}>
        {loading ? "Loading rate..." : error ? "Error loading rate" : `Rate: 1 USDC ≈ ₦${displayRate()}`}
      </h1>
    </div>
  );
};

export default BlackResponse;
