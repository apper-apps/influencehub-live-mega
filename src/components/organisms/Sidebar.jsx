import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const Sidebar = ({ isOpen, onClose, userType = 'store' }) => {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const storeNavItems = [
    { path: '/app', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/app/campaigns', label: 'Campaigns', icon: 'Target', badge: '3' },
    { path: '/app/products', label: 'Products', icon: 'Package' },
    { path: '/app/messages', label: 'Messages', icon: 'MessageCircle', badge: '2' },
    { path: '/app/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/app/wallet', label: 'Wallet', icon: 'Wallet' },
    { path: '/app/settings', label: 'Settings', icon: 'Settings' }
  ]

  const influencerNavItems = [
    { path: '/app', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/app/campaigns', label: 'Browse Campaigns', icon: 'Search' },
    { path: '/app/messages', label: 'Messages', icon: 'MessageCircle', badge: '1' },
    { path: '/app/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/app/wallet', label: 'Wallet', icon: 'Wallet' },
    { path: '/app/settings', label: 'Settings', icon: 'Settings' }
  ]

  const navItems = userType === 'store' ? storeNavItems : influencerNavItems

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col ${collapsed ? 'w-16' : 'w-64'} bg-surface border-r border-gray-700 transition-all duration-300`}>
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" size={16} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white font-display">
                  InfluenceHub
                </span>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ApperIcon name={collapsed ? "ChevronRight" : "ChevronLeft"} size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`
              }
            >
              <ApperIcon name={item.icon} size={18} />
              {!collapsed && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge variant="error" size="small" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Plan Info */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-700">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Crown" size={16} className="text-warning" />
                <span className="text-sm font-medium text-white">
                  {userType === 'store' ? 'Pro Plan' : 'Gold Member'}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {userType === 'store' ? '12 influencer slots' : '50% visibility boost'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-gray-700 z-50 lg:hidden"
      >
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white font-display">
                InfluenceHub
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ApperIcon name="X" size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`
              }
            >
              <ApperIcon name={item.icon} size={18} />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <Badge variant="error" size="small" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Plan Info */}
        <div className="p-4 border-t border-gray-700">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="Crown" size={16} className="text-warning" />
              <span className="text-sm font-medium text-white">
                {userType === 'store' ? 'Pro Plan' : 'Gold Member'}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {userType === 'store' ? '12 influencer slots' : '50% visibility boost'}
            </p>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar