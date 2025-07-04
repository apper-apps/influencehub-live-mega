import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StatCard from '@/components/molecules/StatCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { walletService } from '@/services/api/walletService'
import { toast } from 'react-toastify'

const Wallet = () => {
  const [walletData, setWalletData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processingPayout, setProcessingPayout] = useState(false)

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    try {
      setLoading(true)
      setError('')
      const [wallet, transactionHistory] = await Promise.all([
        walletService.getWallet(),
        walletService.getTransactions()
      ])
      setWalletData(wallet)
      setTransactions(transactionHistory)
    } catch (err) {
      setError('Failed to load wallet data')
    } finally {
      setLoading(false)
    }
  }

  const handlePayout = async () => {
    if (walletData.availableBalance < 50) {
      toast.error('Minimum payout amount is $50')
      return
    }

    try {
      setProcessingPayout(true)
      await walletService.requestPayout(walletData.availableBalance)
      toast.success('Payout request submitted successfully')
      loadWalletData()
    } catch (err) {
      toast.error('Failed to process payout request')
    } finally {
      setProcessingPayout(false)
    }
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'earning': return 'Plus'
      case 'payout': return 'Minus'
      case 'bonus': return 'Gift'
      case 'refund': return 'RotateCcw'
      default: return 'DollarSign'
    }
  }

  const getTransactionColor = (type) => {
    switch (type) {
      case 'earning': return 'text-success'
      case 'payout': return 'text-error'
      case 'bonus': return 'text-warning'
      case 'refund': return 'text-info'
      default: return 'text-gray-400'
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadWalletData} />

  const stats = [
    { 
      title: 'Available Balance', 
      value: `$${walletData?.availableBalance?.toLocaleString() || '0'}`, 
      icon: 'Wallet', 
      color: 'success' 
    },
    { 
      title: 'Pending Earnings', 
      value: `$${walletData?.pendingBalance?.toLocaleString() || '0'}`, 
      icon: 'Clock', 
      color: 'warning' 
    },
    { 
      title: 'Total Earned', 
      value: `$${walletData?.totalEarned?.toLocaleString() || '0'}`, 
      icon: 'TrendingUp', 
      color: 'primary' 
    },
    { 
      title: 'This Month', 
      value: `$${walletData?.monthlyEarnings?.toLocaleString() || '0'}`, 
      icon: 'Calendar', 
      color: 'info' 
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Wallet</h1>
          <p className="text-gray-400 mt-2">
            Manage your earnings and payout history
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon="RefreshCw"
            onClick={loadWalletData}
            loading={loading}
          >
            Refresh
          </Button>
          
          <Button
            variant="primary"
            icon="CreditCard"
            onClick={handlePayout}
            disabled={!walletData || walletData.availableBalance < 50}
            loading={processingPayout}
          >
            Request Payout
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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

      {/* Payout Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface rounded-lg border border-gray-700 p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ApperIcon name="Info" size={20} className="text-primary" />
          Payout Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ApperIcon name="DollarSign" size={16} className="text-success" />
              <span className="text-white font-medium">Minimum Payout: $50</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Clock" size={16} className="text-info" />
              <span className="text-white font-medium">Processing Time: Instant</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Shield" size={16} className="text-success" />
              <span className="text-white font-medium">Secure PayPal Integration</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-400 text-sm mb-2">Next Payout Available</p>
              <p className="text-2xl font-bold text-white">
                ${walletData?.availableBalance >= 50 ? walletData.availableBalance : (50 - walletData?.availableBalance || 50)}
              </p>
              <p className="text-sm text-gray-400">
                {walletData?.availableBalance >= 50 
                  ? 'Ready for payout' 
                  : `$${(50 - walletData?.availableBalance || 50)} more needed`
                }
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-surface rounded-lg border border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ApperIcon name="History" size={20} className="text-primary" />
            Transaction History
          </h2>
          <Button variant="ghost" icon="Download">
            Export
          </Button>
        </div>

        {transactions.length === 0 ? (
          <Empty 
            type="general"
            icon="Receipt"
            title="No transactions yet"
            description="Your transaction history will appear here once you start earning"
          />
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <motion.div
                key={transaction.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'earning' ? 'bg-success/20' :
                  transaction.type === 'payout' ? 'bg-error/20' :
                  transaction.type === 'bonus' ? 'bg-warning/20' :
                  'bg-info/20'
                }`}>
                  <ApperIcon 
                    name={getTransactionIcon(transaction.type)} 
                    size={16} 
                    className={getTransactionColor(transaction.type)}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{transaction.description}</h3>
                    <span className={`font-bold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'payout' ? '-' : '+'}${transaction.amount}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-gray-400 text-sm">{transaction.campaignName}</p>
                    <Badge variant={transaction.status === 'completed' ? 'success' : 'warning'} size="small">
                      {transaction.status}
                    </Badge>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    {formatDate(transaction.timestamp)} at {formatTime(transaction.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {/* Load More */}
            <div className="text-center pt-4">
              <Button variant="outline" icon="ChevronDown">
                Load More Transactions
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Wallet