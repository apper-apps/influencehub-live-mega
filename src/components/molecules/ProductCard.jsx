import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const ProductCard = ({
  product,
  onEdit,
  onDelete,
  onCreateCampaign,
  className = ''
}) => {
  const getCommissionText = (type, value) => {
    switch (type) {
      case 'per_post': return `$${value} per post`
      case 'per_sale': return `${value}% per sale`
      case 'product_in_hand': return 'Product + commission'
      case 'combo': return 'Combo deal'
      default: return `$${value}`
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`bg-surface rounded-lg border border-gray-700 p-6 hover:border-primary/50 transition-all duration-200 ${className}`}
    >
      {/* Product Image */}
      {product.images && product.images.length > 0 && (
        <div className="mb-4">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white mb-1">{product.name}</h3>
          <p className="text-2xl font-bold text-success">${product.price}</p>
        </div>
        <Badge variant="default" size="small">
          {product.niche}
        </Badge>
      </div>

      {/* Commission Info */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <ApperIcon name="DollarSign" size={16} className="text-success" />
          <span className="text-success font-semibold text-sm">
            {getCommissionText(product.commissionType, product.commissionValue)}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {product.description}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-white">{product.activeCampaigns || 0}</p>
          <p className="text-gray-400 text-xs">Active Campaigns</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-white">{product.totalViews || 0}</p>
          <p className="text-gray-400 text-xs">Total Views</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="small"
          icon="Plus"
          onClick={() => onCreateCampaign?.(product.Id)}
          className="flex-1"
        >
          Create Campaign
        </Button>
        
        <Button
          variant="secondary"
          size="small"
          icon="Edit"
          onClick={() => onEdit?.(product.Id)}
        >
          Edit
        </Button>
        
        <Button
          variant="danger"
          size="small"
          icon="Trash2"
          onClick={() => onDelete?.(product.Id)}
        >
          Delete
        </Button>
      </div>
    </motion.div>
  )
}

export default ProductCard