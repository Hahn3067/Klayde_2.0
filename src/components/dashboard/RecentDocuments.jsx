
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, ExternalLink } from "lucide-react";
import { format } from "date-fns";
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

export default function RecentDocuments({ documents, isLoading }) {
  return (
    <Card className="shadow-sm border-amber-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-amber-900">Recent Documents</CardTitle>
          <Link to={createPageUrl("Knowledgebase")}>
            <Button variant="outline" size="sm" className="bg-white border-amber-200 hover:bg-amber-100">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors duration-200 cursor-pointer"
            onClick={() => window.open(doc.file_url, '_blank')}
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-amber-200">
              <FileText className="w-5 h-5 text-amber-800" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-amber-900 truncate">{doc.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {doc.description || doc.summary || 'No description available'}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3 mt-3">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${categoryColors[doc.category] || 'bg-gray-100 text-gray-800'}`}
                >
                  {doc.category?.replace(/_/g, ' ')}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(doc.created_date), 'MMM d')}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <User className="w-3 h-3" />
                  {doc.created_by?.username || doc.created_by?.split('@')[0] || 'Unknown'}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {documents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-3 text-amber-300" />
            <p>No documents uploaded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
