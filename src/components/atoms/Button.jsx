import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 focus:ring-primary shadow-lg btn-hover",
    secondary: "bg-surface text-white border border-gray-600 hover:bg-gray-700 hover:border-gray-500 focus:ring-gray-500",
    success: "bg-gradient-to-r from-success to-green-400 text-white hover:from-success/90 hover:to-green-400/90 focus:ring-success shadow-lg btn-hover",
    danger: "bg-gradient-to-r from-error to-red-400 text-white hover:from-error/90 hover:to-red-400/90 focus:ring-error shadow-lg btn-hover",
    ghost: "text-gray-300 hover:text-white hover:bg-gray-800 focus:ring-gray-500",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary"
  }

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base"
  }

  const handleClick = (e) => {
    if (disabled || loading) return
    if (onClick) onClick(e)
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon name={icon} size={16} className="mr-2" />
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon name={icon} size={16} className="ml-2" />
      )}
    </motion.button>
  )
}

export default Button