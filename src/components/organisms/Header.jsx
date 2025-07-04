import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const Header = ({ onMenuToggle, title = 'Dashboard', userType = 'store' }) => {
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    {
      Id: 1,
      type: 'campaign',
      title: 'New campaign accepted',
      description: 'Sarah Johnson accepted your product campaign',
      time: '2 minutes ago',
      read: false
    },
    {
      Id: 2,
      type: 'payment',
      title: 'Payment received',
      description: 'You received $150 from completed campaign',
      time: '1 hour ago',
      read: false
    },
    {
      Id: 3,
      type: 'message',
      title: 'New message',
      description: 'You have 3 new messages from influencers',
      time: '3 hours ago',
      read: true
    }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'campaign': return 'Target'
      case 'payment': return 'DollarSign'
      case 'message': return 'MessageCircle'
      default: return 'Bell'
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface border-b border-gray-700 px-6 py-4 sticky top-0 z-40"
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ApperIcon name="Menu" size={20} className="text-gray-400" />
          </button>
          
          <div>
            <h1 className="text-xl font-bold text-white font-display">{title}</h1>
            <p className="text-gray-400 text-sm">
              {userType === 'store' ? 'Store Owner Dashboard' : 'Influencer Dashboard'}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ApperIcon name="Bell" size={20} className="text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-80 bg-surface border border-gray-600 rounded-lg shadow-xl z-50"
              >
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <ApperIcon name="X" size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.Id}
                      className={`p-4 border-b border-gray-700 hover:bg-gray-800 cursor-pointer ${
                        !notification.read ? 'bg-gray-800/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <ApperIcon 
                            name={getNotificationIcon(notification.type)} 
                            size={14} 
                            className="text-primary" 
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm">
                            {notification.title}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            {notification.description}
                          </p>
                          <p className="text-gray-500 text-xs mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-700">
                  <button className="w-full text-sm text-primary hover:text-primary/80 font-medium">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-white">
                {userType === 'store' ? 'Store Owner' : 'Influencer'}
              </p>
              <p className="text-xs text-gray-400">
                {userType === 'store' ? 'Pro Plan' : 'Gold Member'}
              </p>
            </div>
            
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header