
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function AIRecommendations({ documents }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    generateRecommendations();
  }, [documents]);

  const generateRecommendations = () => {
    if (documents.length === 0) return;

    // Simple recommendation logic based on document patterns
    const recentDocs = documents.slice(0, 5);
    const categoryCount = {};
    const areaCount = {};

    documents.forEach(doc => {
      categoryCount[doc.category] = (categoryCount[doc.category] || 0) + 1;
      areaCount[doc.research_area] = (areaCount[doc.research_area] || 0) + 1;
    });

    const topCategory = Object.keys(categoryCount).sort((a, b) => categoryCount[b] - categoryCount[a])[0];
    const topArea = Object.keys(areaCount).sort((a, b) => areaCount[b] - areaCount[a])[0];

    const recs = [
      {
        type: "trending",
        title: "Popular Category",
        description: `Most documents are in ${topCategory?.replace(/_/g, ' ')} category`,
        color: "bg-blue-100 text-blue-800"
      },
      {
        type: "insight",
        title: "Research Focus",
        description: `Primary research area: ${topArea?.replace(/_/g, ' ')}`,
        color: "bg-green-100 text-green-800"
      },
      {
        type: "activity",
        title: "Recent Activity",
        description: `${recentDocs.length} documents uploaded recently`,
        color: "bg-purple-100 text-purple-800"
      }
    ];

    setRecommendations(recs);
  };

  return (
    <Card className="shadow-sm border-amber-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-amber-900 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-amber-50"
          >
            <TrendingUp className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-amber-900 text-sm">{rec.title}</p>
              <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
            </div>
            <Badge variant="secondary" className={`text-xs ${rec.color}`}>
              {rec.type}
            </Badge>
          </motion.div>
        ))}
        {recommendations.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Lightbulb className="w-6 h-6 mx-auto mb-2 text-amber-300" />
            <p className="text-sm">Upload documents to get AI insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
