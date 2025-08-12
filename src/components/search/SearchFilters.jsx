
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function SearchFilters({ filters, onFiltersChange }) {
  const categories = [
    "research_paper", "protocol", "data_analysis", "meeting_notes",
    "grant_proposal", "lab_manual", "literature_review", "experiment_log", "other"
  ];

  const researchAreas = [
    "biology", "chemistry", "physics", "computer_science", "medicine",
    "engineering", "psychology", "materials_science", "environmental_science", "other"
  ];

  const fileTypes = ["pdf", "doc", "docx", "txt", "md"];

  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Card className="shadow-sm border-gray-200 mb-6 bg-white">
      <CardContent className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange('category', value)}
          >
            <SelectTrigger className="w-40 border-gray-300">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.research_area}
            onValueChange={(value) => handleFilterChange('research_area', value)}
          >
            <SelectTrigger className="w-40 border-gray-300">
              <SelectValue placeholder="Research Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {researchAreas.map(area => (
                <SelectItem key={area} value={area}>
                  {area.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.file_type}
            onValueChange={(value) => handleFilterChange('file_type', value)}
          >
            <SelectTrigger className="w-32 border-gray-300">
              <SelectValue placeholder="File Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {fileTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
