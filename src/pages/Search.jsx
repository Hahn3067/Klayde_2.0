
import React, { useState, useEffect } from "react";
import { Document } from "@/api/entities";
import { Button } from "@/components/ui/button"; // Still imported, but its usage in this file is replaced by native buttons per outline.
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search as SearchIcon, 
  Loader2, 
  FileText, 
  Calendar,
  User,
  Tag,
  Lightbulb,
  Brain,
  ExternalLink,
  Sparkles,
  AlertTriangle // Added AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import { aiSearch } from "@/api/functions";
import { UsageLog } from "@/api/entities"; // New import for UsageLog
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // New imports for Alert components
import { Link } from 'react-router-dom'; // Assuming react-router-dom for Link

// Dummy createPageUrl function for demonstration if not globally available
// In a real application, this would be imported from a routing utility
const createPageUrl = (pageName) => {
  switch(pageName) {
    case "Pricing":
      return "/pricing";
    default:
      return "/";
  }
};

export default function Search() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null); // Will be an array of Document or null
  const [hasSearched, setHasSearched] = useState(false);
  const [searchMessage, setSearchMessage] = useState(""); // Message for no results or error
  const [debugInfo, setDebugInfo] = useState(null); // Add debug info state
  const [tokensAtLimit, setTokensAtLimit] = useState(false); // New state for token limit

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

  useEffect(() => {
    const checkTokenLimits = async () => {
      try {
        const usageData = await UsageLog.list();
        const totalTokens = usageData.reduce((sum, log) => sum + log.token_count, 0);
        const maxTokens = 20000;
        setTokensAtLimit(totalTokens >= maxTokens);
      } catch (error) {
        console.error("Failed to check token limits:", error);
        // Optionally, set tokensAtLimit to true on error to prevent usage if limit check fails
        // setTokensAtLimit(true); 
      }
    };
    checkTokenLimits();
  }, []);

  const performAISearch = async () => {
    if (!query.trim()) return;
    
    if (tokensAtLimit) {
      setSearchMessage("AI token limit reached! Please upgrade your plan to continue using AI search.");
      setSearchResults([]);
      setHasSearched(true);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setSearchResults(null); // Clear previous results
    setSearchMessage(""); // Clear previous message
    setDebugInfo(null); // Clear previous debug info
    
    try {
      console.log('Starting AI search with query:', query.trim());
      const { data } = await aiSearch({ query: query.trim() });
      console.log('AI search response:', data);

      setDebugInfo(data.debug); // Store debug info

      if (data.results && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]); // Set to empty array if no results
        setSearchMessage(data.answer || "No relevant documents found."); // Use AI answer as message or default
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]); // Set to empty array on error
      setSearchMessage(`Sorry, I encountered an error: ${error.message}. Please try again.`);
    }
    
    setIsSearching(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      performAISearch();
    }
  };

  const suggestions = [
    "What are the key findings in our recent research?",
    "Show me protocols for cell culture",
    "Find meeting notes about project deadlines",
    "What data analysis methods were used?",
    "Search for grant proposal requirements",
    "Find literature reviews on machine learning"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight mb-4">
            AI-Powered Document Search
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Ask questions about your documents and find the most relevant files.
          </p>
          
          {/* Token Limit Warning */}
          {tokensAtLimit && (
            <Alert className="border-red-300 bg-red-50 mb-6">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800 font-bold">AI Token Limit Reached</AlertTitle>
              <AlertDescription className="text-red-700">
                You have exhausted your monthly AI tokens. 
                <Link to={createPageUrl("Pricing")} className="underline font-medium ml-1">
                  Upgrade your plan
                </Link> to continue using AI search.
              </AlertDescription>
            </Alert>
          )}

          {/* Search Bar */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Ask a question about your documents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 h-12 text-lg border-gray-300 focus:border-orange-500 bg-white"
                disabled={tokensAtLimit} // Disable input if token limit is reached
              />
            </div>
            <button 
              onClick={performAISearch}
              disabled={isSearching || !query.trim() || tokensAtLimit} // Disable button if token limit is reached
              className={`h-12 px-8 font-semibold rounded-md transition-colors flex items-center gap-2 ${
                tokensAtLimit
                  ? 'bg-red-300 text-red-700 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white'
              }`}
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : tokensAtLimit ? (
                "Limit Reached"
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Ask AI
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Debug Info - Show this for troubleshooting */}
        {debugInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="shadow-sm border-orange-200 bg-orange-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-orange-800">Debug Information</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-orange-700">
                <p>Query: "{debugInfo.query}"</p>
                <p>Total processed documents in database: {debugInfo.totalEmbeddings}</p>
                <p>Matching chunks found: {debugInfo.totalChunksFound}</p>
                <p>Chunks used (similarity ≥ 0.1): {debugInfo.chunksUsed}</p>
                {debugInfo.topSimilarity > 0 && (
                  <p>Best similarity score: {Math.round(debugInfo.topSimilarity * 100)}%</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search Suggestions */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="shadow-sm border-gray-200 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Try asking questions like these
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <button
                        className="w-full text-left h-auto p-3 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-md transition-colors flex items-start gap-3"
                        onClick={() => setQuery(suggestion)}
                        style={{ fontFamily: 'system-ui, sans-serif' }}
                        disabled={tokensAtLimit} // Also disable suggestions if token limit is reached
                      >
                        <Sparkles className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <div className="flex items-center gap-3 text-gray-600">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-lg">Searching your documents...</span>
              </div>
            </motion.div>
          ) : searchResults !== null && ( // Ensure searchResults is not null (meaning a search has completed)
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Source Documents */}
              {searchResults.length > 0 ? (
                <Card className="shadow-sm border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-orange-600" />
                      Search Results
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        ({searchResults.length} found)
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {searchResults.map((doc, index) => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => window.open(doc.file_url, '_blank')}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                {doc.title}
                                <ExternalLink className="w-4 h-4 text-gray-400" />
                              </h3>
                              
                              {doc.relevantExcerpt && (
                                <p className="text-sm text-gray-600 mb-3 italic">
                                  "{doc.relevantExcerpt}"
                                </p>
                              )}
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(new Date(doc.created_date), 'MMM d, yyyy')}
                                </div>
                                
                                {doc.category && (
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs ${categoryColors[doc.category] || categoryColors.other}`}
                                  >
                                    {doc.category.replace(/_/g, ' ')}
                                  </Badge>
                                )}
                                
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {Math.round(doc.similarity * 100)}% match
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                 <div className="text-center py-12 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Relevant Documents Found</h3>
                    <p className="text-gray-500 max-w-md mx-auto">{searchMessage}</p>
                  </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
