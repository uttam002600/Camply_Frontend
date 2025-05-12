import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../utils/axios";
import { useApi } from "../../context/ApiContext";
import { toast } from "react-hot-toast";
import ReactQueryBuilder from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { useNavigate } from "react-router-dom";
// genini ai integration

import { BsStars as FiSparkles } from "react-icons/bs";

const CampaignCreatePage = () => {
  const { authUser, CustomValueEditor } = useApi();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  const [segmentQuery, setSegmentQuery] = useState({
    combinator: "and",
    rules: [],
  });
  const [estimatedCount, setEstimatedCount] = useState(0);
  const [isEstimating, setIsEstimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gemini Ai
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateContent = async () => {
    try {
      setIsGenerating(true);
      const { data } = await axiosInstance.post(
        "/ai/generate-campaign-content",
        {
          segmentRules: segmentQuery,
        }
      );

      // Split into subject and body (assuming response is separated by \n\n)
      const [subject, ...bodyParts] = data.data.split("\n\n");
      const body = bodyParts.join("\n\n");

      // Update form fields using setValue
      setValue("subject", subject.replace("Subject:", "").trim());
      setValue("message", body);

      toast.success("AI-generated content created!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate content"
      );
      console.error("Content Generation Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const estimateAudience = async () => {
    try {
      setIsEstimating(true);
      const response = await axiosInstance.post("/user/estimate-segment", {
        rules: segmentQuery,
      });
      setEstimatedCount(response.data.data.count);
      toast.success(
        `Estimated audience: ${response.data.data.count} customers`
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to estimate audience"
      );
    } finally {
      setIsEstimating(false);
    }
  };

  const onSubmit = async (data) => {
    if (estimatedCount === 0) {
      toast.error("Please estimate audience size first");
      return;
    }

    try {
      setIsSubmitting(true);
      const segmentRes = await axiosInstance.post("/user/create-segment", {
        name: `Segment for ${data.campaignName}`,
        description: data.segmentDescription,
        rules: segmentQuery,
      });

      await axiosInstance.post("/user/create-campaign", {
        name: data.campaignName,
        segmentId: segmentRes.data.data._id,
        template: {
          subject: data.subject,
          body: data.message,
          variables: extractVariables(data.message),
        },
      });

      toast.success("Campaign created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  const extractVariables = (message) => {
    const regex = /\{([^}]+)\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(message)) !== null) {
      matches.push(match[1]);
    }
    return [...new Set(matches)];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--text-black-900)] mb-6">
        Create New Campaign
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Campaign Details Section */}
        <div className="bg-[var(--bg-black-100)] border-2 border-[var(--skin-color)] p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-[var(--text-black-900)] mb-4">
            Campaign Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-black-700)] mb-1">
                Campaign Name *
              </label>
              <input
                {...register("campaignName", {
                  required: "Campaign name is required",
                })}
                className="w-full px-3 py-2 border border-[var(--bg-black-50)] text-[var(--text-black-900)] rounded-md focus:ring-[var(--skin-color)] focus:border-[var(--skin-color)]"
                placeholder="Summer Sale 2023"
              />
              {errors.campaignName && (
                <p className="mt-1 text-sm text-[var(--skin-color)]">
                  {errors.campaignName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-black-700)] mb-1">
                Segment Description
              </label>
              <input
                {...register("segmentDescription")}
                className="w-full px-3 py-2 border text-[var(--text-black-900)] border-[var(--bg-black-50)] rounded-md focus:ring-[var(--skin-color)] focus:border-[var(--skin-color)]"
                placeholder="High-value customers"
              />
            </div>
          </div>
        </div>

        {/* Audience Segmentation Section */}
        <div className="bg-[var(--bg-black-100)] p-6 rounded-lg shadow border-2 border-[var(--skin-color)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[var(--text-black-900)]">
              Audience Segmentation
            </h2>
            <button
              type="button"
              onClick={estimateAudience}
              disabled={isEstimating || segmentQuery.rules.length === 0}
              className={`px-4 py-2 rounded-md text-white ${
                isEstimating || segmentQuery.rules.length === 0
                  ? "bg-[var(--bg-black-50)] cursor-not-allowed"
                  : "bg-[var(--skin-color)] hover:opacity-90"
              }`}
            >
              {isEstimating ? "Estimating..." : "Estimate Audience Size"}
            </button>
          </div>

          <div className="border border-[var(--bg-black-50)] text-[var(--text-black-900)] rounded p-4">
            <ReactQueryBuilder
              fields={[
                {
                  name: "total_spent",
                  label: "Total Spent",
                  valueEditorType: "number",
                  inputType: "number",
                },
                {
                  name: "order_count",
                  label: "Order Count",
                  valueEditorType: "number",
                  inputType: "number",
                },
                {
                  name: "last_purchase",
                  label: "Last Purchase (days ago)",
                  valueEditorType: "number",
                  inputType: "number",
                },
                {
                  name: "city",
                  label: "City",
                  valueEditorType: "text",
                },
                {
                  name: "is_active",
                  label: "Is Active",
                  valueEditorType: "select",
                  values: [
                    { name: "true", label: "Yes" },
                    { name: "false", label: "No" },
                  ],
                },
              ]}
              operators={[
                { name: ">", label: ">" },
                { name: "<", label: "<" },
                { name: "==", label: "=" },
                { name: ">=", label: ">=" },
                { name: "<=", label: "<=" },
                { name: "!=", label: "!=" },
                { name: "contains", label: "contains" },
              ]}
              controlElements={{ valueEditor: CustomValueEditor }}
              query={segmentQuery}
              onQueryChange={(q) => setSegmentQuery(q)}
            />
          </div>

          {estimatedCount > 0 && (
            <div className="mt-4 p-3 bg-[var(--bg-black-50)] text-[var(--text-black-900)] rounded-md">
              Estimated audience size: <strong>{estimatedCount}</strong>{" "}
              customers
            </div>
          )}
        </div>

        {/* Message Template Section */}
        <div className="bg-[var(--bg-black-100)] border-2 border-[var(--skin-color)] p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-[var(--text-black-900)] mb-4">
            Message Template
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-black-700)] mb-1">
                Subject *
              </label>
              <input
                {...register("subject", { required: "Subject is required" })}
                className="w-full text-[var(--text-black-900)] px-3 py-2 border border-[var(--bg-black-50)] rounded-md focus:ring-[var(--skin-color)] focus:border-[var(--skin-color)]"
                placeholder="Special offer just for you!"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-[var(--skin-color)]">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-[var(--text-black-700)] mb-1">
                Message Body *
                <span className="text-xs text-[var(--text-black-700)] ml-2">
                  Use variables like {"{name}"}, {"{total_spent}"}
                </span>
              </label>
              <button
                onClick={handleGenerateContent}
                disabled={isGenerating || segmentQuery.rules.length === 0}
                className="absolute right-0 top-0 flex items-center gap-1 px-3 py-1 text-sm bg-[var(--skin-color)] text-white rounded hover:opacity-90 disabled:opacity-50"
              >
                <FiSparkles size={14} />
                {isGenerating ? "Generating..." : "AI Generate"}
              </button>
              <textarea
                {...register("message", {
                  required: "Message is required",
                  validate: {
                    hasVariables: (value) =>
                      /\{.+?\}/.test(value) ||
                      "Should include at least one variable like {name}",
                  },
                })}
                rows={6}
                className="w-full text-[var(--text-black-900)] px-3 py-2 border border-[var(--bg-black-50)] rounded-md focus:ring-[var(--skin-color)] focus:border-[var(--skin-color)]"
                placeholder={`Hi {name},\n\nWe're offering you a special discount because you've spent {total_spent} with us!`}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-[var(--skin-color)]">
                  {errors.message.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 border border-[var(--bg-black-50)] bg-[var(--bg-black-100)] rounded-md text-[var(--text-black-900)] hover:bg-[var(--bg-black-50)] "
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || estimatedCount === 0}
            className={`px-4 py-2 rounded-md text-white ${
              isSubmitting || estimatedCount === 0
                ? "bg-[var(--bg-black-50)] cursor-not-allowed"
                : "bg-[var(--skin-color)] hover:opacity-90"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampaignCreatePage;
