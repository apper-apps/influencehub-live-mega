import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import ProductCard from "@/components/molecules/ProductCard";
import { productService } from "@/services/api/productService";

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [showRecommendations, setShowRecommendations] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    niche: '',
    description: '',
    images: [],
    commissionType: 'per_post',
    commissionValue: '',
    smartMatch: false,
    targetAudience: '',
    contentStyle: '',
    engagementTier: 'medium',
    qualityScore: 3,
    boostActive: false,
    boostMultiplier: 1.0
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await productService.getAll()
      setProducts(data)
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      niche: '',
      description: '',
      images: [],
      commissionType: 'per_post',
      commissionValue: '',
      smartMatch: false,
      targetAudience: '',
      contentStyle: '',
      engagementTier: 'medium',
      qualityScore: 3,
      boostActive: false,
      boostMultiplier: 1.0
    })
    setEditingProduct(null)
    setRecommendations([])
    setShowRecommendations(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.niche || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        commissionValue: parseFloat(formData.commissionValue)
      }

      if (editingProduct) {
        await productService.update(editingProduct.Id, productData)
        setProducts(products.map(p => 
          p.Id === editingProduct.Id ? { ...p, ...productData } : p
        ))
        toast.success('Product updated successfully')
      } else {
        const newProduct = await productService.create(productData)
        setProducts([...products, newProduct])
        toast.success('Product created successfully')
      }

      resetForm()
      setShowAddForm(false)
    } catch (err) {
      toast.error('Failed to save product')
    }
  }

  const handleEdit = (productId) => {
    const product = products.find(p => p.Id === productId)
    if (product) {
setFormData({
        name: product.name,
        price: product.price.toString(),
        niche: product.niche,
        description: product.description,
        images: product.images || [],
        commissionType: product.commissionType,
        commissionValue: product.commissionValue.toString(),
        smartMatch: product.smartMatch || false,
        targetAudience: product.targetAudience || '',
        contentStyle: product.contentStyle || '',
        engagementTier: product.engagementTier || 'medium',
        qualityScore: product.qualityScore || 3,
        boostActive: product.boostActive || false,
        boostMultiplier: product.boostMultiplier || 1.0
      })
      setEditingProduct(product)
      setShowAddForm(true)
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(productId)
        setProducts(products.filter(p => p.Id !== productId))
        toast.success('Product deleted successfully')
      } catch (err) {
        toast.error('Failed to delete product')
      }
    }
  }

  const handleCreateCampaign = (productId) => {
    // Navigate to campaign creation with product pre-selected
    toast.info('Campaign creation feature coming soon')
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const imageUrls = files.map(file => URL.createObjectURL(file))
    setFormData({ ...formData, images: [...formData.images, ...imageUrls] })
  }

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
}

  const toggleSmartMatch = () => {
    const newSmartMatch = !formData.smartMatch
    setFormData({ ...formData, smartMatch: newSmartMatch })
    
    if (newSmartMatch && formData.niche) {
      loadRecommendations()
    } else {
      setRecommendations([])
      setShowRecommendations(false)
    }
  }

  const handleBoostActivation = async (productId, multiplier) => {
    try {
      const cost = await productService.calculateBoost(productId, multiplier)
      if (window.confirm(`Activate ${multiplier}x boost for $${cost.toFixed(2)}? This will attract more creators to your product.`)) {
        await productService.activateBoost(productId, multiplier)
        
        // Update local state
        setProducts(products.map(p => 
          p.Id === productId ? { ...p, boostActive: true, boostMultiplier: multiplier } : p
        ))
        
        toast.success(`${multiplier}x commission boost activated! Your product will get ${multiplier * 50}% more visibility.`)
        
        // Refresh recommendations if SmartMatch is active
        if (formData.smartMatch) {
          loadRecommendations()
        }
      }
    } catch (err) {
      toast.error('Failed to activate boost')
    }
  }

  const loadRecommendations = async () => {
    if (!formData.niche) return
    
    try {
      const recs = await productService.getRecommendations({
        niche: formData.niche,
        targetAudience: formData.targetAudience,
        contentStyle: formData.contentStyle,
        engagementTier: formData.engagementTier,
        qualityScore: formData.qualityScore,
        boostActive: formData.boostActive,
        boostMultiplier: formData.boostMultiplier
      })
      setRecommendations(recs)
      setShowRecommendations(true)
    } catch (err) {
      toast.error('Failed to load AI recommendations')
    }
  }

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadProducts} />

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
<div>
          <h1 className="text-3xl font-bold text-white font-display">Product Management</h1>
          <p className="text-gray-400 mt-2">
            Manage your products and create marketing campaigns through Yphoeniex Influencer Hub
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon="RefreshCw"
            onClick={loadProducts}
            loading={loading}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => setShowAddForm(true)}
          >
            Add Product
          </Button>
        </div>
      </motion.div>

      {/* Add/Edit Product Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-lg border border-gray-700 p-6"
>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
{formData.smartMatch && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 px-3 py-1 rounded-full">
                  <ApperIcon name="Brain" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">SmartMatch AI</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              icon="X"
              onClick={() => {
                setShowAddForm(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                required
              />
              
              <Input
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                icon="DollarSign"
                required
              />
              
              <div className="space-y-2">
                <label className="form-label">Niche</label>
                <select
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  className="form-input"
                  required
                >
                  <option value="">Select a niche</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Tech">Tech</option>
                  <option value="Food">Food</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Sports">Sports</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="form-label">Commission Type</label>
                <select
                  value={formData.commissionType}
                  onChange={(e) => setFormData({ ...formData, commissionType: e.target.value })}
                  className="form-input"
                >
                  <option value="per_post">Per Post</option>
                  <option value="per_sale">Per Sale (%)</option>
                  <option value="product_in_hand">Product + Commission</option>
                  <option value="combo">Combo Deal</option>
                </select>
              </div>
            </div>

            <Input
              label="Commission Value"
              type="number"
              value={formData.commissionValue}
              onChange={(e) => setFormData({ ...formData, commissionValue: e.target.value })}
              placeholder={formData.commissionType === 'per_sale' ? 'Percentage' : 'Dollar amount'}
              icon={formData.commissionType === 'per_sale' ? 'Percent' : 'DollarSign'}
              required
/>

            {/* SmartMatch+ AI Toggle */}
<div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Brain" size={18} className="text-primary" />
                  <span className="font-medium text-white">SmartMatch AI</span>
                  <Badge variant="success" size="small">BETA</Badge>
                </div>
                <button
                  type="button"
                  onClick={toggleSmartMatch}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.smartMatch ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                    formData.smartMatch ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                AI-powered influencer matching based on engagement, quality, and niche compatibility
              </p>
              
              {formData.smartMatch && (
                <div className="space-y-4 border-t border-gray-600 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Target Audience"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      placeholder="e.g., Young professionals, Gen Z"
                    />
                    
                    <div className="space-y-2">
                      <label className="form-label">Content Style</label>
                      <select
                        value={formData.contentStyle}
                        onChange={(e) => setFormData({ ...formData, contentStyle: e.target.value })}
                        className="form-input"
                      >
                        <option value="">Select style</option>
                        <option value="authentic">Authentic & Personal</option>
                        <option value="professional">Professional & Polished</option>
                        <option value="creative">Creative & Artistic</option>
                        <option value="educational">Educational & Informative</option>
                        <option value="entertaining">Fun & Entertaining</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="form-label">Engagement Tier</label>
                      <select
                        value={formData.engagementTier}
                        onChange={(e) => setFormData({ ...formData, engagementTier: e.target.value })}
                        className="form-input"
                      >
                        <option value="low">Low (1-3%)</option>
                        <option value="medium">Medium (3-6%)</option>
                        <option value="high">High (6-10%)</option>
                        <option value="premium">Premium (10%+)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="form-label">Quality Score (1-5 stars)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={formData.qualityScore}
                          onChange={(e) => setFormData({ ...formData, qualityScore: parseInt(e.target.value) })}
                          className="flex-1"
                        />
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <ApperIcon
                              key={star}
                              name="Star"
                              size={16}
                              className={star <= formData.qualityScore ? 'text-warning' : 'text-gray-600'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Commission Boost */}
                  <div className="bg-gradient-to-r from-warning/10 to-error/10 rounded-lg p-4 border border-warning/20">
                    <div className="flex items-center gap-2 mb-3">
                      <ApperIcon name="Zap" size={18} className="text-warning" />
                      <span className="font-medium text-white">Commission Boost</span>
                      <Badge variant="warning" size="small">ATTRACT MORE CREATORS</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      Boost your commission to attract top-tier influencers and increase visibility
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400 min-w-0">1x</span>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.5"
                          value={formData.boostMultiplier}
                          onChange={(e) => setFormData({ ...formData, boostMultiplier: parseFloat(e.target.value) })}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-400 min-w-0">3x</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white">{formData.boostMultiplier}x Boost</span>
                          <span className="text-sm text-gray-400">
                            (+{((formData.boostMultiplier - 1) * 100)}% visibility)
                          </span>
                        </div>
<div className="text-right">
                          <div className="text-sm text-gray-400">Estimated cost</div>
                          <div className="text-lg font-bold text-warning">
                            Contact for pricing
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="form-label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your product..."
                className="form-input min-h-24"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="form-label">Product Images</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ApperIcon name="Upload" size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">Click to upload images</p>
                </label>
              </div>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-error rounded-full flex items-center justify-center"
                      >
                        <ApperIcon name="X" size={12} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowAddForm(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {products.length === 0 ? (
          <Empty 
            type="products"
            onAction={() => setShowAddForm(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onCreateCampaign={handleCreateCampaign}
                />
              </motion.div>
            ))}
          </div>
)}
      </motion.div>

      {/* SmartMatch+ AI Recommendations */}
      {showRecommendations && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20 p-6"
        >
<div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Brain" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">SmartMatch AI Recommendations</h3>
                <p className="text-sm text-gray-400">
                  {recommendations.length} perfect matches found for your {formData.niche || 'product'} niche
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              icon="RefreshCw"
              onClick={loadRecommendations}
              className="shrink-0"
            >
              Refresh
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-surface/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Eye" size={16} className="text-blue-400" />
                <span className="text-sm font-medium text-white">Views Filter</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1K</span>
                  <span>100K</span>
                  <span>1M+</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-300 w-3/4" />
                </div>
              </div>
            </div>
            
            <div className="bg-surface/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Heart" size={16} className="text-red-400" />
                <span className="text-sm font-medium text-white">Engagement</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1%</span>
                  <span>5%</span>
                  <span>10%+</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-red-300 w-2/3" />
                </div>
              </div>
            </div>
            
            <div className="bg-surface/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Award" size={16} className="text-warning" />
                <span className="text-sm font-medium text-white">Quality Score</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <ApperIcon
                    key={star}
                    name="Star"
                    size={16}
                    className={star <= 4 ? 'text-warning' : 'text-gray-600'}
                  />
                ))}
                <span className="text-xs text-gray-400 ml-1">4.2 avg</span>
              </div>
            </div>
          </div>

          {/* Influencer Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((influencer, index) => (
              <motion.div
                key={influencer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface/50 rounded-lg p-4 border border-gray-600 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">
                      {influencer.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white truncate">{influencer.name}</h4>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          influencer.matchScore >= 90 ? 'bg-green-400' :
                          influencer.matchScore >= 70 ? 'bg-yellow-400' : 'bg-gray-400'
                        }`} />
                        <span className="text-xs text-gray-400">{influencer.matchScore}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">@{influencer.username}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Eye" size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-400">{influencer.followers}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Heart" size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-400">{influencer.engagement}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Match Score</span>
                    <span className="text-white font-medium">{influencer.matchScore}%</span>
                  </div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        influencer.matchScore >= 90 ? 'bg-green-400' :
                        influencer.matchScore >= 70 ? 'bg-yellow-400' : 'bg-gray-400'
                      }`}
                      style={{ width: `${influencer.matchScore}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <ApperIcon
                        key={star}
                        name="Star"
                        size={12}
                        className={star <= influencer.qualityScore ? 'text-warning' : 'text-gray-600'}
                      />
                    ))}
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => toast.info(`Invite sent to ${influencer.name}!`)}
                  >
                    Invite
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-600">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{recommendations.length}</div>
              <div className="text-sm text-gray-400">Total Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {recommendations.filter(r => r.matchScore >= 90).length}
              </div>
              <div className="text-sm text-gray-400">Perfect Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {recommendations.filter(r => r.matchScore >= 70).length}
              </div>
              <div className="text-sm text-gray-400">Good Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(recommendations.reduce((sum, r) => sum + r.matchScore, 0) / recommendations.length)}%
              </div>
              <div className="text-sm text-gray-400">Avg Match Score</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ProductManagement