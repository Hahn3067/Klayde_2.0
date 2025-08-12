
import React, { useState, useEffect } from "react";
import { Document } from "@/api/entities";
import { User } from "@/api/entities";
import { LabInfo } from "@/api/entities";
import { UsageLog } from "@/api/entities"; // Import UsageLog
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  FileText,
  Upload,
  Search,
  TrendingUp,
  Clock,
  Users,
  Lightbulb,
  ArrowRight,
  Pencil,
  Building,
  BrainCircuit,
  Archive,
  Loader2, // New import for loading spinner
  HardDrive // New import for sync icon
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

import QuickStats from "../components/dashboard/QuickStats";
import UsageMeter from "../components/dashboard/UsageMeter";
import RecentUploads from "../components/dashboard/RecentUploads";
import EditLabInfoModal from "../components/dashboard/EditLabInfoModal";
import { syncFileSizes } from '@/api/functions'; // New import for sync utility

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [user, setUser] = useState(null);
  const [labInfo, setLabInfo] = useState(null);
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tokenUsage, setTokenUsage] = useState(0); // State for token usage
  const [storageUsed, setStorageUsed] = useState(0); // State for storage usage
  const [isSyncingFileSizes, setIsSyncingFileSizes] = useState(false); // New state for sync status

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [docsData, userData, labInfoList, teamData, usageData] = await Promise.all([
        Document.list("-created_date", 1000), // Increased limit to get more accurate size
        User.me().catch(() => null),
        LabInfo.list(),
        User.list(),
        UsageLog.list() // Fetch usage logs
      ]);
      setDocuments(docsData);
      setUser(userData);
      setTeam(teamData);

      // Calculate total token usage
      const totalTokens = usageData.reduce((sum, log) => sum + log.token_count, 0);
      setTokenUsage(totalTokens);

      // Calculate total storage usage
      const totalSize = docsData.reduce((sum, doc) => sum + (doc.size || 0), 0);
      setStorageUsed(totalSize);

      if (labInfoList.length > 0) {
        setLabInfo(labInfoList[0]);
      } else {
        const newLabInfo = await LabInfo.create({
          lab_name: 'My Research Lab',
          lab_description: 'Exploring the frontiers of science and innovation.'
        });
        setLabInfo(newLabInfo);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleSyncFileSizes = async () => {
    setIsSyncingFileSizes(true);
    try {
      const { data } = await syncFileSizes();
      alert(data.message);
      // Reload data to reflect updated file sizes
      await loadData();
    } catch (error) {
      console.error('Failed to sync file sizes:', error);
      alert('Failed to sync file sizes. Please try again.');
    } finally {
      setIsSyncingFileSizes(false);
    }
  };

  const getStats = () => {
    const totalDocs = documents.length;
    const memberCount = team.length;
    const processedDocs = documents.filter(doc => doc.ai_processed_successfully).length;
    const ineligibleDocs = totalDocs - processedDocs;

    return { totalDocs, memberCount, processedDocs, ineligibleDocs };
  };

  const stats = getStats();

  const handleLabInfoSave = (updatedInfo) => {
    setLabInfo(updatedInfo);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Lab Info Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl shadow-lg p-8 mb-8 relative"
        >
          <div className="flex items-center gap-4">
            <Building className="w-12 h-12 flex-shrink-0" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {labInfo ? labInfo.lab_name : "Loading Lab..."}
              </h1>
              <p className="text-orange-100 mt-1 text-base md:text-lg">
                {labInfo ? labInfo.lab_description : "Welcome to your research hub."}
              </p>
            </div>
          </div>
          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-2">
            {user?.role === 'admin' && (
              <>
                <button
                  className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center gap-2 text-sm"
                  onClick={handleSyncFileSizes}
                  disabled={isSyncingFileSizes}
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {isSyncingFileSizes ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <HardDrive className="w-4 h-4" />
                      <span className="hidden md:inline">Sync File Sizes</span>
                    </>
                  )}
                </button>
                <button
                  className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                  onClick={() => setIsEditModalOpen(true)}
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  <Pencil className="w-4 h-4" />
                  <span className="hidden md:inline">Edit Lab Info</span>
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight">
                Welcome back{user ? `, ${user.username || user.full_name?.split(' ')[0]}` : ''}
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                Here's a quick overview of your lab's activity.
              </p>
            </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8"
        >
          <QuickStats
            title="Total Documents"
            value={stats.totalDocs}
            icon={FileText}
            bgColor="bg-blue-500"
            description="in your collection"
          />
          <QuickStats
            title="Team Members"
            value={stats.memberCount}
            icon={Users}
            bgColor="bg-emerald-500"
            description="in this lab"
          />
          <QuickStats
            title="AI Processed"
            value={stats.processedDocs}
            icon={BrainCircuit}
            bgColor="bg-purple-500"
            description="docs with metadata"
          />
          <QuickStats
            title="Storage Only"
            value={stats.ineligibleDocs}
            icon={Archive}
            bgColor="bg-slate-500"
            description="docs without AI data"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Uploads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <RecentUploads
              documents={documents.slice(0, 6)}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Usage Meter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <UsageMeter
              storageUsed={storageUsed}
              tokenCount={tokenUsage}
            />
          </motion.div>
        </div>
      </div>

      {labInfo && (
        <EditLabInfoModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          labInfo={labInfo}
          onSave={handleLabInfoSave}
        />
      )}
    </div>
  );
}
