import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  showRetry = true,
  type = 'general' 
}) => {
  const getErrorIcon = () => {
    switch (type) {
      case 'network':
        return 'WifiOff'
      case 'notfound':
        return 'Search'
      case 'permission':
        return 'Lock'
      default:
        return 'AlertTriangle'
    }
  }

  const getErrorTitle = () => {
    switch (type) {
      case 'network':
        return 'Connection Error'
      case 'notfound':
        return 'Not Found'
      case 'permission':
        return 'Access Denied'
      default:
        return 'Error'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name={getErrorIcon()} size={32} className="text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h3 className="text-2xl font-bold text-white">
          {getErrorTitle()}
        </h3>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          {message}
        </p>
      </motion.div>

      {showRetry && onRetry && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={onRetry}
          className="mt-8 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg 
                     hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 
                     btn-hover flex items-center gap-2 font-medium"
        >
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </motion.button>
      )}
    </motion.div>
  )
}

export default Error