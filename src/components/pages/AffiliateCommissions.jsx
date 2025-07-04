import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { affiliateService } from '@/services/api/affiliateService'

const AffiliateCommissions = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [commissions, setCommissions] = useState([])
  const [filteredCommissions, setFilteredCommissions] = useState([])
  const [payouts, setPayouts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [affiliate, setAffiliate] = useState(null)
  const [stats, setStats] = useState(null)

  // Mock current affiliate ID - in real app would come from auth context
  const currentAffiliateId = 1

  useEffect(() => {
    loadCommissionData()
  }, [])

  useEffect(() => {
    filterCommissions()
  }, [commissions, searchTerm, statusFilter])

  const loadCommissionData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [affiliateData, commissionsData, payoutsData, statsData] = await Promise.all([
        affiliateService.getById(currentAffiliateId),
        affiliateService.getCommissionsByAffiliate(currentAffiliateId),
        affiliateService.getPayoutsByAffiliate(currentAffiliateId),
        affiliateService.getAffiliateStats(currentAffiliateId)
      ])

      setAffiliate(affiliateData)
      setCommissions(commissionsData)
      setPayouts(payoutsData)
      setStats(statsData)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load commission data')
    } finally {
      setLoading(false)
    }
  }

  const filterCommissions = () => {
    let filtered = commissions

    if (searchTerm) {
      filtered = filtered.filter(commission =>
        commission.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commission.subscriptionPlan.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(commission => commission.status === statusFilter)
    }

    setFilteredCommissions(filtered)
  }

  const handleRequestPayout = async () => {
    if (!affiliate || affiliate.pendingCommissions < 50) {
      toast.error('Minimum payout amount is $50')
      return
    }

    try {
      const payout = await affiliateService.createPayout(
        currentAffiliateId,
        affiliate.pendingCommissions,
        'bank_transfer'
      )
      toast.success(`Payout of $${payout.amount} requested successfully`)
      loadCommissionData()
    } catch (err) {
      toast.error('Failed to request payout: ' + err.message)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success'
      case 'pending':
        return 'warning'
      case 'processing':
        return 'info'
      default:
        return 'default'
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadCommissionData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
<div>
          <h1 className="text-3xl font-bold text-white font-display">
            Commission Management
          </h1>
          <p className="text-gray-400 mt-1">
            Track earnings and manage payouts through the platform
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleRequestPayout}
          disabled={!affiliate || affiliate.pendingCommissions < 50}
          className="flex items-center gap-2"
        >
          <ApperIcon name="CreditCard" size={16} />
          Request Payout (${affiliate?.pendingCommissions.toFixed(2)})
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Earned</p>
                <p className="text-2xl font-bold text-white">
                  ${stats?.totalCommissions.toFixed(2)}
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
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-white">
                  ${stats?.pendingCommissions.toFixed(2)}
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
                <p className="text-sm text-gray-400">Paid Out</p>
                <p className="text-2xl font-bold text-white">
                  ${stats?.paidCommissions.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={24} className="text-primary" />
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
                <p className="text-sm text-gray-400">Avg Commission</p>
                <p className="text-2xl font-bold text-white">
                  ${stats?.avgCommissionValue.toFixed(2)}
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
                placeholder="Search commissions..."
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
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Commissions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">Commission History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Plan
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Commission
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Payout Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCommissions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">
                      No commissions found
                    </td>
                  </tr>
                ) : (
                  filteredCommissions.map((commission) => (
                    <tr key={commission.Id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <ApperIcon name="User" size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{commission.customerName}</p>
                            <p className="text-sm text-gray-400">#{commission.Id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="info" size="small">
                          {commission.subscriptionPlan}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {new Date(commission.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-success">
                          ${commission.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={getStatusColor(commission.status)}
                          size="small"
                        >
                          {commission.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {commission.payoutDate ? 
                          new Date(commission.payoutDate).toLocaleDateString() : 
                          '-'
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Payout History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">Payout History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Method
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Transaction ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-400">
                      No payouts yet
                    </td>
                  </tr>
                ) : (
                  payouts.map((payout) => (
                    <tr key={payout.Id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                      <td className="py-4 px-4 text-gray-300">
                        {new Date(payout.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-success">
                          ${payout.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="info" size="small">
                          {payout.method.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-300 font-mono text-sm">
                        {payout.transactionId}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={payout.status === 'completed' ? 'success' : 'warning'}
                          size="small"
                        >
                          {payout.status}
                        </Badge>
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

export default AffiliateCommissions