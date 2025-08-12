// src/api/functions.js
// Dummy functions replacing Base44 SDK calls

export async function processDocument(doc) {
  console.warn("Base44 disabled - processDocument skipped", doc);
  return null;
}

export async function aiSearch(query) {
  console.warn("Base44 disabled - aiSearch skipped", query);
  return [];
}

export async function deleteDocumentData(id) {
  console.warn("Base44 disabled - deleteDocumentData skipped", id);
  return true;
}

export async function aiChat(message) {
  console.warn("Base44 disabled - aiChat skipped", message);
  return { reply: "" };
}

export async function deleteAllCompanyData() {
  console.warn("Base44 disabled - deleteAllCompanyData skipped");
  return true;
}

export async function setupDatabase() {
  console.warn("Base44 disabled - setupDatabase skipped");
  return true;
}

export async function syncFileSizes() {
  console.warn("Base44 disabled - syncFileSizes skipped");
  return true;
}
