import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import StatCard from '@/components/molecules/StatCard'
import CampaignCard from '@/components/molecules/CampaignCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { campaignService } from '@/services/api/campaignService'

const Dashboard = React.memo(() => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userType, setUserType] = useState('store') // This would come from context
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [backgroundLoading, setBackgroundLoading] = useState(false)
  const refreshTimeoutRef = useRef(null)

  // Throttled refresh to prevent excessive API calls
  const throttledRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) return
    
    refreshTimeoutRef.current = setTimeout(() => {
      loadDashboardData(true)
      refreshTimeoutRef.current = null
    }, 1000)
  }, [])

  useEffect(() => {
    loadDashboardData()
    
    // Cleanup timeout on unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [])

  // Background refresh every 30 seconds for live data
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        setBackgroundLoading(true)
        loadDashboardData(false, true)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [loading])

const loadDashboardData = useCallback(async (showLoading = true, isBackground = false) => {
    try {
      if (showLoading && !isBackground) setLoading(true)
      setError('')
      
      // Use pagination for better performance
      const data = await campaignService.getAll({ 
        page: 1, 
        limit: 12,
        useCache: isBackground 
      })
      
      setCampaigns(data.items || data)
      setHasMore(data.hasMore || false)
    } catch (err) {
      if (!isBackground) setError('Failed to load dashboard data')
    } finally {
      if (showLoading && !isBackground) setLoading(false)
      if (isBackground) setBackgroundLoading(false)
    }
  }, [])

  const handleAcceptCampaign = useCallback(async (campaignId) => {
    try {
      await campaignService.update(campaignId, { status: 'accepted' })
      setCampaigns(prev => prev.map(c => 
        c.Id === campaignId ? { ...c, status: 'accepted' } : c
      ))
    } catch (err) {
      setError('Failed to accept campaign')
    }
  }, [])
const handleDeclineCampaign = useCallback(async (campaignId) => {
    try {
      await campaignService.update(campaignId, { status: 'declined' })
      setCampaigns(prev => prev.map(c => 
        c.Id === campaignId ? { ...c, status: 'declined' } : c
      ))
    } catch (err) {
      setError('Failed to decline campaign')
    }
  }, [])

  // Memoize stats to prevent unnecessary re-calculations
  const stats = useMemo(() => ({
    store: [
      { title: 'Active Campaigns', value: '12', icon: 'Target', trend: 'up', trendValue: '+15%', color: 'primary' },
      { title: 'Total Revenue', value: '$4,250', icon: 'DollarSign', trend: 'up', trendValue: '+32%', color: 'success' },
      { title: 'Influencers', value: '8', icon: 'Users', trend: 'up', trendValue: '+2', color: 'info' },
      { title: 'Conversion Rate', value: '12.5%', icon: 'TrendingUp', trend: 'up', trendValue: '+5%', color: 'warning' }
    ],
    influencer: [
      { title: 'Available Campaigns', value: '24', icon: 'Target', trend: 'up', trendValue: '+6', color: 'primary' },
      { title: 'Total Earnings', value: '$1,890', icon: 'DollarSign', trend: 'up', trendValue: '+28%', color: 'success' },
      { title: 'Completed Campaigns', value: '15', icon: 'CheckCircle', trend: 'up', trendValue: '+3', color: 'info' },
      { title: 'Success Rate', value: '94%', icon: 'TrendingUp', trend: 'up', trendValue: '+2%', color: 'warning' }
    ]
  }), [])

  // Memoize recent campaigns to prevent unnecessary filtering
  const recentCampaigns = useMemo(() => campaigns.slice(0, 6), [campaigns])

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
<h1 className="text-3xl font-bold text-white font-display">
            {userType === 'store' ? 'Store Dashboard' : 'Influencer Dashboard'}
          </h1>
          <p className="text-gray-400 mt-2">
            {userType === 'store' 
              ? 'Manage your products and campaigns through Yphoeniex Influencer Hub' 
              : 'Discover new campaigns and track your performance through Yphoeniex Influencer Hub'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
<Button
            variant="secondary"
            icon="RefreshCw"
            onClick={throttledRefresh}
            loading={loading || backgroundLoading}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => {/* Navigate to create */}}
          >
            {userType === 'store' ? 'Add Product' : 'Browse Campaigns'}
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats[userType].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-surface rounded-lg border border-gray-700 p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ApperIcon name="Zap" size={20} className="text-primary" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userType === 'store' ? (
            <>
              <Button variant="outline" icon="Package" className="justify-start">
                Add New Product
              </Button>
              <Button variant="outline" icon="Target" className="justify-start">
                Create Campaign
              </Button>
              <Button variant="outline" icon="BarChart3" className="justify-start">
                View Analytics
              </Button>
              <Button variant="outline" icon="Users" className="justify-start">
                Find Influencers
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" icon="Search" className="justify-start">
                Browse Campaigns
              </Button>
              <Button variant="outline" icon="MessageCircle" className="justify-start">
                Check Messages
              </Button>
              <Button variant="outline" icon="Wallet" className="justify-start">
                View Earnings
              </Button>
              <Button variant="outline" icon="TrendingUp" className="justify-start">
                Upgrade Plan
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Recent Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-surface rounded-lg border border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ApperIcon name="Clock" size={20} className="text-primary" />
            {userType === 'store' ? 'Recent Campaigns' : 'Available Campaigns'}
          </h2>
          <Button variant="ghost" icon="ArrowRight" iconPosition="right">
            View All
          </Button>
        </div>

        {recentCampaigns.length === 0 ? (
          <Empty 
            type="campaigns"
            onAction={() => {/* Navigate to campaigns */}}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.Id}
                campaign={campaign}
                userType={userType}
                onAccept={handleAcceptCampaign}
                onDecline={handleDeclineCampaign}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-surface rounded-lg border border-gray-700 p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ApperIcon name="BarChart3" size={20} className="text-primary" />
          Performance Overview
        </h2>
        
        <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg">
          <div className="text-center">
            <ApperIcon name="BarChart3" size={48} className="text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">Chart will be implemented here</p>
          </div>
        </div>
</motion.div>
    </div>
  )
})

Dashboard.displayName = 'Dashboard'

export default Dashboard