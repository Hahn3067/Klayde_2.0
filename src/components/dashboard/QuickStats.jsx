import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function QuickStats({ title, value, icon: Icon, bgColor, description }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
        <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 ${bgColor} rounded-full opacity-10`} />
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                {value}
              </p>
              <p className="text-xs text-gray-400">{description}</p>
            </div>
            <div className={`p-3 rounded-xl ${bgColor} bg-opacity-20`}>
              <Icon className={`w-5 h-5 ${bgColor.replace('bg-', 'text-')}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}