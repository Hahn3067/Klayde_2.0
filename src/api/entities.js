// src/api/entities.js
// Dummy Entities replacing Base44

export const Document = {};
export const LabInfo = {};
export const Category = {};
export const Project = {};
export const UsageLog = {};

// Dummy User auth object
export const User = {
  isAuthenticated: false,
  login: () => console.warn("Login not available - Base44 disabled"),
  logout: () => console.warn("Logout not available - Base44 disabled"),
};
