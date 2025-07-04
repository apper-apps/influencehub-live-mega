import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StatCard from '@/components/molecules/StatCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { analyticsService } from '@/services/api/analyticsService'

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeRange, setTimeRange] = useState('7d')
  const [userType, setUserType] = useState('store') // This would come from context

  const timeRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ]

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await analyticsService.getAnalytics(timeRange)
      setAnalytics(data)
    } catch (err) {
      setError('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadAnalytics} />

  const stats = {
    store: [
      { 
        title: 'Total Revenue', 
        value: `$${analytics?.totalRevenue?.toLocaleString() || '0'}`, 
        icon: 'DollarSign', 
        trend: 'up', 
        trendValue: '+12%', 
        color: 'success' 
      },
      { 
        title: 'Active Campaigns', 
        value: analytics?.activeCampaigns || '0', 
        icon: 'Target', 
        trend: 'up', 
        trendValue: '+5', 
        color: 'primary' 
      },
      { 
        title: 'Total Views', 
        value: `${analytics?.totalViews?.toLocaleString() || '0'}`, 
        icon: 'Eye', 
        trend: 'up', 
        trendValue: '+23%', 
        color: 'info' 
      },
      { 
        title: 'Conversion Rate', 
        value: `${analytics?.conversionRate || '0'}%`, 
        icon: 'TrendingUp', 
        trend: 'up', 
        trendValue: '+2.1%', 
        color: 'warning' 
      }
    ],
    influencer: [
      { 
        title: 'Total Earnings', 
        value: `$${analytics?.totalEarnings?.toLocaleString() || '0'}`, 
        icon: 'DollarSign', 
        trend: 'up', 
        trendValue: '+18%', 
        color: 'success' 
      },
      { 
        title: 'Completed Campaigns', 
        value: analytics?.completedCampaigns || '0', 
        icon: 'CheckCircle', 
        trend: 'up', 
        trendValue: '+3', 
        color: 'primary' 
      },
      { 
        title: 'Total Engagement', 
        value: `${analytics?.totalEngagement?.toLocaleString() || '0'}`, 
        icon: 'Heart', 
        trend: 'up', 
        trendValue: '+15%', 
        color: 'info' 
      },
      { 
        title: 'Success Rate', 
        value: `${analytics?.successRate || '0'}%`, 
        icon: 'Award', 
        trend: 'up', 
        trendValue: '+5%', 
        color: 'warning' 
      }
    ]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
<div>
          <h1 className="text-3xl font-bold text-white font-display">Analytics</h1>
          <p className="text-gray-400 mt-2">
            Track your performance and optimize your campaigns through detailed insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-input w-auto"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          
          <Button
            variant="secondary"
            icon="RefreshCw"
            onClick={loadAnalytics}
            loading={loading}
          >
            Refresh
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue/Earnings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface rounded-lg border border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ApperIcon name="BarChart3" size={20} className="text-primary" />
              {userType === 'store' ? 'Revenue Trends' : 'Earnings Trends'}
            </h2>
            <Badge variant="success" size="small">
              +12% vs last period
            </Badge>
          </div>
          
          <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg">
            <div className="text-center">
              <ApperIcon name="BarChart3" size={48} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400">Chart visualization coming soon</p>
            </div>
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-surface rounded-lg border border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ApperIcon name="TrendingUp" size={20} className="text-primary" />
              Performance Metrics
            </h2>
            <Badge variant="info" size="small">
              Real-time
            </Badge>
          </div>
          
          <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg">
            <div className="text-center">
              <ApperIcon name="TrendingUp" size={48} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400">Performance chart coming soon</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-surface rounded-lg border border-gray-700 p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ApperIcon name="Activity" size={20} className="text-primary" />
          Detailed Analytics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Top Products/Campaigns */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">
              {userType === 'store' ? 'Top Products' : 'Top Campaigns'}
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">{i}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {userType === 'store' ? `Product ${i}` : `Campaign ${i}`}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {userType === 'store' ? '$1,250 revenue' : '$320 earned'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Recent Activity</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      {userType === 'store' 
                        ? 'New campaign accepted by influencer' 
                        : 'Campaign completed successfully'
                      }
                    </p>
                    <p className="text-gray-400 text-xs">
                      {i} hour{i > 1 ? 's' : ''} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Goals Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white text-sm">Monthly Revenue</span>
                  <span className="text-gray-400 text-sm">75%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-3/4"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white text-sm">Campaign Goals</span>
                  <span className="text-gray-400 text-sm">60%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-success to-green-400 h-2 rounded-full w-3/5"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white text-sm">Engagement</span>
                  <span className="text-gray-400 text-sm">90%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-warning to-yellow-400 h-2 rounded-full w-9/10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Analytics