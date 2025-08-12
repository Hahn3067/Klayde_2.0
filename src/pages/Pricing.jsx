
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "For small labs and personal projects getting started.",
      features: [
        "1 GB Storage",
        "20,000 AI Tokens/month",
        "<strong>Unlimited Members</strong>",
        "AI-Powered Search",
        "Document Upload (PDF, TXT, etc.)"
      ],
      isMostPopular: false,
      buttonText: "Your Current Plan",
      isCurrentPlan: true
    },
    {
      name: "Starter",
      price: "$19",
      description: "For growing labs that need more capacity.",
      features: [
        "10 GB Storage",
        "100,000 AI Tokens/month",
        "<strong>Unlimited Members</strong>",
        "Priority AI Processing",
        "Team Projects"
      ],
      isMostPopular: true,
      buttonText: "Choose Starter",
      isCurrentPlan: false
    },
    {
      name: "Intermediate",
      price: "$49",
      description: "For established labs with large knowledge bases.",
      features: [
        "30 GB Storage",
        "500,000 AI Tokens/month",
        "<strong>Unlimited Members</strong>",
        "Advanced Analytics",
        "Dedicated Support"
      ],
      isMostPopular: false,
      buttonText: "Choose Intermediate",
      isCurrentPlan: false
    },
    {
      name: "Pro",
      price: "$99",
      description: "For large organizations with extensive needs.",
      features: [
        "100 GB Storage",
        "2,000,000 AI Tokens/month",
        "<strong>Unlimited Members</strong>",
        "API Access",
        "$1/GB for extra storage"
      ],
      isMostPopular: false,
      buttonText: "Contact Us",
      isCurrentPlan: false
    }
  ];

export default function Pricing() {
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6 lg:p-8">
                <motion.div {...fadeInUp} className="text-center mb-16">
                    <h1 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-6">
                        Pricing Plans for Every Lab
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Choose the plan that fits your team's needs. All plans come with our core AI features and no limits on members.
                    </p>
                </motion.div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {pricingPlans.map((plan, index) => (
                    <motion.div
                        key={index}
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.3 }}
                        whileHover={{ y: -10 }}
                        className="h-full"
                    >
                        <Card className={`h-full flex flex-col ${plan.isMostPopular ? 'border-2 border-orange-500 shadow-2xl' : 'border-gray-200 shadow-lg'} bg-white`}>
                        {plan.isMostPopular && (
                            <div className="bg-orange-500 text-white text-xs font-bold uppercase tracking-wider text-center py-1 rounded-t-lg">Most Popular</div>
                        )}
                        <CardContent className="p-8 flex flex-col flex-grow h-full">
                            <div className="text-center mb-6 h-32">
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-4xl font-bold mb-4">{plan.price}<span className="text-sm font-normal text-gray-500">/month</span></p>
                                <p className="text-gray-600 text-sm">{plan.description}</p>
                            </div>
                            
                            <ul className="space-y-3 mb-8 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: feature }} />
                                    </li>
                                ))}
                            </ul>
                            
                            <div className="mt-auto">
                                {plan.isCurrentPlan ? (
                                    <button 
                                        className="w-full py-3 px-4 bg-gray-200 text-gray-600 font-medium rounded-md cursor-not-allowed"
                                        disabled
                                        style={{ fontFamily: 'system-ui, sans-serif' }}
                                    >
                                        {plan.buttonText}
                                    </button>
                                ) : (
                                    <button 
                                        className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-colors"
                                        style={{ fontFamily: 'system-ui, sans-serif' }}
                                    >
                                        {plan.buttonText}
                                    </button>
                                )}
                            </div>
                        </CardContent>
                        </Card>
                    </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
