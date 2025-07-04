import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'medium',
  icon,
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-gray-600 text-gray-100',
    primary: 'bg-gradient-to-r from-primary to-secondary text-white',
    success: 'bg-gradient-to-r from-success to-green-400 text-white',
    warning: 'bg-gradient-to-r from-warning to-yellow-400 text-white',
    error: 'bg-gradient-to-r from-error to-red-400 text-white',
    info: 'bg-gradient-to-r from-info to-blue-400 text-white',
    pending: 'bg-gradient-to-r from-warning to-yellow-400 text-white',
    accepted: 'bg-gradient-to-r from-info to-blue-400 text-white',
    completed: 'bg-gradient-to-r from-success to-green-400 text-white',
    declined: 'bg-gradient-to-r from-error to-red-400 text-white',
    bronze: 'bg-gradient-to-r from-orange-600 to-orange-500 text-white',
    silver: 'bg-gradient-to-r from-gray-500 to-gray-400 text-white',
    gold: 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-white'
  }

  const sizes = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {icon && <ApperIcon name={icon} size={size === 'small' ? 12 : 14} />}
      {children}
    </span>
  )
}

export default Badge