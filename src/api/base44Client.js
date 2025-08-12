// Dummy Base44 client - does nothing
export const base44 = {
  request: async () => {
    console.warn("Base44 is disabled. Returning dummy data.");
    return null;
  }
};
