import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Zap, 
  Globe,
  Star,
  CheckCircle,
  Play
} from 'lucide-react';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

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
      title: "Affiliate Network",
      description: "Connect with thousands of verified affiliates ready to promote your products."
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description: "Track performance with detailed insights and comprehensive reporting tools."
    },
    {
      icon: DollarSign,
      title: "Flexible Commission",
      description: "Set custom commission rates and payment structures that work for your business."
    },
    {
      icon: Shield,
      title: "Fraud Protection",
      description: "Advanced security measures to protect against fraudulent activities."
    },
    {
      icon: Zap,
      title: "Instant Payouts",
      description: "Fast and reliable payment processing with multiple payout options."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Expand your reach with affiliates from around the world."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      content: "Phoenix Hub transformed our affiliate program. We've seen a 300% increase in conversions.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "E-commerce Manager",
      company: "StyleBrand",
      content: "The analytics and reporting features are incredible. We can optimize our campaigns in real-time.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Growth Lead",
      company: "StartupX",
      content: "Easy to use platform with excellent customer support. Highly recommended!",
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
              The ultimate affiliate marketing platform that connects brands with top-performing affiliates worldwide
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              variant="primary"
              size="lg"
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {stats.affiliates?.toLocaleString() || '0'}+
              </div>
              <div className="text-gray-400">Active Affiliates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {stats.campaigns?.toLocaleString() || '0'}+
              </div>
              <div className="text-gray-400">Campaigns</div>
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

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose Phoenix Hub?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to maximize your affiliate marketing success
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
              Don't just take our word for it - hear from our satisfied customers
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
            Join thousands of successful brands and affiliates on Phoenix Hub
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button
                variant="primary"
                size="lg"
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                Contact Sales
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 text-gray-400">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Free 14-day trial</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>No credit card required</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Phoenix Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;