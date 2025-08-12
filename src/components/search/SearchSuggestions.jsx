
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Search } from "lucide-react";
import { motion } from "framer-motion";

const suggestions = [
  "Find research papers about gene expression",
  "Show me protocols for PCR amplification",
  "Data analysis reports from this month",
  "Meeting notes about project planning",
  "Grant proposals for funding applications",
  "Lab manuals for equipment setup",
  "Literature reviews on machine learning",
  "Experiment logs from recent trials"
];

export default function SearchSuggestions({ onSuggestionClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="shadow-sm border-gray-200 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Search Suggestions
          </CardTitle>
          <p className="text-sm text-gray-600">
            Try these example queries to get started with AI search
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="w-full text-left h-auto p-3 bg-white border-gray-200 hover:bg-gray-100 hover:border-gray-300 justify-start"
                  onClick={() => onSuggestionClick(suggestion)}
                >
                  <Search className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{suggestion}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
