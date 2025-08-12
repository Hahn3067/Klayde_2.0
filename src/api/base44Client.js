// src/api/base44Client.js
// Dummy Base44 client so imports still work without @base44/sdk

export const base44 = {
  entities: {},
  functions: {},
  integrations: {},
  auth: {
    isAuthenticated: false,
    login: () => console.warn("Base44 login disabled"),
    logout: () => console.warn("Base44 logout disabled"),
  }
};
