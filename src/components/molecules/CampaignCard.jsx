import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const CampaignCard = ({
  campaign,
  userType = 'influencer',
  onAccept,
  onDecline,
  onViewDetails,
  className = ''
}) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'pending'
      case 'accepted': return 'accepted'
      case 'completed': return 'completed'
      case 'declined': return 'declined'
      default: return 'default'
    }
  }

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
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Package" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{campaign.productName}</h3>
            <p className="text-gray-400 text-sm">{campaign.storeName}</p>
          </div>
        </div>
        <Badge variant={getStatusVariant(campaign.status)}>
          {campaign.status}
        </Badge>
      </div>

      {/* Product Image */}
      {campaign.productImage && (
        <div className="mb-4">
          <img 
            src={campaign.productImage} 
            alt={campaign.productName}
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Commission</span>
          <span className="text-success font-semibold">
            {getCommissionText(campaign.commissionType, campaign.commissionValue)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Niche</span>
          <Badge variant="default" size="small">
            {campaign.niche}
          </Badge>
        </div>

        {campaign.deadline && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Deadline</span>
            <span className="text-white text-sm">
              {new Date(campaign.deadline).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {campaign.description}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        {campaign.status === 'pending' && userType === 'influencer' && (
          <>
            <Button
              variant="success"
              size="small"
              icon="Check"
              onClick={() => onAccept?.(campaign.Id)}
              className="flex-1"
            >
              Accept
            </Button>
            <Button
              variant="secondary"
              size="small"
              icon="X"
              onClick={() => onDecline?.(campaign.Id)}
            >
              Decline
            </Button>
          </>
        )}
        
        {campaign.status !== 'pending' && (
          <Button
            variant="ghost"
            size="small"
            icon="Eye"
            onClick={() => onViewDetails?.(campaign.Id)}
            className="flex-1"
          >
            View Details
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default CampaignCard