import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'

const LandingPage = () => {
  const [selectedRole, setSelectedRole] = useState(null)
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    // In a real app, this would set user context
    setTimeout(() => {
      navigate('/app')
    }, 500)
  }

  const storeFeatures = [
    { icon: 'Upload', title: 'Manual Product Upload', description: 'Upload products with images, pricing, and descriptions' },
    { icon: 'DollarSign', title: 'Flexible Commissions', description: 'Choose from per-post, per-sale, or combo payment models' },
    { icon: 'Users', title: 'Multiple Influencers', description: 'Connect with up to 12 influencers based on your plan' },
    { icon: 'BarChart3', title: 'Real-time Analytics', description: 'Track campaigns, conversions, and ROI in real-time' },
    { icon: 'MessageCircle', title: 'Built-in Messaging', description: 'Communicate directly with influencers securely' },
    { icon: 'Zap', title: 'SmartMatch AI', description: 'AI-powered matching with relevant influencers' }
  ]

  const influencerFeatures = [
    { icon: 'Target', title: 'Campaign Access', description: 'Browse and accept product promotion opportunities' },
    { icon: 'TrendingUp', title: 'Boost Visibility', description: 'Increase your chances with Bronze, Silver, or Gold plans' },
    { icon: 'Shield', title: 'Secure Payments', description: 'Automated commission tracking and instant payouts' },
    { icon: 'Award', title: 'Rewards Program', description: 'Earn monthly prizes and exclusive bonuses' },
    { icon: 'Heart', title: 'Support Program', description: 'Get essentials delivered after 10+ confirmed sales' },
    { icon: 'Wallet', title: 'Instant Payouts', description: 'Receive payments instantly when you hit $50 balance' }
  ]

  const plans = {
    store: [
      { name: 'Free', price: 0, features: ['0 influencers', 'Basic analytics', 'Email support'] },
      { name: 'Starter', price: 15.99, features: ['2 influencers', 'Advanced analytics', 'Priority support'] },
      { name: 'Growth', price: 59.99, features: ['5 influencers', 'AI matching', 'Campaign templates'] },
      { name: 'Pro', price: 99, features: ['12 influencers', 'Premium analytics', 'Dedicated manager'] }
    ],
    influencer: [
      { name: 'Free', price: 0, features: ['Basic listing', 'Standard visibility', 'Email support'] },
      { name: 'Bronze', price: 4.99, features: ['15% more visibility', 'Bronze badge', 'Priority support'] },
      { name: 'Silver', price: 15.99, features: ['30% visibility boost', 'Silver badge', 'Featured listing'] },
      { name: 'Gold', price: 29.99, features: ['50% visibility boost', 'Gold badge', 'Top-tier exposure'] }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Zap" size={24} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white font-display">
                InfluenceHub
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-5xl font-bold text-white font-display leading-tight">
                Connect Store Owners with
                <span className="gradient-text"> Influencers</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                The ultimate marketplace for product promotions. Store owners find the perfect influencers, 
                while creators discover exciting collaboration opportunities.
              </p>
            </motion.div>

            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 space-y-4"
            >
              <p className="text-lg text-gray-300 mb-8">Choose your role to get started:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {/* Store Owner Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('store')}
                  className={`
                    relative p-8 rounded-xl border-2 cursor-pointer transition-all duration-300
                    ${selectedRole === 'store' 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-600 hover:border-primary/50 bg-surface'
                    }
                  `}
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto">
                      <ApperIcon name="Store" size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white font-display">Store Owner</h3>
                    <p className="text-gray-300">
                      Upload products and connect with influencers to promote your brand
                    </p>
                    <div className="flex justify-center gap-2">
                      <Badge variant="primary" size="small">Commission Control</Badge>
                      <Badge variant="success" size="small">AI Matching</Badge>
                    </div>
                  </div>
                  {selectedRole === 'store' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-6 h-6 bg-success rounded-full flex items-center justify-center"
                    >
                      <ApperIcon name="Check" size={14} className="text-white" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Influencer Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('influencer')}
                  className={`
                    relative p-8 rounded-xl border-2 cursor-pointer transition-all duration-300
                    ${selectedRole === 'influencer' 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-600 hover:border-primary/50 bg-surface'
                    }
                  `}
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center mx-auto">
                      <ApperIcon name="Users" size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white font-display">Influencer</h3>
                    <p className="text-gray-300">
                      Discover products to promote and earn commissions from your content
                    </p>
                    <div className="flex justify-center gap-2">
                      <Badge variant="warning" size="small">Instant Payouts</Badge>
                      <Badge variant="info" size="small">Boost Plans</Badge>
                    </div>
                  </div>
                  {selectedRole === 'influencer' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-6 h-6 bg-success rounded-full flex items-center justify-center"
                    >
                      <ApperIcon name="Check" size={14} className="text-white" />
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {selectedRole && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <Button
                    variant="primary"
                    size="large"
                    onClick={() => handleRoleSelect(selectedRole)}
                    className="px-12 py-4 text-lg"
                  >
                    Continue as {selectedRole === 'store' ? 'Store Owner' : 'Influencer'}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-surface/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white font-display mb-6">
              Powerful Features for Both Sides
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to succeed in influencer marketing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Store Owner Features */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <ApperIcon name="Store" size={24} className="text-primary" />
                For Store Owners
              </h3>
              <div className="space-y-6">
                {storeFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ApperIcon name={feature.icon} size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Influencer Features */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <ApperIcon name="Users" size={24} className="text-secondary" />
                For Influencers
              </h3>
              <div className="space-y-6">
                {influencerFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ApperIcon name={feature.icon} size={20} className="text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white font-display mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300">
              Flexible pricing for every business size and influencer level
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Store Owner Plans */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Store Owner Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.store.map((plan, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-surface border border-gray-600 rounded-lg p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                      <div className="text-3xl font-bold text-white">
                        ${plan.price}
                        <span className="text-sm text-gray-400 font-normal">/month</span>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300">
                          <ApperIcon name="Check" size={16} className="text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant={plan.name === 'Pro' ? 'primary' : 'secondary'} 
                      className="w-full"
                    >
                      Choose Plan
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Influencer Plans */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Influencer Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.influencer.map((plan, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-surface border border-gray-600 rounded-lg p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                      <div className="text-3xl font-bold text-white">
                        ${plan.price}
                        <span className="text-sm text-gray-400 font-normal">/month</span>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300">
                          <ApperIcon name="Check" size={16} className="text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant={plan.name === 'Gold' ? 'primary' : 'secondary'} 
                      className="w-full"
                    >
                      Choose Plan
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white font-display mb-6">
              Ready to Start Your Influencer Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of store owners and influencers already collaborating on InfluenceHub
            </p>
            <Button
              variant="secondary"
              size="large"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-4 text-lg bg-white text-primary hover:bg-white/90"
            >
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage