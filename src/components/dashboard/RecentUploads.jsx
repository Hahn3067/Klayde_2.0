
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, ExternalLink, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const categoryColors = {
  research_paper: "bg-blue-100 text-blue-800",
  protocol: "bg-green-100 text-green-800",
  data_analysis: "bg-purple-100 text-purple-800",
  meeting_notes: "bg-yellow-100 text-yellow-800",
  grant_proposal: "bg-red-100 text-red-800",
  lab_manual: "bg-indigo-100 text-indigo-800",
  literature_review: "bg-pink-100 text-pink-800",
  experiment_log: "bg-orange-100 text-orange-800",
  other: "bg-gray-100 text-gray-800"
};

export default function RecentUploads({ documents, isLoading }) {
  const recentDocs = documents.slice(0, 5);

  return (
    <Card className="shadow-sm border-gray-200 bg-white">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Recent Uploads
          </CardTitle>
          <Link to={createPageUrl("Knowledgebase")}>
            <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-100">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentDocs.length > 0 ? (
          <div className="space-y-4">
            {recentDocs.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                onClick={() => window.open(doc.file_url, '_blank')}
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-800 truncate text-sm">{doc.title}</h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                        {doc.description || doc.summary || 'No description available'}
                      </p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {doc.category && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${categoryColors[doc.category] || 'bg-gray-100 text-gray-800'}`}
                      >
                        {doc.category.replace(/_/g, ' ')}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(doc.created_date), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No documents uploaded yet</p>
            <Link to={createPageUrl("Upload")}>
              <button
                className="mt-3 px-4 py-2 text-sm rounded-md transition-colors"
                style={{ 
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  backgroundColor: '#ea580c',
                  color: 'white',
                  fontWeight: '500',
                  textRendering: 'optimizeLegibility',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#c2410c'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ea580c'}
              >
                Upload First Document
              </button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
