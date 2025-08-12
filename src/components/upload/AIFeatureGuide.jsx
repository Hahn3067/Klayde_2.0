import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brain, FileText, CheckCircle, FileWarning } from "lucide-react";

export default function AIFeatureGuide() {
  return (
    <div className="space-y-4 mb-6">
      <Alert className="border-blue-300 bg-blue-50">
        <Brain className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800 font-bold">How AI Processing Works</AlertTitle>
        <AlertDescription className="text-blue-700 space-y-2">
          <p>
            For AI-powered semantic search and chat, documents need to be processed after uploading.
          </p>
          <ul className="list-disc list-inside text-sm">
            <li><strong className="text-green-700">Supported files:</strong> PDF, TXT, MD, CSV, and images (PNG, JPG).</li>
            <li>The system will extract text (using OCR for images), generate a summary, and create embeddings for semantic search.</li>
            <li>Encrypted files cannot be processed.</li>
          </ul>
           <p>After uploading, go to the <strong>Knowledgebase</strong> to click <strong>"Process with AI"</strong> for each document.</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}