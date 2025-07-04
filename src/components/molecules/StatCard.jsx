import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = 'primary',
  className = '',
  ...props
}) => {
  const colors = {
    primary: 'from-primary to-secondary',
    success: 'from-success to-green-400',
    warning: 'from-warning to-yellow-400',
    error: 'from-error to-red-400',
    info: 'from-info to-blue-400'
  }

  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-gray-400'
  }

  const trendIcons = {
    up: 'TrendingUp',
    down: 'TrendingDown',
    neutral: 'Minus'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`metric-card ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colors[color]} rounded-lg flex items-center justify-center`}>
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 ${trendColors[trend]}`}>
            <ApperIcon name={trendIcons[trend]} size={16} />
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  )
}

export default StatCard