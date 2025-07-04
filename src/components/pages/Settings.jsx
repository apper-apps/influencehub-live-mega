import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import App from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Analytics from "@/components/pages/Analytics";
import { settingsService } from "@/services/api/settingsService";

const Settings = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'billing', label: 'Billing', icon: 'CreditCard' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' }
  ]

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await settingsService.getSettings()
      setSettings(data)
    } catch (err) {
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

const saveSettings = async (updatedSettings) => {
    try {
      setSaving(true)
      await settingsService.updateSettings(updatedSettings)
      setSettings(updatedSettings)
      toast.success('Settings updated successfully')
    } catch (err) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }
  const handlePlanChange = async (newTier) => {
    if (newTier === settings.subscriptionTier) return
    
    const isUpgrade = ['free', 'starter', 'growth', 'pro'].indexOf(newTier) > 
                     ['free', 'starter', 'growth', 'pro'].indexOf(settings.subscriptionTier)
    
    const action = isUpgrade ? 'upgrade' : 'downgrade'
    const message = `Are you sure you want to ${action} to the ${newTier.charAt(0).toUpperCase() + newTier.slice(1)} plan?`
    
    if (window.confirm(message)) {
      try {
        setSaving(true)
        await settingsService.updateSubscriptionTier(newTier)
        
        // Update slot limits based on tier
        const slotLimits = {
          free: 2,
          starter: 5,
          growth: 10,
          pro: 999
        }
        
        const updatedSettings = {
          ...settings,
          subscriptionTier: newTier,
          totalSlots: slotLimits[newTier],
          usedSlots: Math.min(settings.usedSlots, slotLimits[newTier])
        }
        
        setSettings(updatedSettings)
        toast.success(`Successfully ${action}d to ${newTier.charAt(0).toUpperCase() + newTier.slice(1)} plan`)
      } catch (err) {
        toast.error(`Failed to ${action} subscription plan`)
      } finally {
        setSaving(false)
      }
    }
  }

const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }
  // Social account helper functions
  const getConnectedPlatforms = () => {
    if (!settings?.socialAccounts) return []
    return Object.entries(settings.socialAccounts)
      .filter(([, account]) => account.connected)
      .map(([platform]) => platform)
  }
  
  const getPlatformDisplayName = (platform) => {
    const names = {
      youtube: 'YouTube',
      tiktok: 'TikTok', 
      facebook: 'Facebook',
      instagram: 'Instagram',
      twitter: 'Twitter',
      linkedin: 'LinkedIn'
    }
    return names[platform] || platform
  }
  
  const handleSocialConnect = async (platform) => {
    try {
      setSaving(true)
      await settingsService.connectSocialAccount(platform)
      const updatedSettings = await settingsService.getSettings()
      setSettings(updatedSettings)
      toast.success(`Successfully connected ${getPlatformDisplayName(platform)}`)
    } catch (err) {
      toast.error(`Failed to connect ${getPlatformDisplayName(platform)}`)
    } finally {
      setSaving(false)
    }
  }
  
  const handleSocialDisconnect = async (platform) => {
    const connectedCount = getConnectedPlatforms().length
    if (connectedCount <= 2) {
      const confirmMessage = connectedCount === 2 
        ? `Disconnecting ${getPlatformDisplayName(platform)} will make you fall below the minimum requirement of 2 platforms. This may affect your verification status. Continue?`
        : `Disconnecting ${getPlatformDisplayName(platform)} will reduce your connected platforms. Continue?`
      
      if (!window.confirm(confirmMessage)) return
    }
    
    try {
      setSaving(true)
      await settingsService.disconnectSocialAccount(platform)
      const updatedSettings = await settingsService.getSettings()
      setSettings(updatedSettings)
      toast.success(`Successfully disconnected ${getPlatformDisplayName(platform)}`)
      
      if (getConnectedPlatforms().length < 2) {
        toast.warning('You now have fewer than 2 connected platforms. Please connect more to maintain verification status.')
      }
    } catch (err) {
      toast.error(`Failed to disconnect ${getPlatformDisplayName(platform)}`)
    } finally {
      setSaving(false)
    }
  }
  
  const renderSocialPlatform = (platform, iconName, color, accountData) => {
    const isConnected = accountData?.connected || false
    const isVerified = accountData?.verified || false
    const followerCount = accountData?.followerCount || 0
    const username = accountData?.username || ''
    
    return (
      <div key={platform} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: color }}
            >
              <ApperIcon name={iconName} size={20} className="text-white" />
            </div>
            <div>
              <h5 className="font-medium text-white">{getPlatformDisplayName(platform)}</h5>
              {isConnected && (
                <p className="text-sm text-gray-400">@{username}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isConnected && isVerified && (
              <Badge variant="success" size="small">
                <ApperIcon name="CheckCircle" size={12} className="mr-1" />
                Verified
              </Badge>
            )}
            {isConnected && !isVerified && (
              <Badge variant="warning" size="small">
                <ApperIcon name="Clock" size={12} className="mr-1" />
                Pending
              </Badge>
            )}
          </div>
        </div>
        
        {isConnected && (
          <div className="mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <ApperIcon name="Users" size={14} />
              <span>{followerCount.toLocaleString()} followers</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <ApperIcon name="Calendar" size={12} />
              <span>Connected {new Date(accountData.connectedAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          {isConnected ? (
            <>
              <Button
                variant="danger"
                size="small"
                className="flex-1"
                onClick={() => handleSocialDisconnect(platform)}
                disabled={saving}
              >
                <ApperIcon name="Unlink" size={14} className="mr-1" />
                Disconnect
              </Button>
              {!isVerified && (
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => toast.info('Verification in progress. This usually takes 24-48 hours.')}
                >
                  <ApperIcon name="RefreshCw" size={14} />
                </Button>
              )}
            </>
          ) : (
            <Button
              variant="primary"
              size="small"
              className="w-full"
              onClick={() => handleSocialConnect(platform)}
              disabled={saving}
            >
              <ApperIcon name="Link" size={14} className="mr-1" />
              Connect
            </Button>
          )}
        </div>
      </div>
    )
  }
  const renderTabContent = () => {
    if (!settings) return null

    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Profile Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={settings.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
              />
              
              <Input
                label="Email Address"
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                icon="Mail"
              />
              
              <Input
                label="Phone Number"
                type="tel"
                value={settings.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                icon="Phone"
              />
              
              <Input
                label="Business Name"
                value={settings.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Enter your business name"
                icon="Building"
              />
            </div>
            
            <div className="space-y-2">
              <label className="form-label">Bio</label>
              <textarea
                value={settings.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                className="form-input min-h-24"
              />
            </div>
            
            <div className="space-y-2">
              <label className="form-label">Profile Picture</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={24} className="text-white" />
                </div>
                <div>
                  <Button variant="secondary" icon="Upload">
                    Upload Photo
                  </Button>
                  <p className="text-sm text-gray-400 mt-1">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-white">Email Notifications</h4>
                  <p className="text-sm text-gray-400">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-white">Push Notifications</h4>
                  <p className="text-sm text-gray-400">Receive push notifications in browser</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-white">Campaign Updates</h4>
                  <p className="text-sm text-gray-400">Get notified about campaign status changes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.campaignUpdates}
                    onChange={(e) => handleInputChange('campaignUpdates', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
)

      case 'billing':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Subscription Management</h3>
            
            {/* Current Plan Overview */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-white">Current Plan</h4>
                  <p className="text-sm text-gray-400">Your active subscription</p>
                </div>
                <Badge variant="primary" size="large">
                  {settings.subscriptionTier?.charAt(0).toUpperCase() + settings.subscriptionTier?.slice(1)} Plan
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-white">
                    ${settings.subscriptionTier === 'free' ? '0' : 
                       settings.subscriptionTier === 'starter' ? '29' :
                       settings.subscriptionTier === 'growth' ? '59' : '99'}
                  </p>
                  <p className="text-sm text-gray-400">Monthly</p>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-white">{settings.totalSlots}</p>
                  <p className="text-sm text-gray-400">Influencer Slots</p>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <p className="text-2xl font-bold text-success">{settings.usedSlots}</p>
                  <p className="text-sm text-gray-400">Slots Used</p>
                </div>
              </div>
              
              {/* Slot Usage Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Slot Usage</span>
                  <span className="text-sm text-white">
                    {settings.usedSlots}/{settings.totalSlots} slots
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(settings.usedSlots / settings.totalSlots) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {settings.totalSlots - settings.usedSlots} slots remaining
                </p>
              </div>
            </div>

            {/* Subscription Tiers Comparison */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Available Plans</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Free Tier */}
                <div className={`relative bg-gray-800 rounded-lg p-6 border-2 transition-all duration-200 ${
                  settings.subscriptionTier === 'free' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}>
                  {settings.subscriptionTier === 'free' && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge variant="primary" size="small">Current</Badge>
                    </div>
                  )}
                  <div className="text-center mb-4">
                    <h5 className="text-lg font-semibold text-white mb-2">Free</h5>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-white">$0</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <p className="text-sm text-gray-400">Perfect for getting started</p>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">2 Influencer Slots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">Basic Analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">Email Support</span>
                    </div>
                  </div>
                  
                  {settings.subscriptionTier === 'free' ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handlePlanChange('free')}
                    >
                      Downgrade
                    </Button>
                  )}
                </div>

                {/* Starter Tier */}
                <div className={`relative bg-gray-800 rounded-lg p-6 border-2 transition-all duration-200 ${
                  settings.subscriptionTier === 'starter' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}>
                  {settings.subscriptionTier === 'starter' && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge variant="primary" size="small">Current</Badge>
                    </div>
                  )}
                  <div className="text-center mb-4">
                    <h5 className="text-lg font-semibold text-white mb-2">Starter</h5>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-white">$29</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <p className="text-sm text-gray-400">For small businesses</p>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">5 Influencer Slots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">Advanced Analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">Priority Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">Campaign Templates</span>
                    </div>
                  </div>
                  
                  {settings.subscriptionTier === 'starter' ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      variant={settings.subscriptionTier === 'free' ? 'primary' : 'outline'}
                      className="w-full"
                      onClick={() => handlePlanChange('starter')}
                    >
                      {settings.subscriptionTier === 'free' ? 'Upgrade' : 'Change Plan'}
                    </Button>
                  )}
                </div>

                {/* Growth Tier */}
                <div className={`relative bg-gray-800 rounded-lg p-6 border-2 transition-all duration-200 ${
                  settings.subscriptionTier === 'growth' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}>
                  {settings.subscriptionTier === 'growth' && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge variant="primary" size="small">Current</Badge>
                    </div>
                  )}
                  <div className="text-center mb-4">
                    <h5 className="text-lg font-semibold text-white mb-2">Growth</h5>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-white">$59</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <p className="text-sm text-gray-400">For growing teams</p>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">10 Influencer Slots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">Real-time Analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">24/7 Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">API Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">Team Collaboration</span>
                    </div>
                  </div>
                  
                  {settings.subscriptionTier === 'growth' ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      variant={['free', 'starter'].includes(settings.subscriptionTier) ? 'primary' : 'outline'}
                      className="w-full"
                      onClick={() => handlePlanChange('growth')}
                    >
                      {['free', 'starter'].includes(settings.subscriptionTier) ? 'Upgrade' : 'Change Plan'}
                    </Button>
                  )}
                </div>

                {/* Pro Tier */}
                <div className={`relative bg-gray-800 rounded-lg p-6 border-2 transition-all duration-200 ${
                  settings.subscriptionTier === 'pro' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}>
                  {settings.subscriptionTier === 'pro' && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge variant="primary" size="small">Current</Badge>
                    </div>
                  )}
                  <div className="absolute -top-2 right-4">
                    <Badge variant="warning" size="small">Popular</Badge>
                  </div>
                  <div className="text-center mb-4">
                    <h5 className="text-lg font-semibold text-white mb-2">Pro</h5>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-white">$99</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <p className="text-sm text-gray-400">For enterprise teams</p>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">Unlimited Slots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">Advanced AI Insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">Dedicated Manager</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">Custom Integrations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-gray-300">White-label Options</span>
                    </div>
                  </div>
                  
                  {settings.subscriptionTier === 'pro' ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      variant="primary"
                      className="w-full"
                      onClick={() => handlePlanChange('pro')}
                    >
                      Upgrade
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="font-medium text-white mb-4">Payment Method</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <ApperIcon name="CreditCard" size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-400">Expires 12/25</p>
                </div>
                <Button variant="ghost" size="small" className="ml-auto">
                  Update
                </Button>
              </div>
            </div>
          </div>
)

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Security Settings</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="font-medium text-white mb-4">Change Password</h4>
                <div className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="Enter current password"
                  />
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                  <Button variant="primary">Update Password</Button>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-white">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-400">Add an extra layer of security</p>
                  </div>
                  <Badge variant="warning">Not Enabled</Badge>
                </div>
                <Button variant="primary">Enable 2FA</Button>
              </div>
              
              {/* Social Account Verification Section */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">Social Account Verification</h4>
                    <Badge 
                      variant={getConnectedPlatforms().length >= 2 ? "success" : "warning"}
                      size="small"
                    >
                      {getConnectedPlatforms().length >= 2 ? "Verified" : "Incomplete"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    Link at least 2 social media accounts to verify your influencer status and unlock full platform features.
                  </p>
                  
                  {/* Progress Indicator */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Verification Progress</span>
                      <span className="text-sm text-white">
                        {getConnectedPlatforms().length}/2 minimum required
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          getConnectedPlatforms().length >= 2 
                            ? 'bg-gradient-to-r from-success to-accent' 
                            : 'bg-gradient-to-r from-warning to-error'
                        }`}
                        style={{ width: `${Math.min((getConnectedPlatforms().length / 2) * 100, 100)}%` }}
                      ></div>
                    </div>
                    {getConnectedPlatforms().length < 2 && (
                      <p className="text-xs text-warning mt-1">
                        Connect {2 - getConnectedPlatforms().length} more platform(s) to complete verification
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Social Platforms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderSocialPlatform('youtube', 'Youtube', '#FF0000', settings.socialAccounts?.youtube)}
                  {renderSocialPlatform('tiktok', 'Video', '#000000', settings.socialAccounts?.tiktok)}
                  {renderSocialPlatform('facebook', 'Facebook', '#1877F2', settings.socialAccounts?.facebook)}
                  {renderSocialPlatform('instagram', 'Instagram', '#E4405F', settings.socialAccounts?.instagram)}
                  {renderSocialPlatform('twitter', 'Twitter', '#1DA1F2', settings.socialAccounts?.twitter)}
                  {renderSocialPlatform('linkedin', 'Linkedin', '#0A66C2', settings.socialAccounts?.linkedin)}
                </div>
                
                {getConnectedPlatforms().length >= 2 && (
                  <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="CheckCircle" size={20} className="text-success" />
                      <div>
                        <p className="text-success font-medium">Verification Complete!</p>
                        <p className="text-sm text-success/80">
                          You have successfully linked {getConnectedPlatforms().length} social accounts and verified your influencer status.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="font-medium text-white mb-4">Login Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <div>
                        <p className="text-white">Current Session</p>
                        <p className="text-sm text-gray-400">Chrome on Windows • 192.168.1.1</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">Now</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <div>
                        <p className="text-white">Previous Session</p>
                        <p className="text-sm text-gray-400">Safari on iPhone • 10.0.1.5</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'preferences':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">App Preferences</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="font-medium text-white mb-4">Display Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-white">Theme</label>
                    <select className="form-input w-48">
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-white">Language</label>
                    <select className="form-input w-48">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-white">Timezone</label>
                    <select className="form-input w-48">
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern</option>
                      <option value="PST">Pacific</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="font-medium text-white mb-4">Privacy Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Profile Visibility</p>
                      <p className="text-sm text-gray-400">Control who can see your profile</p>
                    </div>
                    <select className="form-input w-48">
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="contacts">Contacts Only</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Activity Status</p>
                      <p className="text-sm text-gray-400">Show when you're online</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showActivityStatus}
                        onChange={(e) => handleInputChange('showActivityStatus', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadSettings} />

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Settings</h1>
          <p className="text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>
        
        <Button
          variant="primary"
          icon="Save"
          onClick={() => saveSettings(settings)}
          loading={saving}
        >
          Save Changes
        </Button>
      </motion.div>

      {/* Settings Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface rounded-lg border border-gray-700 overflow-hidden"
      >
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-700">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }
                  `}
                >
                  <ApperIcon name={tab.icon} size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {renderTabContent()}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Settings