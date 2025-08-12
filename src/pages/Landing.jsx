
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Upload,
  Users,
  BrainCircuit,
  FileText,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle,
  Beaker,
  MessageSquare,
  Building,
  BookOpen,
  Target,
  Check,
  Menu
} from "lucide-react";
import { motion } from "framer-motion";
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Link } from "react-router-dom"; // Added for Link component
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


export default function Landing() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        // User not logged in, which is fine for a landing page
        setUser(null);
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: Upload,
      title: "Smart Document Upload",
      description: "Upload PDFs, images, and text files. Our AI automatically extracts text, generates summaries, and creates searchable metadata.",
      color: "bg-blue-500"
    },
    {
      icon: Search,
      title: "AI-Powered Search",
      description: "Ask questions in natural language. Find documents based on meaning, not just keywords. Get instant answers from your knowledge base.",
      color: "bg-purple-500"
    },
    {
      icon: MessageSquare,
      title: "Conversational AI Chat",
      description: "Chat with your documents like talking to a research assistant. Get detailed answers with source citations from your uploaded files.",
      color: "bg-green-500"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Organize research into projects. Control access with team member permissions. Share knowledge seamlessly across your lab.",
      color: "bg-orange-500"
    },
    {
      icon: Shield,
      title: "Selective AI Processing",
      description: "You control which documents get AI processing. Keep sensitive data as storage-only while making non-confidential research searchable and discoverable.",
      color: "bg-red-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant search results across thousands of documents. Real-time AI processing. Find what you need in seconds, not hours.",
      color: "bg-yellow-500"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Upload Your Documents",
      description: "Drag and drop research papers, protocols, meeting notes, and any other documents into Klayde.",
      icon: Upload
    },
    {
      step: "2",
      title: "AI Processes Everything",
      description: "Our AI automatically extracts text, generates summaries, identifies key concepts, and creates searchable embeddings.",
      icon: BrainCircuit
    },
    {
      step: "3",
      title: "Search & Discover",
      description: "Ask questions, search by meaning, chat with your documents, and get instant insights from your knowledge base.",
      icon: Search
    }
  ];

  const useCases = [
    {
      icon: "📄",
      title: "Find Lost Papers",
      description: "\"I read a study about X, but can't remember the author or title\" - Just ask Klayde and it'll find it instantly."
    },
    {
      icon: "🧪",
      title: "Preserve Lab Knowledge",
      description: "When team members leave, their protocols and insights stay. No more losing years of experimental knowledge."
    },
    {
      icon: "💡",
      title: "Instant Research Answers",
      description: "Get immediate answers from your lab's collective papers, notes, and protocols without digging through folders."
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "For small labs and personal projects getting started.",
      features: [
        "1 GB Storage",
        "10,000 AI Tokens/month",
        "<strong>Unlimited Members</strong>",
        "AI-Powered Search",
        "Document Upload (PDF, TXT, etc.)"
      ],
      isMostPopular: false,
      buttonText: "Get Started Free"
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
      buttonText: "Choose Starter"
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
      buttonText: "Choose Intermediate"
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
      buttonText: "Contact Us"
    }
  ];

  const faqs = [
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade security protocols. Your data is encrypted, private, and is never used for training third-party models. You have full control over your knowledge base."
    },
    {
      question: "What kind of documents can I upload?",
      answer: "You can upload a wide range of file types, including PDF, DOCX, TXT, MD, and CSV. Our AI automatically extracts the text content to make it fully searchable."
    },
    {
      question: "How does the AI search work?",
      answer: "Instead of just matching keywords, our AI understands the meaning and context of your questions. This allows you to find documents based on concepts, even if you don't remember the exact phrasing, title, or author."
    },
    {
      question: "Can I collaborate with my team?",
      answer: "Yes! Collaboration is a core feature. You can create projects to group documents, and manage team member access to ensure the right people have access to the right information."
    },
    {
      question: "What happens if I go over my monthly token limit?",
      answer: "On our paid plans, we offer options to purchase additional token packs or upgrade to a higher tier. For the Pro plan, we can create custom enterprise solutions. Please contact us for more details."
    },
    {
      question: "Can I cancel my plan at any time?",
      answer: "Yes, you can cancel your subscription at any time. There are no long-term contracts, and you'll retain access to your plan's features until the end of the current billing period."
    }
  ];

  const handleLogin = async () => {
    const callbackUrl = window.location.origin + '/Dashboard';
    await User.loginWithRedirect(callbackUrl);
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Beaker className="w-12 h-12 text-orange-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Beaker className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold">Klayde</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-base font-medium hover:text-orange-600 transition-colors">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-base font-medium hover:text-orange-600 transition-colors">How It Works</button>
              <button onClick={() => scrollToSection('pricing')} className="text-base font-medium hover:text-orange-600 transition-colors">Pricing</button>
              <button onClick={() => scrollToSection('faq')} className="text-base font-medium hover:text-orange-600 transition-colors">FAQ</button>
            </nav>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link to={createPageUrl("Dashboard")}>
                    <Button variant="outline" size="sm" className="text-base px-4 py-2">
                      Dashboard
                    </Button>
                  </Link>
                  <span className="text-sm text-gray-600 hidden md:inline-block">Welcome, {user.username || user.full_name?.split(' ')[0] || 'User'}</span>
                </>
              ) : (
                <Button onClick={handleLogin} size="sm" className="bg-orange-600 hover:bg-orange-700 text-base px-6 py-2">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Dynamic Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)",
                "linear-gradient(135deg, #ffedd5 0%, #fed7aa 50%, #fef3c7 100%)",
                "linear-gradient(135deg, #fed7aa 0%, #fef3c7 50%, #fff7ed 100%)",
                "linear-gradient(135deg, #fef3c7 0%, #fff7ed 50%, #ffedd5 100%)",
                "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)",
              ]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, #fb923c 0%, transparent 40%)",
                "radial-gradient(circle at 80% 20%, #facc15 0%, transparent 40%)",
                "radial-gradient(circle at 40% 90%, #fdba74 0%, transparent 40%)",
                "radial-gradient(circle at 90% 60%, #fde68a 0%, transparent 40%)",
                "radial-gradient(circle at 20% 50%, #fb923c 0%, transparent 40%)"
              ]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Beaker className="w-9 h-9 text-white" />
              </motion.div>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Never Lose Research Knowledge Again
            </h1>

            <p className="text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
              Klayde transforms how research labs and academic teams preserve and access their collective knowledge. Find that paper you vaguely remember, recover protocols from departed lab members, and ensure decades of research insights are never lost to turnover again.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-lg px-8 py-4 h-auto shadow-lg"
                  onClick={handleLogin}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </div>

            {/* Use Cases */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-4xl mb-4">{useCase.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{useCase.title}</h3>
                  <p className="text-md text-gray-600 leading-relaxed">{useCase.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-gradient-to-br from-orange-25 to-orange-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-6">
              Everything You Need for Research Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful AI tools designed specifically for research teams who want to preserve
              and leverage their collective knowledge while maintaining complete control over sensitive data.
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp} whileHover={{ y: -10 }}>
                <Card className="h-full bg-white border-orange-100 hover:shadow-xl transition-all duration-300 hover:border-orange-200">
                  <CardContent className="p-8">
                    <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get up and running in minutes. Our AI handles the complex work so you can focus on research.
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid lg:grid-cols-3 gap-12"
          >
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center relative"
                whileHover={{ scale: 1.05 }}
              >
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-orange-300 to-orange-200 opacity-50 transform -translate-x-1/2" />
                )}

                <div className="relative">
                  <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-orange-500 to-orange-400 rounded-full flex items-center justify-center shadow-2xl">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                      <step.icon className="w-10 h-10 text-orange-600" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {step.step}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32 bg-gradient-to-br from-orange-25 to-orange-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-6">
              Pricing Plans for Every Lab
            </h2>
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
              >
                <Card className={`h-full flex flex-col ${plan.isMostPopular ? 'border-2 border-orange-500 shadow-2xl' : 'border-gray-200 shadow-lg'} bg-white`}>
                  {plan.isMostPopular && (
                    <div className="bg-orange-500 text-white text-xs font-bold uppercase tracking-wider text-center py-1 rounded-t-lg">Most Popular</div>
                  )}
                  <CardContent className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-4xl font-bold mb-4">{plan.price}<span className="text-sm font-normal text-gray-500">/month</span></p>
                    <p className="text-gray-600 mb-6 text-sm h-12">{plan.description}</p>
                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: feature }} />
                        </li>
                      ))}
                    </ul>
                    <Button onClick={handleLogin} className={`w-full mt-auto ${plan.isMostPopular ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-800 hover:bg-gray-900'}`}>
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We've got answers.
            </p>
          </motion.div>
          <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={staggerChildren}>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <AccordionItem value={`item-${index}`} className="border-b">
                    <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-base text-gray-600 leading-relaxed pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Research Workflow?
            </h2>
            <p className="text-xl text-orange-100 mb-12 leading-relaxed">
              Join leading research teams who never lose important knowledge again.
              Start your free trial today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-8 py-4 h-auto font-semibold shadow-lg"
                  onClick={handleLogin}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-orange-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Setup in 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Klayde. All rights reserved.</p>
          <p className="text-xs mt-2">Built to accelerate research and preserve knowledge.</p>
        </div>
      </footer>
    </div>
  );
}
