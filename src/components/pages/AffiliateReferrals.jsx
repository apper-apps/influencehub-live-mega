import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { affiliateService } from "@/services/api/affiliateService";

const AffiliateReferrals = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [referrals, setReferrals] = useState([])
  const [filteredReferrals, setFilteredReferrals] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [affiliate, setAffiliate] = useState(null)

  // Mock current affiliate ID - in real app would come from auth context
  const currentAffiliateId = 1

  useEffect(() => {
    loadReferrals()
  }, [])

  useEffect(() => {
    filterReferrals()
  }, [referrals, searchTerm, statusFilter])

  const loadReferrals = async () => {
    try {
      setLoading(true)
      setError(null)

      const [affiliateData, referralsData] = await Promise.all([
        affiliateService.getById(currentAffiliateId),
        affiliateService.getReferralsByAffiliate(currentAffiliateId)
      ])

      setAffiliate(affiliateData)
      setReferrals(referralsData)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load referrals')
    } finally {
      setLoading(false)
    }
  }

  const filterReferrals = () => {
    let filtered = referrals

    if (searchTerm) {
      filtered = filtered.filter(referral =>
        referral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(referral => referral.status === statusFilter)
    }

    setFilteredReferrals(filtered)
  }

  const copyReferralLink = () => {
    const link = affiliateService.generateReferralLink(affiliate.referralCode)
    navigator.clipboard.writeText(link)
    toast.success('Referral link copied to clipboard')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'converted':
        return 'success'
      case 'pending':
        return 'warning'
      case 'expired':
        return 'error'
      default:
        return 'default'
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadReferrals} />

  return (
    <div className="space-y-6">
      {/* Header */}
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">
            Referral Management
          </h1>
          <p className="text-gray-400 mt-1">
            Track and manage your referrals through the platform
          </p>
        </div>
        <Button
          variant="primary"
          onClick={copyReferralLink}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Share2" size={16} />
          Share Referral Link
        </Button>
      </div>

      {/* Referral Code Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Share2" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Your Referral Code</h3>
                <p className="text-2xl font-bold text-primary font-mono">
                  {affiliate?.referralCode}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(affiliate?.referralCode)
                  toast.success('Referral code copied!')
                }}
              >
                <ApperIcon name="Copy" size={16} />
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={copyReferralLink}
              >
                <ApperIcon name="ExternalLink" size={16} />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Referrals</p>
                <p className="text-2xl font-bold text-white">
                  {referrals.length}
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
          transition={{ delay: 0.3 }}
        >
          <Card className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Converted</p>
                <p className="text-2xl font-bold text-white">
                  {referrals.filter(r => r.status === 'converted').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={24} className="text-success" />
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
                  {referrals.length > 0 ? 
                    ((referrals.filter(r => r.status === 'converted').length / referrals.length) * 100).toFixed(1) : 0
                  }%
                </p>
              </div>
              <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-info" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search referrals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="converted">Converted</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Referrals Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Referral
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Signup Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Plan
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Commission
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-400">
                      No referrals found
                    </td>
                  </tr>
                ) : (
                  filteredReferrals.map((referral) => (
                    <tr key={referral.Id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <ApperIcon name="User" size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{referral.name}</p>
                            <p className="text-sm text-gray-400">{referral.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={getStatusColor(referral.status)}
                          size="small"
                        >
                          {referral.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {new Date(referral.signupDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        {referral.subscriptionPlan ? (
                          <Badge variant="info" size="small">
                            {referral.subscriptionPlan}
                          </Badge>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {referral.commissionEarned > 0 ? (
                          <span className="font-bold text-success">
                            ${referral.commissionEarned}
                          </span>
                        ) : (
                          <span className="text-gray-500">$0</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default AffiliateReferrals