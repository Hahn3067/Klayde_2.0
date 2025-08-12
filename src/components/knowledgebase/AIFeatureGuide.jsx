import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brain, Info } from "lucide-react";

export default function AIFeatureGuide() {
  return (
    <Alert className="border-purple-300 bg-purple-50 mb-6">
      <Brain className="h-4 w-4 text-purple-600" />
      <AlertTitle className="text-purple-800">Manual AI Processing</AlertTitle>
      <AlertDescription className="text-purple-700">
        Documents need to be manually processed with AI to enable semantic search and chat features. 
        Click the <strong>"Process with AI"</strong> button for each document you want to make searchable. 
        Only processed documents will appear in AI Search and AI Chat results.
      </AlertDescription>
    </Alert>
  );
}