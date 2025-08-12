
import React, { useState, useEffect } from 'react';
import { Document } from '@/api/entities';
import { Project } from '@/api/entities';
import { User } from '@/api/entities';
import { Category } from '@/api/entities';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Search, Upload, Loader2 } from 'lucide-react';
import DocumentTable from '../components/knowledgebase/DocumentTable';
import KnowledgebaseFilters from '../components/knowledgebase/KnowledgebaseFilters';
import AIFeatureGuide from '../components/knowledgebase/AIFeatureGuide';
import CategoryManager from '../components/upload/CategoryManager';
import EditDocumentModal from '../components/knowledgebase/EditDocumentModal';

export default function Knowledgebase() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    uploadedBy: [],
    project: [],
    category: [],
    tag: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [documents, filters]); // Changed dependency array: removed 'users' as it's no longer needed for uploader filter logic

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const [allDocs, allProjects, allCategories, allUsers] = await Promise.all([
        Document.list('-created_date'),
        Project.list(),
        Category.list(),
        User.list()
      ]);
      
      // Filter documents based on user permissions
      let visibleDocs;
      if (user.role === 'admin') {
        visibleDocs = allDocs;
      } else {
        const memberProjectIds = allProjects
          .filter(p => p.member_emails?.includes(user.email))
          .map(p => p.id);
          
        visibleDocs = allDocs.filter(doc => 
          !doc.project_id || memberProjectIds.includes(doc.project_id)
        );
      }
      
      setDocuments(visibleDocs);
      setProjects(allProjects);
      setCategories(allCategories);
      setUsers(allUsers);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setIsLoading(false);
  };

  const refetchCategories = async () => {
    try {
      const allCategories = await Category.list();
      setCategories(allCategories);
    } catch (error) {
      console.error("Failed to refetch categories:", error);
    }
  };

  const applyFilters = () => {
    let results = [...documents];
    const searchTerm = filters.search.trim().toLowerCase();

    // Uploader filter
    if (filters.uploadedBy.length > 0) {
      results = results.filter(doc => doc.uploaded_by_name && filters.uploadedBy.includes(doc.uploaded_by_name));
    }

    // Project filter
    if (filters.project.length > 0) {
      const hasPublic = filters.project.includes('none');
      const projectIds = filters.project.filter(p => p !== 'none');
      results = results.filter(doc => {
        if (hasPublic && !doc.project_id) return true;
        return doc.project_id && projectIds.includes(doc.project_id);
      });
    }
    
    // Category filter
    if (filters.category.length > 0) {
      results = results.filter(doc => doc.category && filters.category.includes(doc.category));
    }

    // Tag filter
    if (filters.tag.length > 0) {
      results = results.filter(doc => doc.tags && doc.tags.some(t => filters.tag.includes(t)));
    }
    
    // Search term filter (applied to already-filtered results)
    if (searchTerm) {
      results = results.filter(doc =>
        (doc.title && doc.title.toLowerCase().includes(searchTerm)) ||
        (doc.summary && doc.summary.toLowerCase().includes(searchTerm)) ||
        (doc.description && doc.description.toLowerCase().includes(searchTerm)) ||
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm))) ||
        (doc.keywords && doc.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)))
      );
    }

    setFilteredDocuments(results);
  };

  const handleDeleteDocuments = async (docIds) => {
    if (!docIds || docIds.length === 0) return;
    
    // Consider adding a confirmation dialog in a future iteration
    try {
      await Promise.all(docIds.map(id => Document.delete(id)));
      // Refetch data to reflect the changes
      await fetchData();
    } catch (error) {
      console.error("Failed to delete documents:", error);
    }
  };

  const handleEditDocument = (doc) => {
    setEditingDocument(doc);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight mb-2">
              Knowledgebase
            </h1>
            <p className="text-gray-600 text-lg">
              Browse, search, and manage all documents in your lab's collection.
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Link to={createPageUrl("Search")} className="flex-1 md:flex-none">
              <button
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-sm h-11 px-5 flex items-center justify-center gap-2 rounded-lg shadow-sm transition-colors"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                <Search className="w-4 h-4" />
                AI Search
              </button>
            </Link>
            <Link to={createPageUrl("Upload")} className="flex-1 md:flex-none">
              <button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm h-11 px-5 flex items-center justify-center gap-2 rounded-lg shadow-sm transition-colors"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
            </Link>
          </div>
        </div>

        {/* AI Feature Guide */}
        <AIFeatureGuide />

        {/* Filters */}
        <KnowledgebaseFilters
          filters={filters}
          onFiltersChange={setFilters}
          projects={projects}
          categories={categories}
          users={users}
          currentUser={currentUser}
          onManageCategories={() => setIsCategoryModalOpen(true)}
          documents={documents}
        />

        {/* Documents Table */}
        <Card className="shadow-sm border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Document Collection
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredDocuments.length} documents)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
              </div>
            ) : (
              <DocumentTable 
                documents={filteredDocuments} 
                users={users}
                currentUser={currentUser}
                onDelete={handleDeleteDocuments}
                onEdit={handleEditDocument}
                isLoading={false} 
              />
            )}
          </CardContent>
        </Card>
      </div>
      <CategoryManager
        isOpen={isCategoryModalOpen}
        setIsOpen={setIsCategoryModalOpen}
        onUpdate={refetchCategories}
      />
      {editingDocument && (
        <EditDocumentModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          document={editingDocument}
          projects={projects}
          categories={categories}
          user={currentUser}
          onUpdateSuccess={fetchData}
        />
      )}
    </div>
  );
}
