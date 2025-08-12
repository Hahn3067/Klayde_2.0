
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, User, ExternalLink, Tag } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function DocumentCard({ document, index, categoryColors }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className="shadow-sm border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
        onClick={() => window.open(document.file_url, '_blank')}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center border border-orange-100">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-lg text-gray-800 truncate">{document.title}</h3>
                  <p className="text-gray-600 mt-1 line-clamp-2">
                    {document.description || document.summary || 'No description available'}
                  </p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
              
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(document.created_date), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {document.created_by?.username || document.created_by?.split('@')[0] || 'Unknown'}
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${categoryColors[document.category] || 'bg-gray-100 text-gray-800'}`}
                >
                  {document.category?.replace(/_/g, ' ')}
                </Badge>
              </div>

              {document.tags && document.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <Tag className="w-3 h-3 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {document.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-gray-200 text-gray-600">
                        {tag}
                      </Badge>
                    ))}
                    {document.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs border-gray-200 text-gray-500">
                        +{document.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {document.authors && document.authors.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Authors: {document.authors.join(', ')}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
