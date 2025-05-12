import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import axiosInstance from "../../utils/axios";
import { toast } from "react-hot-toast";
import { useApi } from "../../context/ApiContext";

const AiInsightModal = ({ onClose }) => {
  const { customers } = useApi();
  const [insights, setInsights] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateInsights = async () => {
    if (!customers?.length) {
      toast.error("No customer data available");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post(
        "/ai/generate-customer-insights",
        {
          customerData: customers.slice(0, 50), // Limit data
        }
      );
      setInsights(data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate insights"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold">Customer Insights</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
          {insights ? (
            <div className="whitespace-pre-wrap">{insights}</div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {isLoading
                  ? "Analyzing customer data..."
                  : "Generate insights from your customer data"}
              </p>
            </div>
          )}
        </div>

        <div className="border-t p-4 flex justify-end">
          <button
            onClick={generateInsights}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white flex items-center gap-2 ${
              isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin">🌀</span>
                Analyzing...
              </>
            ) : (
              <>
                <span>✨</span>
                Generate Insights
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiInsightModal;
