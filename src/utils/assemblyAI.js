import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: "e5a47052cae445029e41e61aaedde883",
});

// For generating campaign content
export const generateCampaignContent = async (segmentRules) => {
  const response = await client.lemur.task({
    prompt: `Generate an email subject and body for customers matching: ${JSON.stringify(
      segmentRules.rules
    )}.
    Include variables like {name} and {total_spent}. Format as:
    Subject: [subject here]
    Body: [body here]`,
  });
  return response.response;
};

// For customer insights
export const generateCustomerInsights = async (customerData) => {
  const response = await client.lemur.task({
    prompt: `Analyze this customer data and provide marketing insights: ${JSON.stringify(
      customerData
    )}.
    Highlight:
    1. Top spending segments
    2. Purchase frequency trends
    3. Recommended campaign types`,
  });
  return response.response;
};
