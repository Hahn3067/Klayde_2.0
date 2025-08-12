import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HardDrive, Zap, Crown, ArrowRight, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function UsageMeter({ storageUsed, tokenCount }) {
  const maxStorage = 1 * 1024 * 1024 * 1024; // 1 GB
  const maxTokens = 20000;
  
  const storagePercentage = Math.min((storageUsed / maxStorage) * 100, 100);
  const tokenPercentage = Math.min((tokenCount / maxTokens) * 100, 100);
  
  const storageAtLimit = storagePercentage >= 100;
  const tokensAtLimit = tokenPercentage >= 100;
  const anyLimitReached = storageAtLimit || tokensAtLimit;
  
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toLocaleString();
  };

  const formatBytes = (bytes, decimals = 1) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="shadow-sm border-gray-200 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Usage Overview
            </CardTitle>
            <div className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
              <Crown className="w-3 h-3" />
              Free Plan
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Limit Reached Warning */}
          {anyLimitReached && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                <strong>Usage limit reached!</strong> 
                {storageAtLimit && " Storage is full."}
                {tokensAtLimit && " AI tokens exhausted."}
                {" "}Some features are now disabled until you upgrade your plan.
              </AlertDescription>
            </Alert>
          )}

          {/* Storage Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  storageAtLimit ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <HardDrive className={`w-4 h-4 ${storageAtLimit ? 'text-red-600' : 'text-blue-600'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Storage</p>
                  <p className="text-xs text-gray-500">{formatBytes(storageUsed)} of {formatBytes(maxStorage)} used</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${storageAtLimit ? 'text-red-600' : 'text-gray-900'}`}>
                  {Math.round(storagePercentage)}%
                </p>
                {storageAtLimit && (
                  <p className="text-xs text-red-600 font-medium">FULL</p>
                )}
              </div>
            </div>
            <Progress 
              value={storagePercentage} 
              className="h-2 bg-gray-100"
              indicatorClassName={storageAtLimit ? "bg-red-500" : storagePercentage >= 70 ? "bg-yellow-500" : "bg-blue-500"}
            />
          </div>

          {/* AI Tokens Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  tokensAtLimit ? 'bg-red-100' : 'bg-purple-100'
                }`}>
                  <Zap className={`w-4 h-4 ${tokensAtLimit ? 'text-red-600' : 'text-purple-600'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">AI Tokens</p>
                  <p className="text-xs text-gray-500">{formatNumber(tokenCount)} of {formatNumber(maxTokens)} used</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${tokensAtLimit ? 'text-red-600' : 'text-gray-900'}`}>
                  {Math.round(tokenPercentage)}%
                </p>
                {tokensAtLimit && (
                  <p className="text-xs text-red-600 font-medium">EXHAUSTED</p>
                )}
              </div>
            </div>
            <Progress 
              value={tokenPercentage} 
              className="h-2 bg-gray-100"
              indicatorClassName={tokensAtLimit ? "bg-red-500" : tokenPercentage >= 70 ? "bg-yellow-500" : "bg-purple-500"}
            />
          </div>

          {/* Upgrade Button */}
          <div className="pt-4 border-t border-gray-100">
            <Link to={createPageUrl("Pricing")}>
              <Button className={`w-full font-medium shadow-sm ${
                anyLimitReached 
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white'
              }`}>
                {anyLimitReached ? 'Upgrade Now - Limits Reached' : 'Upgrade Plan'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}