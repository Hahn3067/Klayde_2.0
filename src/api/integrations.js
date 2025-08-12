// src/api/integrations.js
// Dummy integrations replacing Base44 SDK calls

export const Core = {
  InvokeLLM: async (...args) => {
    console.warn("Base44 disabled - InvokeLLM skipped", args);
    return null;
  },
  SendEmail: async (emailData) => {
    console.warn("Base44 disabled - SendEmail skipped", emailData);
    return true;
  },
  UploadFile: async (file) => {
    console.warn("Base44 disabled - UploadFile skipped", file);
    return null;
  },
  GenerateImage: async (params) => {
    console.warn("Base44 disabled - GenerateImage skipped", params);
    return null;
  },
  ExtractDataFromUploadedFile: async (file) => {
    console.warn("Base44 disabled - ExtractDataFromUploadedFile skipped", file);
    return {};
  }
};

// Keep named exports for compatibility
export const InvokeLLM = Core.InvokeLLM;
export const SendEmail = Core.SendEmail;
export const UploadFile = Core.UploadFile;
export const GenerateImage = Core.GenerateImage;
export const ExtractDataFromUploadedFile = Core.ExtractDataFromUploadedFile;
