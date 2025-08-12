
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Microscope } from "lucide-react";
import { motion } from "framer-motion";

const areaColors = {
  biology: "bg-green-100 text-green-800",
  chemistry: "bg-blue-100 text-blue-800",
  physics: "bg-purple-100 text-purple-800",
  computer_science: "bg-indigo-100 text-indigo-800",
  medicine: "bg-red-100 text-red-800",
  engineering: "bg-orange-100 text-orange-800",
  psychology: "bg-pink-100 text-pink-800",
  materials_science: "bg-yellow-100 text-yellow-800",
  environmental_science: "bg-emerald-100 text-emerald-800",
  other: "bg-gray-100 text-gray-800"
};

export default function ResearchAreas({ documents }) {
  const getAreaStats = () => {
    const areaCount = {};
    documents.forEach(doc => {
      if (doc.research_area) {
        areaCount[doc.research_area] = (areaCount[doc.research_area] || 0) + 1;
      }
    });
    
    return Object.entries(areaCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const areaStats = getAreaStats();

  return (
    <Card className="shadow-sm border-amber-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-amber-900 flex items-center gap-2">
          <Microscope className="w-5 h-5 text-amber-800" />
          Research Areas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {areaStats.map(([area, count], index) => (
          <motion.div
            key={area}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`text-xs ${areaColors[area] || 'bg-gray-100 text-gray-800'}`}
              >
                {area.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
            <span className="text-sm font-semibold text-gray-600">{count}</span>
          </motion.div>
        ))}
        {areaStats.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Microscope className="w-6 h-6 mx-auto mb-2 text-amber-300" />
            <p className="text-sm">No research areas tagged yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
