import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, DollarSign, Globe, Play, Shield, Star, TrendingUp, Users, Zap } from "lucide-react";
import App from "@/App";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Analytics from "@/components/pages/Analytics";
const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    affiliates: 0,
    campaigns: 0,
    revenue: 0,
    conversion: 0
  });

  useEffect(() => {
    // Simulate loading and animate stats
    const timer = setTimeout(() => {
      setIsLoading(false);
      animateStats();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const animateStats = () => {
    const finalStats = {
      affiliates: 10000,
      campaigns: 5000,
      revenue: 2500000,
      conversion: 15.8
    };

    const duration = 2000;
    const steps = 60;
    const increment = {
      affiliates: finalStats.affiliates / steps,
      campaigns: finalStats.campaigns / steps,
      revenue: finalStats.revenue / steps,
      conversion: finalStats.conversion / steps
    };

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setStats({
        affiliates: Math.floor(increment.affiliates * currentStep),
        campaigns: Math.floor(increment.campaigns * currentStep),
        revenue: Math.floor(increment.revenue * currentStep),
        conversion: +(increment.conversion * currentStep).toFixed(1)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setStats(finalStats);
      }
    }, duration / steps);
  };
const features = [
    {
      icon: Users,
      title: "App-Based Network",
      description: "Connect with thousands of verified affiliates through our secure platform."
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description: "Access real-time performance insights and comprehensive reporting through the platform."
    },
    {
      icon: DollarSign,
      title: "Flexible Payments",
      description: "Manage custom commission rates and payment structures through our interface."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Enterprise-grade security measures protecting your data and transactions."
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Fast and reliable payment processing accessible from any device."
    },
    {
      icon: Globe,
      title: "Universal Access",
      description: "Access your affiliate network from any device with a modern browser."
    }
  ];

const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      content: "Phoenix Hub's platform transformed our affiliate program. The browser-based interface makes management effortless.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "E-commerce Manager",
      company: "StyleBrand",
      content: "The analytics and reporting features are incredible. We can access everything from any device.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Growth Lead",
      company: "StartupX",
      content: "No downloads needed, works perfectly in our browsers. The platform is intuitive and powerful!",
      rating: 5
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Phoenix Hub...</p>
        </div>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Phoenix Hub
</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              The automated platform for Brands, Stores, and Influencers to streamline partnerships and maximize growth
            </p>
            <div className="text-sm text-gray-400 mb-4">
              Access Phoenix Hub directly through your web browser • No downloads required
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/app">
              <Button
                variant="primary"
                size="lg"
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
              >
                Launch Web App
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              View Demo
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {stats.affiliates?.toLocaleString() || '0'}+
              </div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {stats.campaigns?.toLocaleString() || '0'}+
              </div>
              <div className="text-gray-400">Web Campaigns</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                ${stats.revenue?.toLocaleString() || '0'}+
              </div>
              <div className="text-gray-400">Revenue Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {stats.conversion || '0'}%
              </div>
              <div className="text-gray-400">Avg. Conversion</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Notice */}
<section className="py-8 px-4 sm:px-6 lg:px-8 bg-primary/10 border-y border-primary/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-white">Browser-Based Platform</h3>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Phoenix Hub is a responsive application accessible through any modern browser. 
            Works seamlessly on desktop, tablet, and mobile devices without requiring any downloads or installations.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
<h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose Phoenix Hub?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful automated features designed to streamline connections between Brands, Stores, and Influencers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-gradient-to-br from-surface to-surface/80 border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-surface/50 to-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Hear from businesses using our web platform to grow their affiliate programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-gradient-to-br from-surface to-surface/80 border-primary/20">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                <div className="border-t border-gray-600 pt-4">
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}, {testimonial.company}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
<h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Scale Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of successful Brands, Stores, and Influencers using our automated platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/app">
              <Button
                variant="primary"
                size="lg"
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
              >
                Access Web Platform
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              Learn More
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 text-gray-400 mb-8">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Instant browser access</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>No downloads required</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Works on all devices</span>
          </div>

          {/* Platform Disclaimer */}
          <div className="bg-surface/50 rounded-lg border border-gray-600 p-6 max-w-2xl mx-auto">
<div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h4 className="text-white font-medium mb-2">Platform Information</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Phoenix Hub is a browser-based application accessible through modern browsers. 
                  We are not affiliated with any mobile app stores. All features and services are 
                  provided through our secure platform. Compatible with Chrome, Firefox, Safari, 
                  and Edge browsers on desktop and mobile devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
<footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Phoenix Hub</h3>
            <p className="text-gray-400 mb-4">Automated Platform for Brands, Stores, and Influencers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <h4 className="text-white font-medium mb-3">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Web Application</li>
                <li>Browser Compatible</li>
                <li>Responsive Design</li>
                <li>Cloud-Based</li>
              </ul>
            </div>
            
            <div className="text-center">
              <h4 className="text-white font-medium mb-3">Features</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Campaign Management</li>
                <li>Real-time Analytics</li>
                <li>Secure Payments</li>
                <li>Global Network</li>
              </ul>
            </div>
            
            <div className="text-center">
              <h4 className="text-white font-medium mb-3">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>24/7 Web Support</li>
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Community Forum</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Phoenix Hub. All rights reserved. This is a web-based platform accessible through browsers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;