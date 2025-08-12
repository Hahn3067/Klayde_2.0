
import React, { useState, useRef, useEffect } from "react";
import { Document } from "@/api/entities";
import { Category } from "@/api/entities";
import { Project } from "@/api/entities";
import { User } from "@/api/entities";
import { UsageLog } from "@/api/entities"; // Added import
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Upload as UploadIcon, FileText, Loader2, CheckCircle, X, Info, Settings, Trash2, Edit, XCircle, FileWarning, Zap, Clock, Brain, Archive, AlertTriangle } from "lucide-react"; // Added AlertTriangle
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import CategoryManager from "../components/upload/CategoryManager";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { deleteDocumentData } from "@/api/functions";
import { processDocument } from '@/api/functions';
import AIFeatureGuide from "../components/upload/AIFeatureGuide";

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const filesEndRef = useRef(null); // Ref for auto-scrolling
  const [dragActive, setDragActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  // Updated selectedFiles state to include document_id and ai_status for manual processing
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progressMessage, setProgressMessage] = useState(""); // For processing status
  const [usageLimits, setUsageLimits] = useState({
    storageUsed: 0,
    tokensUsed: 0,
    storageAtLimit: false,
    tokensAtLimit: false
  });

  useEffect(() => {
    const loadInitialData = async () => {
        try {
            const currentUser = await User.me();
            setUser(currentUser);
            
            // Load usage data
            const [documents, usageData] = await Promise.all([
                Document.list(),
                UsageLog.list()
            ]);
            
            const totalStorage = documents.reduce((sum, doc) => sum + (doc.size || 0), 0);
            const totalTokens = usageData.reduce((sum, log) => sum + log.token_count, 0);
            const maxStorage = 1 * 1024 * 1024 * 1024; // 1 GB
            const maxTokens = 20000;
            
            setUsageLimits({
                storageUsed: totalStorage,
                tokensUsed: totalTokens,
                storageAtLimit: totalStorage >= maxStorage,
                tokensAtLimit: totalTokens >= maxTokens
            });
            
            // Only fetch categories created by current user
            const fetchedCategories = await Category.filter({ created_by: currentUser.email });
            setCategories(fetchedCategories.map(c => c.name));
            
            const allProjects = await Project.list();
            const accessibleProjects = currentUser.role === 'admin'
                ? allProjects
                : allProjects.filter(p => p.member_emails?.includes(currentUser.email));
            setProjects(accessibleProjects);

        } catch (err) {
            console.error("Failed to load initial data:", err);
            setError("Failed to load page data. Please refresh.");
        }
    };
    loadInitialData();
  }, []);

  // Auto-scroll to the bottom of the file list when a new file is added
  useEffect(() => {
    if (selectedFiles.length > 0) {
      filesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [selectedFiles.length]);

  const fetchCategories = async () => {
    try {
      if (user) { // Ensure user is loaded before fetching categories
        const fetchedCategories = await Category.filter({ created_by: user.email });
        setCategories(fetchedCategories.map(c => c.name));
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to load categories.");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileSelect(files);
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const getFileProcessingStatus = (fileType) => {
    const aiSupportedFormats = ['pdf', 'txt', 'md', 'csv'];
    return aiSupportedFormats.includes(fileType.toLowerCase()) ? 'ai_eligible' : 'storage_only';
  };

  const handleFileSelect = async (files) => {
    const validFiles = files.filter(file => {
      if (file.size > 48 * 1024 * 1024) {
        setError(`File "${file.name}" is too large. Maximum size is 48MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;
    setError(null);

    // Just add files to the list without uploading
    const initialFilesData = validFiles.map(file => {
      const fileType = file.name.split('.').pop()?.toLowerCase() || 'unknown';
      const processingStatus = getFileProcessingStatus(fileType);
      
      return {
        id: Math.random().toString(36).substring(2, 9), // temp client-side ID
        file,
        name: file.name,
        title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        description: "",
        category: "",
        tags: [],
        project_id: null,
        is_public: false,
        size: file.size,
        file_type: fileType,
        processing_status: processingStatus, // New field
        status: 'ready', // Changed from 'uploading' to 'ready'
        uploadProgress: 0,
        file_url: null,
        error: null,
        document_id: null, // New: Will store the backend Document ID after successful save to DB
        ai_status: processingStatus === 'ai_eligible' ? 'not_processed' : 'storage_only', // New: Status of AI processing for this document ('not_processed', 'processing', 'processed', 'failed', 'storage_only')
        manual_text: "", // Add manual_text field
      };
    });

    setSelectedFiles(prev => [...prev, ...initialFilesData]);
  };

  const handleFileDetailChange = (id, field, value) => {
    setSelectedFiles(prevFiles =>
      prevFiles.map(file => 
        file.id === id ? { ...file, [field]: value } : file
      )
    );
  };
  
  const handleFileTagsChange = (id, value) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    handleFileDetailChange(id, 'tags', items);
  }
  
  const removeFileTag = (id, tagIndex) => {
    const file = selectedFiles.find(f => f.id === id);
    if (file) {
      const newTags = file.tags.filter((_, i) => i !== tagIndex);
      handleFileDetailChange(id, 'tags', newTags);
    }
  }

  const removeFile = (id) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };
  
  // New function to handle manual AI processing for a specific document
  const handleProcessAI = async (fileId, documentId) => {
    // Check token limits before AI processing
    if (usageLimits.tokensAtLimit) {
        setError("AI token limit reached! Please upgrade your plan to process more documents.");
        return;
    }

    if (!documentId) {
        setError("Document ID not found for AI processing. Please ensure the document is saved first.");
        return;
    }

    setSelectedFiles(prevFiles =>
        prevFiles.map(file =>
            file.id === fileId ? { ...file, ai_status: 'processing' } : file
        )
    );

    try {
        await processDocument({ documentId });
        setSelectedFiles(prevFiles =>
            prevFiles.map(file =>
                file.id === fileId ? { ...file, ai_status: 'processed' } : file
            )
        );
    } catch (err) {
        console.error(`Failed to process document ${documentId} by AI:`, err);
        setSelectedFiles(prevFiles =>
            prevFiles.map(file =>
                file.id === fileId ? { ...file, ai_status: 'failed', error: err.message || 'AI processing failed' } : file
            )
        );
        setError(`Failed to process AI for document ${selectedFiles.find(f => f.id === fileId)?.name}: ${err.message || 'Unknown error'}`);
    }
  };

  const handleUploadDocuments = async (e) => {
    e.preventDefault();
    
    // Check storage limits before upload
    if (usageLimits.storageAtLimit) {
      setError("Storage limit reached! Please upgrade your plan to upload more documents.");
      return;
    }
    
    // Filter for files that are ready to be uploaded to storage
    const filesToUpload = selectedFiles.filter(f => f.status === 'ready');
    if (filesToUpload.length === 0) {
      setError("No new files to upload or all files are already uploaded.");
      return;
    }

    // Check if upload would exceed storage limit
    const uploadSize = filesToUpload.reduce((sum, file) => sum + file.size, 0);
    const maxStorage = 1 * 1024 * 1024 * 1024; // 1 GB
    if (usageLimits.storageUsed + uploadSize > maxStorage) {
      setError(`Upload would exceed storage limit. You need ${((usageLimits.storageUsed + uploadSize - maxStorage) / (1024 * 1024)).toFixed(1)} MB more space.`);
      return;
    }

    if (!user) {
        setError("User information not loaded. Please refresh and try again.");
        return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    let successfulUploads = []; // To hold files successfully uploaded to storage

    // Step 1: Upload all files to storage first concurrently
    setProgressMessage(`Uploading ${filesToUpload.length} file(s) to storage...`);
    
    // Create an array of promises for concurrent uploads
    const uploadPromises = filesToUpload.map(async (fileData) => {
        // Optimistically set status to 'uploading' and initial progress
        setSelectedFiles(prevFiles => 
            prevFiles.map(pf => 
                pf.id === fileData.id ? { ...pf, status: 'uploading', uploadProgress: 10 } : pf
            )
        );

        try {
            const { file_url } = await UploadFile({ file: fileData.file });
            // Add to successfulUploads only after successful storage upload
            successfulUploads.push({ ...fileData, file_url });
            
            // Update UI for successfully uploaded file
            setSelectedFiles(prevFiles => 
                prevFiles.map(pf => 
                    pf.id === fileData.id 
                        ? { ...pf, status: 'uploaded', file_url, uploadProgress: 100 }
                        : pf
                )
            );
        } catch (err) {
            console.error("Upload error for", fileData.name, err);
            // Update UI for failed upload
            setSelectedFiles(prevFiles => 
                prevFiles.map(pf => 
                    pf.id === fileData.id 
                        ? { ...pf, status: 'error', error: 'Upload failed', uploadProgress: 0 }
                        : pf
                )
            );
        }
    });

    // Wait for all storage uploads to complete (or fail)
    await Promise.all(uploadPromises);

    // Step 2: Save successfully uploaded files to the database
    if (successfulUploads.length === 0) {
        setError("No files were successfully uploaded to storage and ready to be saved to database.");
        setIsSaving(false);
        return;
    }

    setProgressMessage(`Saving ${successfulUploads.length} document(s) to database...`);
    try {
        const uploaderName = user.full_name || user.username || user.email; // Get user's name

        const createPromises = successfulUploads.map(file => {
            const { title, description, category, tags, is_public, project_id, file_url, file_type, manual_text, processing_status, size } = file;
            return Document.create({
                title, description, category, tags, is_public, project_id, file_url, file_type, manual_text, size,
                ai_processed_successfully: processing_status === 'ai_eligible' ? false : true, // Set to true if storage_only as no AI processing is expected
                uploaded_by_name: uploaderName,
            }).then(doc => ({ client_id: file.id, document: doc }));
        });
        
        const createdDocumentsWithClientIds = await Promise.all(createPromises);
        
        // Update UI with document IDs from the database
        setSelectedFiles(prevFiles => {
            return prevFiles.map(file => {
                const created = createdDocumentsWithClientIds.find(cd => cd.client_id === file.id);
                if (created) {
                    return {
                        ...file,
                        document_id: created.document.id,
                        // ai_status logic based on processing_status is already set during handleFileSelect
                        // If it was 'not_processed' (ai_eligible), it remains that. If 'storage_only', it remains that.
                    };
                }
                return file;
            });
        });

        setProgressMessage("Documents uploaded and saved successfully!");
        setSuccess(true);

    } catch (dbError) {
      setError("An error occurred during the database save operation. Please check individual files for errors.");
      console.error("Database save error:", dbError);
      setProgressMessage("");
    } finally {
      setIsSaving(false);
    }
  };

  // Determine if there are any files ready to be uploaded to storage
  const hasFilesToUpload = selectedFiles.some(f => f.status === 'ready');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight mb-4">
            Upload Documents
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Add new documents to your research collection. You can upload multiple files at once.
          </p>
          {user && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-700">
                <span className="font-medium">Uploading as:</span> {user.full_name || user.username || user.email}
              </p>
            </div>
          )}
        </motion.div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Usage Limits Warning */}
        {(usageLimits.storageAtLimit || usageLimits.tokensAtLimit) && (
          <Alert className="border-red-300 bg-red-50 mb-6">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800 font-bold">Usage Limits Reached</AlertTitle>
            <AlertDescription className="text-red-700">
              {usageLimits.storageAtLimit && "Storage is full - cannot upload more files. "}
              {usageLimits.tokensAtLimit && "AI tokens exhausted - cannot process documents with AI. "}
              <Link to={createPageUrl("Pricing")} className="underline font-medium">
                Upgrade your plan
              </Link> to continue using all features.
            </AlertDescription>
          </Alert>
        )}

        <AIFeatureGuide />

        <Alert className="border-blue-300 bg-blue-50 mb-6">
          <Brain className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800 font-bold">File Support Information</AlertTitle>
          <AlertDescription className="text-blue-700 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="font-semibold text-green-700 mb-1">✅ AI Processing Supported:</p>
                <ul className="text-sm list-disc list-inside">
                  <li>PDF files</li>
                  <li>Text files (.txt, .md)</li>
                  <li>CSV spreadsheets</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-orange-700 mb-1">📁 Storage Only:</p>
                <ul className="text-sm list-disc list-inside">
                  <li>Word docs (.docx, .doc)</li>
                  <li>Excel files (.xlsx, .xls)</li>
                  <li>PowerPoint (.pptx, .ppt)</li>
                  <li>Images (.png, .jpg, .jpeg)</li>
                  <li>Other file types</li>
                </ul>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <Alert className="border-red-300 bg-red-50 mb-6">
            <FileWarning className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Important: Manual Text Override</AlertTitle>
            <AlertDescription className="text-red-700">
                If automated text extraction fails, you can <strong>manually paste the document's text</strong> into the "Manual Text Content" field below. This will guarantee accurate AI processing and search results.
            </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 gap-8">
            <Card className="shadow-sm border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-800">Select & Upload Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  onDragEnter={usageLimits.storageAtLimit ? undefined : handleDrag}
                  onDragLeave={usageLimits.storageAtLimit ? undefined : handleDrag}
                  onDragOver={usageLimits.storageAtLimit ? undefined : handleDrag}
                  onDrop={usageLimits.storageAtLimit ? undefined : handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    usageLimits.storageAtLimit
                      ? "border-red-300 bg-red-50 opacity-50 cursor-not-allowed"
                      : dragActive 
                        ? "border-orange-400 bg-orange-50" 
                        : "border-gray-300 hover:border-orange-400"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileInputChange}
                    className="hidden"
                    multiple
                  />
                  
                  <div className="flex flex-col items-center gap-4">
                    <UploadIcon className={`w-12 h-12 ${usageLimits.storageAtLimit ? 'text-red-300' : 'text-orange-400'}`} />
                    <div>
                      <p className={`text-lg font-medium mb-2 ${
                        usageLimits.storageAtLimit ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {usageLimits.storageAtLimit 
                          ? "Storage limit reached - Cannot upload files"
                          : "Drag & drop files here, or click to select"
                        }
                      </p>
                      <button 
                        type="button"
                        onClick={() => !usageLimits.storageAtLimit && fileInputRef.current?.click()}
                        disabled={usageLimits.storageAtLimit}
                        className={`font-semibold py-2 px-4 rounded-md transition-colors mt-2 ${
                          usageLimits.storageAtLimit
                            ? 'bg-red-300 text-red-700 cursor-not-allowed'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                        style={{ fontFamily: 'system-ui, sans-serif' }}
                      >
                        {usageLimits.storageAtLimit ? 'Storage Full' : 'Choose Files'}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedFiles.length > 0 && (
                <Card className="shadow-sm border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-800">Edit Document Details</CardTitle>
                    <p className="text-sm text-gray-600">Review and edit details for each uploaded file before saving.</p>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full" defaultValue={selectedFiles[0]?.id}>
                        {selectedFiles.map((file, index) => (
                          <AccordionItem key={file.id} value={file.id}>
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 w-full">
                                    <div className="flex-shrink-0">
                                        {file.status === 'ready' && <FileText className="w-5 h-5 text-blue-500" />}
                                        {file.status === 'uploading' && <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />}
                                        {file.status === 'uploaded' && <CheckCircle className="w-5 h-5 text-green-500" />}
                                        {file.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium text-gray-800 truncate">{file.name}</p>
                                        <div className="text-xs text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                                
                                                {/* Processing Status Badge */}
                                                {file.processing_status === 'ai_eligible' ? (
                                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                                    AI Processing Available
                                                  </Badge>
                                                ) : (
                                                  <Badge className="bg-gray-100 text-gray-600 text-xs">
                                                    Storage Only
                                                  </Badge>
                                                )}
                                                
                                                {file.status === 'ready' && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-blue-500">Ready to Upload</span>
                                                    </>
                                                )}
                                                {file.status === 'uploading' && (
                                                    <>
                                                        <span>•</span>
                                                        <span>Uploading {Math.round(file.uploadProgress || 0)}%</span>
                                                    </>
                                                )}
                                                {file.status === 'uploaded' && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-green-500">Upload Complete</span>
                                                    </>
                                                )}
                                                {file.status === 'error' && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-red-500">{file.error}</span>
                                                    </>
                                                )}
                                            </div>
                                            {file.status === 'uploading' && (
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                                    <div 
                                                        className="bg-orange-500 h-1.5 rounded-full transition-all duration-300" 
                                                        style={{ width: `${file.uploadProgress || 0}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                            {file.status === 'uploaded' && file.document_id && (
                                                <span className="text-green-500 font-medium"> • Saved to Database</span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          removeFile(file.id);
                                      }}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                                      style={{ fontFamily: 'system-ui, sans-serif' }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 bg-gray-50 rounded-b-md border-t">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`title-${file.id}`}>Title</Label>
                                    <Input
                                      id={`title-${file.id}`}
                                      value={file.title}
                                      onChange={(e) => handleFileDetailChange(file.id, 'title', e.target.value)}
                                      placeholder="Document title"
                                      className="border-gray-300 focus:border-orange-500 bg-white"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`description-${file.id}`}>Description</Label>
                                    <Textarea
                                      id={`description-${file.id}`}
                                      value={file.description}
                                      onChange={(e) => handleFileDetailChange(file.id, 'description', e.target.value)}
                                      placeholder="Brief description or abstract"
                                      className="h-24 border-gray-300 focus:border-orange-500 bg-white"
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Project (Optional)</Label>
                                        <Select
                                          value={file.project_id || ""}
                                          onValueChange={(value) => handleFileDetailChange(file.id, 'project_id', value === "" ? null : value)}
                                        >
                                          <SelectTrigger className="border-gray-300 bg-white">
                                            <SelectValue placeholder="Assign to a project" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value={null}>None (Public to Lab)</SelectItem>
                                            {projects.map(proj => (
                                              <SelectItem key={proj.id} value={proj.id}>
                                                {proj.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                          <Label htmlFor={`category-${file.id}`}>Category</Label>
                                          <button
                                            type="button"
                                            onClick={() => setIsCategoryModalOpen(true)}
                                            className="h-6 px-2 text-xs text-gray-700 hover:bg-gray-100 rounded"
                                            style={{ fontFamily: 'system-ui, sans-serif' }}
                                          >
                                            <Settings className="w-3 h-3 mr-1 inline-block align-middle" /> <span className="inline-block align-middle">Manage</span>
                                          </button>
                                        </div>
                                        <Select
                                          value={file.category}
                                          onValueChange={(value) => handleFileDetailChange(file.id, 'category', value)}
                                        >
                                          <SelectTrigger id={`category-${file.id}`} className="border-gray-300 bg-white">
                                            <SelectValue placeholder="Select category" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {categories.map(cat => (
                                              <SelectItem key={cat} value={cat}>
                                                {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`tags-${file.id}`}>Tags (comma separated)</Label>
                                    <Input
                                      id={`tags-${file.id}`}
                                      value={file.tags.join(', ')}
                                      onChange={(e) => handleFileTagsChange(file.id, e.target.value)}
                                      placeholder="tag1, tag2, tag3"
                                      className="border-gray-300 focus:border-orange-500 bg-white"
                                    />
                                    {file.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-2 pt-1">
                                        {file.tags.map((tag, index) => (
                                          <Badge key={index} variant="secondary" className="bg-white text-gray-800">
                                            {tag}
                                            <button
                                              type="button"
                                              onClick={() => removeFileTag(file.id, index)}
                                              className="ml-2 hover:text-red-500"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </Badge>
                                        ))}
                                      </div>
                                  )}
                                  </div>
                                  
                                  {/* Manual Text Input - Only show for AI eligible files */}
                                  {file.processing_status === 'ai_eligible' && (
                                    <div className="space-y-2 pt-4 border-t border-dashed">
                                      <Label htmlFor={`manual-text-${file.id}`}>Manual Text Content (Optional)</Label>
                                      <Textarea
                                        id={`manual-text-${file.id}`}
                                        value={file.manual_text}
                                        onChange={(e) => handleFileDetailChange(file.id, 'manual_text', e.target.value)}
                                        placeholder="If automated extraction fails, paste the full text of the document here for accurate AI processing."
                                        className="h-40 border-gray-300 focus:border-orange-500 bg-white"
                                      />
                                    </div>
                                  )}

                                  {/* AI Processing Status and Button - Only show for AI eligible files */}
                                  {file.document_id && file.processing_status === 'ai_eligible' && (
                                      <div className="space-y-2 pt-4 border-t border-gray-200 mt-4">
                                          <Label>AI Processing Status</Label>
                                          <div className="flex items-center gap-2">
                                              {file.ai_status === 'waiting' && (
                                                  <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                                                      <Clock className="w-3 h-3 mr-1" /> Waiting...
                                                  </Badge>
                                              )}
                                              {file.ai_status === 'not_processed' && (
                                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                                      <Info className="w-3 h-3 mr-1" /> Not Processed
                                                  </Badge>
                                              )}
                                              {file.ai_status === 'processing' && (
                                                  <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                                                      <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing...
                                                  </Badge>
                                              )}
                                              {file.ai_status === 'processed' && (
                                                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                                      <CheckCircle className="w-3 h-3 mr-1" /> Processed
                                                  </Badge>
                                              )}
                                              {file.ai_status === 'failed' && (
                                                  <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                                                      <AlertCircle className="w-3 h-3 mr-1" /> Failed ({file.error || 'Unknown error'})
                                                  </Badge>
                                              )}

                                              {(file.ai_status === 'not_processed' || file.ai_status === 'failed' || file.ai_status === 'processed') && (
                                                  <button
                                                      type="button"
                                                      onClick={() => handleProcessAI(file.id, file.document_id)}
                                                      disabled={file.ai_status === 'processing' || usageLimits.tokensAtLimit}
                                                      className="ml-auto border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-1 px-3 rounded text-sm disabled:opacity-50"
                                                      style={{ fontFamily: 'system-ui, sans-serif' }}
                                                  >
                                                      {file.ai_status === 'processing' ? (
                                                          <>
                                                              <Loader2 className="w-4 h-4 mr-1 animate-spin inline" /> Processing...
                                                          </>
                                                      ) : file.ai_status === 'processed' ? (
                                                          <>
                                                              <Edit className="w-4 h-4 mr-1 inline" /> Re-Process AI
                                                          </>
                                                      ) : (
                                                          <>
                                                              <FileText className="w-4 h-4 mr-1 inline" /> Process AI
                                                          </>
                                                      )}
                                                  </button>
                                              )}
                                          </div>
                                      </div>
                                  )}

                                  {/* Storage Only Notice */}
                                  {file.processing_status === 'storage_only' && (
                                    <div className="space-y-2 pt-4 border-t border-gray-200 mt-4">
                                      <Label>File Status</Label>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                                          <Archive className="w-3 h-3 mr-1" />
                                          Storage Only - No AI Processing Available
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-gray-500">
                                        This file type (.{file.file_type}) is not supported for AI processing but will be stored for easy access.
                                      </p>
                                    </div>
                                  )}
                                </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                    </Accordion>
                    <div ref={filesEndRef} />
                    <div className="pt-6">
                      <button
                        type="button"
                        onClick={handleUploadDocuments}
                        className="w-full h-12 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base rounded-md transition-colors flex items-center justify-center gap-2"
                        disabled={isSaving || selectedFiles.some(f => f.status === 'uploading') || (!hasFilesToUpload && !success) || usageLimits.storageAtLimit}
                        style={{ fontFamily: 'system-ui, sans-serif' }}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {progressMessage || 'Uploading...'}
                          </>
                        ) : success ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Documents Uploaded!
                          </>
                        ) : (
                          <>
                            <UploadIcon className="mr-2 h-4 w-4" />
                            Upload Documents
                          </>
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>
            )}
        </div>
      </div>
      <CategoryManager 
        isOpen={isCategoryModalOpen}
        setIsOpen={setIsCategoryModalOpen}
        onUpdate={fetchCategories}
      />
    </div>
  );
}
