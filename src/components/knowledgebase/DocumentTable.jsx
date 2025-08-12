
import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink, ArrowUpDown, BrainCircuit, XCircle, Trash2, MoreHorizontal, Pencil, Cog, Loader2, RefreshCw, AlertCircle, ClipboardPaste, Archive, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import TableToolbar from './TableToolbar';
import { deleteDocumentData } from '@/api/functions';
import { processDocument } from '@/api/functions';
import { UsageLog } from '@/api/entities'; // New import

const categoryColors = {
  research_paper: 'bg-blue-50 text-blue-700 border border-blue-200',
  protocol: 'bg-green-50 text-green-700 border border-green-200',
  data_analysis: 'bg-purple-50 text-purple-700 border border-purple-200',
  meeting_notes: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  grant_proposal: 'bg-red-50 text-red-700 border border-red-200',
  lab_manual: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  literature_review: 'bg-pink-50 text-pink-700 border border-pink-200',
  experiment_log: 'bg-orange-50 text-orange-700 border border-orange-200',
  other: 'bg-gray-100 text-gray-700 border border-gray-200',
};

export default function DocumentTable({ documents, users, currentUser, onDelete, onEdit, isLoading }) {
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState({ key: 'created_date', order: 'desc' });
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [processingDocs, setProcessingDocs] = useState(new Set());
  const [tokensAtLimit, setTokensAtLimit] = useState(false); // New state

  const userMap = useMemo(() => {
    return new Map(users.map(user => [user.email, user]));
  }, [users]);

  // New useEffect to check token limits
  useEffect(() => {
    const checkTokenLimits = async () => {
      try {
        const usageData = await UsageLog.list();
        const totalTokens = usageData.reduce((sum, log) => sum + log.token_count, 0);
        const maxTokens = 20000; // Define the maximum token limit
        setTokensAtLimit(totalTokens >= maxTokens);
      } catch (error) {
        console.error("Failed to check token limits:", error);
        // Optionally, handle this error more gracefully, e.g., set tokensAtLimit to true to prevent over-usage if check fails.
        // For now, it will default to false if an error occurs, allowing processing. This might be a desired fallback or not.
      }
    };
    checkTokenLimits();
  }, [documents]); // Re-check if documents change (implies potential new processing)

  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents.filter(doc =>
      doc.title.toLowerCase().includes(filter.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let valA = a[sortBy.key];
      let valB = b[sortBy.key];

      if (sortBy.key === 'created_date') {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      
      if (valA < valB) return sortBy.order === 'asc' ? -1 : 1;
      if (valA > valB) return sortBy.order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [documents, filter, sortBy]);
  
  useEffect(() => {
    setSelectedRowIds([]);
  }, [documents]);

  const handleSort = (key) => {
    setSortBy(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRowIds(filteredAndSortedDocuments.map(doc => doc.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (docId, checked) => {
    if (checked) {
      setSelectedRowIds(prev => [...prev, docId]);
    } else {
      setSelectedRowIds(prev => prev.filter(id => id !== docId));
    }
  };

  const handleProcessDocument = async (doc) => {
    if (processingDocs.has(doc.id)) return;
    
    // New check for token limit
    if (tokensAtLimit) {
      alert("AI token limit reached! Please upgrade your plan to process more documents.");
      return;
    }

    setProcessingDocs(prev => new Set(prev).add(doc.id));
    
    try {
      await processDocument({ documentId: doc.id });
      window.location.reload(); 
    } catch (error) {
      console.error('Failed to process document:', error);
      alert(`Failed to process document: ${error.message}`);
      window.location.reload(); 
    } finally {
      setProcessingDocs(prev => {
        const newSet = new Set(prev);
        newSet.delete(doc.id);
        return newSet;
      });
    }
  };

  const renderSortableHeader = (key, label) => (
    <TableHead className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
      <Button variant="ghost" onClick={() => handleSort(key)} className="p-2 hover:bg-gray-200">
        {label}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );

  if (documents.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        <BrainCircuit className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Documents Found</h3>
        <p className="text-gray-500">No documents match your current filters.</p>
      </div>
    );
  }

  const AIStatusBadge = ({ doc }) => {
    // Check if this file type supports AI processing
    const aiSupportedFormats = ['pdf', 'txt', 'md', 'csv'];
    const isAiEligible = aiSupportedFormats.includes(doc.file_type?.toLowerCase());
    
    if (!isAiEligible) {
      return (
        <Badge variant="outline" className="text-gray-600">
          <Archive className="mr-1 h-3 w-3"/> Storage Only
        </Badge>
      );
    }
    
    if (doc.ai_processed_successfully) {
      return (
        <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
          <BrainCircuit className="mr-1 h-3 w-3"/> Processed
        </Badge>
      );
    }
    if (doc.ai_processing_message) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="destructive">
                <AlertCircle className="mr-1 h-3 w-3"/> Failed
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{doc.ai_processing_message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return (
      <Badge variant="outline" className="text-gray-600">
        <XCircle className="mr-1 h-3 w-3"/> Not Processed
      </Badge>
    );
  };

  return (
    <div>
      <TableToolbar 
        filter={filter} 
        onFilterChange={setFilter} 
        totalCount={documents.length}
        filteredCount={filteredAndSortedDocuments.length}
        selectedIds={selectedRowIds}
        onDelete={async () => {
          try {
            await Promise.all(selectedRowIds.map(docId => 
              deleteDocumentData({ documentId: docId }).catch(err => 
                console.warn(`Failed to delete AI data for document ${docId}:`, err)
              )
            ));
            onDelete(selectedRowIds);
            setSelectedRowIds([]);
          } catch (error) {
            console.error("Error during deletion:", error);
            onDelete(selectedRowIds);
            setSelectedRowIds([]);
          }
        }}
      />
      <div className="border rounded-lg border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[40px] pl-4"><Checkbox onCheckedChange={handleSelectAll} /></TableHead>
              {renderSortableHeader('title', 'Title')}
              <TableHead className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Uploaded By</TableHead>
              {renderSortableHeader('category', 'Category')}
              {renderSortableHeader('created_date', 'Uploaded')}
              <TableHead className="text-xs font-semibold uppercase text-gray-500 tracking-wider">AI Status</TableHead>
              <TableHead className="w-[80px] text-xs font-semibold uppercase text-gray-500 tracking-wider text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7} className="h-12 text-center">
                    <Loader2 className="mx-auto h-5 w-5 text-gray-400 animate-spin" />
                    Loading...
                  </TableCell>
                </TableRow>
              ))
            ) : filteredAndSortedDocuments.map(doc => {
            const aiSupportedFormats = ['pdf', 'txt', 'md', 'csv'];
            const isAiEligible = aiSupportedFormats.includes(doc.file_type?.toLowerCase());
            
            return (
              <TableRow key={doc.id} data-state={selectedRowIds.includes(doc.id) && "selected"}>
                <TableCell className="pl-4">
                  <Checkbox
                    checked={selectedRowIds.includes(doc.id)}
                    onCheckedChange={(checked) => handleSelectRow(doc.id, checked)}
                  />
                </TableCell>
                <TableCell className="font-medium text-gray-800">
                    <div className="flex items-center gap-2">
                        {doc.manual_text && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <ClipboardPaste className="w-4 h-4 text-green-600 flex-shrink-0"/>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Manual text has been provided.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        <span>{doc.title}</span>
                    </div>
                </TableCell>
                <TableCell className="text-gray-600 font-medium">
                  {doc.uploaded_by_name || doc.created_by?.split('@')[0] || 'Unknown'}
                </TableCell>
                <TableCell>
                  {doc.category ? <Badge className={`${categoryColors[doc.category] || categoryColors.other} font-medium`}>{doc.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Badge> : <Badge variant="secondary">No Category</Badge>}
                </TableCell>
                <TableCell>{format(new Date(doc.created_date), 'dd MMM yyyy')}</TableCell>
                <TableCell>
                  <AIStatusBadge doc={doc} />
                </TableCell>
                <TableCell className="text-right pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isAiEligible && (
                        <DropdownMenuItem
                          onClick={() => handleProcessDocument(doc)}
                          disabled={processingDocs.has(doc.id) || tokensAtLimit} // Modified disabled prop
                          className={`cursor-pointer flex items-center w-full ${
                            tokensAtLimit 
                              ? 'text-red-400 cursor-not-allowed focus:bg-red-50' // New styles for disabled state
                              : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50 focus:bg-purple-50'
                          }`}
                        >
                          {processingDocs.has(doc.id) ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                          ) : tokensAtLimit ? ( // New condition for token limit
                            <><AlertTriangle className="mr-2 h-4 w-4" />Token Limit Reached</>
                          ) : doc.ai_processed_successfully ? (
                            <><RefreshCw className="mr-2 h-4 w-4" />Re-process AI</>
                          ) : (
                            <><Cog className="mr-2 h-4 w-4" />Process with AI</>
                          )}
                        </DropdownMenuItem>
                      )}
                       <DropdownMenuItem onClick={() => onEdit(doc)} className="cursor-pointer"><Pencil className="mr-2 h-4 w-4 text-gray-700" />Edit Details</DropdownMenuItem>
                       <DropdownMenuItem asChild className="cursor-pointer"><a href={doc.file_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2 h-4 w-4 text-orange-600" />View Document</a></DropdownMenuItem>
                      <DropdownMenuItem onClick={async () => { onDelete([doc.id]); }} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
