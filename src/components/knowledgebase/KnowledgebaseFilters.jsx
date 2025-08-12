import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Filter, Settings, User as UserIcon, FolderKanban, Tag as TagIcon, Layers } from "lucide-react";
import { Button } from '@/components/ui/button';
import MultiSelectFilter from './MultiSelectFilter';

export default function KnowledgebaseFilters({ 
  filters, 
  onFiltersChange, 
  projects, 
  categories, 
  users, 
  currentUser,
  onManageCategories,
  documents
}) {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const clearFilters = () => {
      onFiltersChange({
        search: '',
        uploadedBy: [],
        project: [],
        category: [],
        tag: [],
      });
  };

  const getDynamicOptions = (field, dependencyFilters = []) => {
    let relevantDocs = documents;

    // Filter documents based on other active filters if specified
    dependencyFilters.forEach(filterKey => {
      if (filters[filterKey].length > 0) {
        if (filterKey === 'uploadedBy') {
          relevantDocs = relevantDocs.filter(doc => doc.uploaded_by_name && filters[filterKey].includes(doc.uploaded_by_name));
        }
        // Add other filter key logic here if needed for more complex dependencies
      }
    });

    if (field === 'category') {
        const cats = [...new Set(relevantDocs.map(doc => doc.category).filter(Boolean))];
        return cats.map(cat => ({ value: cat, label: cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }));
    }
    if (field === 'tag') {
        const tags = [...new Set(relevantDocs.flatMap(doc => doc.tags || []).filter(Boolean))];
        return tags.map(tag => ({ value: tag, label: tag }));
    }
    return [];
  };

  const visibleProjects = currentUser?.role === 'admin' 
    ? projects 
    : projects.filter(p => p.member_emails?.includes(currentUser?.email));
  
  const projectOptions = [
      { value: 'none', label: 'Public' },
      ...visibleProjects.map(p => ({ value: p.id, label: p.name }))
  ];

  const uploaderOptions = [...new Set(documents.map(doc => doc.uploaded_by_name).filter(Boolean))]
    .map(name => ({ value: name, label: name }));

  const categoryOptions = getDynamicOptions('category', ['uploadedBy']);
  const tagOptions = getDynamicOptions('tag', ['uploadedBy']);

  const hasActiveFilters = filters.search || filters.uploadedBy.length > 0 || filters.project.length > 0 || filters.category.length > 0 || filters.tag.length > 0;

  return (
    <Card className="shadow-sm border-gray-200 bg-white mb-6">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Filter className="w-5 h-5 text-orange-600" />
          Filter & Search Documents
        </CardTitle>
        {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="text-sm text-orange-600 hover:text-orange-700">
                Clear Filters
            </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium text-gray-700">
              Search in Titles, Summaries & Tags
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search"
                placeholder="Enter search terms..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9 border-gray-300 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MultiSelectFilter
              label="Uploaded By"
              options={uploaderOptions}
              selectedValues={filters.uploadedBy}
              onSelectionChange={(value) => handleFilterChange('uploadedBy', value)}
              placeholder="All Users"
              icon={UserIcon}
            />
            <MultiSelectFilter
              label="Project"
              options={projectOptions}
              selectedValues={filters.project}
              onSelectionChange={(value) => handleFilterChange('project', value)}
              placeholder="All Projects"
              icon={FolderKanban}
            />
            <div className="relative">
                <MultiSelectFilter
                  label="Category"
                  options={categoryOptions}
                  selectedValues={filters.category}
                  onSelectionChange={(value) => handleFilterChange('category', value)}
                  placeholder="All Categories"
                  icon={Layers}
                />
                 <Button type="button" variant="ghost" size="sm" onClick={onManageCategories} className="absolute top-0 right-0 h-6 px-1 text-xs">
                  <Settings className="w-3 h-3" />
                </Button>
            </div>
            <MultiSelectFilter
              label="Tag"
              options={tagOptions}
              selectedValues={filters.tag}
              onSelectionChange={(value) => handleFilterChange('tag', value)}
              placeholder="All Tags"
              icon={TagIcon}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}