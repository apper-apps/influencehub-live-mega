import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data available", 
  description = "Get started by creating your first item", 
  actionText = "Get Started",
  onAction,
  icon = 'Package',
  type = 'general'
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'campaigns':
        return {
          icon: 'Target',
          title: 'No campaigns yet',
          description: 'Start by creating your first campaign to connect with influencers',
          actionText: 'Create Campaign'
        }
      case 'products':
        return {
          icon: 'Package',
          title: 'No products added',
          description: 'Upload your first product to start collaborating with influencers',
          actionText: 'Add Product'
        }
      case 'messages':
        return {
          icon: 'MessageCircle',
          title: 'No messages yet',
          description: 'Messages will appear here when you start collaborating with partners',
          actionText: 'Browse Campaigns'
        }
      case 'influencers':
        return {
          icon: 'Users',
          title: 'No influencers found',
          description: 'Try adjusting your filters or browse available campaigns',
          actionText: 'Browse All'
        }
      default:
        return { icon, title, description, actionText }
    }
  }

  const content = getEmptyContent()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-8 relative"
      >
        <ApperIcon name={content.icon} size={40} className="text-white" />
        
        {/* Decorative circles */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-warning rounded-full animate-pulse delay-150"></div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 max-w-md"
      >
        <h3 className="text-2xl font-bold text-white font-display">
          {content.title}
        </h3>
        <p className="text-gray-400 leading-relaxed">
          {content.description}
        </p>
      </motion.div>

      {onAction && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={onAction}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg 
                     hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 
                     btn-hover flex items-center gap-2 font-medium shadow-lg"
        >
          <ApperIcon name="Plus" size={16} />
          {content.actionText}
        </motion.button>
      )}

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
    </motion.div>
  )
}

export default Empty