import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import StatCard from "@/components/molecules/StatCard";
import { walletService } from "@/services/api/walletService";
const Wallet = () => {
  const [walletData, setWalletData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
  const [processingPayout, setProcessingPayout] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [processingDeposit, setProcessingDeposit] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
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
      case 'deposit': return 'ArrowDown'
      case 'bonus': return 'Gift'
      case 'refund': return 'RotateCcw'
      default: return 'DollarSign'
    }
  }

  const getTransactionColor = (type) => {
    switch (type) {
      case 'earning': return 'text-success'
      case 'payout': return 'text-error'
      case 'deposit': return 'text-info'
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

  // PayPal Integration
  useEffect(() => {
    loadPayPalScript()
  }, [])

  const loadPayPalScript = async () => {
    try {
      if (window.paypal) {
        setPaypalLoaded(true)
        return
      }

      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD&components=buttons`
      script.async = true
      
      script.onload = () => {
        setPaypalLoaded(true)
      }
      
      script.onerror = () => {
        toast.error('Failed to load PayPal SDK')
      }
      
      document.head.appendChild(script)
    } catch (error) {
      toast.error('Error initializing PayPal')
    }
  }

  const handleDepositClick = () => {
    setShowDepositModal(true)
    setDepositAmount('')
  }

  const handleDepositSubmit = async (amount) => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid deposit amount')
      return
    }

    try {
      setProcessingDeposit(true)
      await walletService.addDeposit(parseFloat(amount))
      toast.success(`Successfully deposited $${amount}`)
      setShowDepositModal(false)
      setDepositAmount('')
      loadWalletData()
    } catch (err) {
      toast.error('Failed to process deposit')
    } finally {
      setProcessingDeposit(false)
    }
  }

  const createPayPalOrder = (data, actions) => {
    const amount = parseFloat(depositAmount)
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    return actions.order.create({
      purchase_units: [{
        amount: {
          value: amount.toString()
        },
        description: 'Wallet Deposit'
      }]
    })
  }

  const onPayPalApprove = async (data, actions) => {
    try {
      const order = await actions.order.capture()
      const amount = parseFloat(order.purchase_units[0].amount.value)
      await handleDepositSubmit(amount)
    } catch (error) {
      toast.error('PayPal payment failed')
    }
  }

if (loading) return <Loading type="dashboard" />

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
            Manage your earnings, deposits, and payout history through the platform
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
            variant="info"
            icon="Plus"
            onClick={handleDepositClick}
          >
            Add Funds
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

      {/* Deposit Modal */}
      {showDepositModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowDepositModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-surface rounded-lg border border-gray-700 p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add Funds</h3>
              <button
                onClick={() => setShowDepositModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={16} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <Input
                label="Deposit Amount"
                type="number"
                placeholder="Enter amount (USD)"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                icon="DollarSign"
                min="1"
                step="0.01"
              />

              <div className="space-y-4">
                <h4 className="font-medium text-white">Payment Method</h4>
                
                {paypalLoaded ? (
                  <div className="space-y-3">
                    <div 
                      id="paypal-button-container"
                      ref={(el) => {
                        if (el && window.paypal && depositAmount && parseFloat(depositAmount) > 0) {
                          el.innerHTML = ''
                          window.paypal.Buttons({
                            createOrder: createPayPalOrder,
                            onApprove: onPayPalApprove,
                            onError: (err) => {
                              toast.error('PayPal payment error')
                            },
                            style: {
                              layout: 'vertical',
                              color: 'blue',
                              shape: 'rect',
                              label: 'paypal'
                            }
                          }).render(el)
                        }
                      }}
                    />
                    
                    {(!depositAmount || parseFloat(depositAmount) <= 0) && (
                      <p className="text-sm text-gray-400 text-center">
                        Enter an amount above to see PayPal payment options
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-4 bg-gray-800 rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
                    <span className="text-gray-400">Loading PayPal...</span>
                  </div>
                )}

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleDepositSubmit(depositAmount)}
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0 || processingDeposit}
                  loading={processingDeposit}
                >
                  Manual Deposit (Demo)
                </Button>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <ApperIcon name="Info" size={16} className="text-info mt-0.5" />
                  <div className="text-sm text-gray-400">
                    <p className="font-medium text-white mb-1">Secure Payments</p>
                    <p>All transactions are processed securely through PayPal. Your payment information is never stored on our servers.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

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
            description="Your transaction history will appear here once you start earning or making deposits"
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
                  transaction.type === 'deposit' ? 'bg-info/20' :
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