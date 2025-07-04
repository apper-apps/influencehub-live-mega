import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { affiliateService } from '@/services/api/affiliateService'

const AffiliateDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [recentCommissions, setRecentCommissions] = useState([])
  const [recentReferrals, setRecentReferrals] = useState([])
  const [affiliate, setAffiliate] = useState(null)

  // Mock current affiliate ID - in real app would come from auth context
  const currentAffiliateId = 1

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [affiliateData, statsData, commissions, referrals] = await Promise.all([
        affiliateService.getById(currentAffiliateId),
        affiliateService.getAffiliateStats(currentAffiliateId),
        affiliateService.getCommissionsByAffiliate(currentAffiliateId),
        affiliateService.getReferralsByAffiliate(currentAffiliateId)
      ])

      setAffiliate(affiliateData)
      setStats(statsData)
      setRecentCommissions(commissions.slice(-5).reverse())
      setRecentReferrals(referrals.slice(-5).reverse())
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestPayout = async () => {
    if (!affiliate || affiliate.pendingCommissions < 50) {
      toast.error('Minimum payout amount is $50')
      return
    }

    try {
      await affiliateService.createPayout(currentAffiliateId, affiliate.pendingCommissions)
      toast.success('Payout request submitted successfully')
      loadDashboardData()
    } catch (err) {
      toast.error('Failed to request payout')
    }
  }

  const copyReferralLink = () => {
    const link = affiliateService.generateReferralLink(affiliate.referralCode)
    navigator.clipboard.writeText(link)
    toast.success('Referral link copied to clipboard')
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
<div>
          <h1 className="text-3xl font-bold text-white font-display">
            Affiliate Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Track your referrals and earnings through Yphoeniex Influencer Hub
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={copyReferralLink}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Copy" size={16} />
            Copy Referral Link
          </Button>
          <Button
            variant="primary"
            onClick={handleRequestPayout}
            disabled={!affiliate || affiliate.pendingCommissions < 50}
            className="flex items-center gap-2"
          >
            <ApperIcon name="CreditCard" size={16} />
            Request Payout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-white">
                  ${affiliate?.totalEarnings.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="DollarSign" size={24} className="text-success" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending Commissions</p>
                <p className="text-2xl font-bold text-white">
                  ${affiliate?.pendingCommissions.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" size={24} className="text-warning" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Referrals</p>
                <p className="text-2xl font-bold text-white">
                  {affiliate?.totalReferrals}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" size={24} className="text-primary" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.conversionRate.toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-info" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Commissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Commissions</h2>
              <Button
                variant="ghost"
                size="small"
                onClick={() => window.location.href = '/app/affiliate/commissions'}
              >
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentCommissions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No commissions yet
                </p>
              ) : (
                recentCommissions.map((commission) => (
                  <div key={commission.Id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                        <ApperIcon name="DollarSign" size={16} className="text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{commission.customerName}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(commission.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">${commission.amount}</p>
                      <Badge
                        variant={commission.status === 'paid' ? 'success' : 'warning'}
                        size="small"
                      >
                        {commission.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* Recent Referrals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Referrals</h2>
              <Button
                variant="ghost"
                size="small"
                onClick={() => window.location.href = '/app/affiliate/referrals'}
              >
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentReferrals.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No referrals yet
                </p>
              ) : (
                recentReferrals.map((referral) => (
                  <div key={referral.Id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <ApperIcon name="User" size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{referral.name}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(referral.signupDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={referral.status === 'converted' ? 'success' : 'warning'}
                        size="small"
                      >
                        {referral.status}
                      </Badge>
                      {referral.status === 'converted' && (
                        <p className="text-sm text-gray-400 mt-1">
                          ${referral.commissionEarned}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Referral Code Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name="Share2" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Your Referral Code</h3>
<p className="text-3xl font-bold text-primary font-mono">{affiliate?.referralCode}</p>
              <p className="text-gray-400 mt-2">
                Share this code to earn commission on successful referrals
              </p>
            </div>
            <Button
              variant="primary"
              onClick={copyReferralLink}
              className="px-8"
            >
              Copy Referral Link
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default AffiliateDashboard