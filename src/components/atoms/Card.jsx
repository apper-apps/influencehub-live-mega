import { motion } from 'framer-motion'

const Card = ({
  children,
  className = '',
  hover = false,
  gradient = false,
  ...props
}) => {
  const baseClasses = "bg-surface rounded-lg border border-gray-700 p-6"
  const hoverClasses = hover ? "card-hover cursor-pointer" : ""
  const gradientClasses = gradient ? "bg-gradient-card" : ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        ${baseClasses}
        ${hoverClasses}
        ${gradientClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card