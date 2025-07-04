import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/molecules/ProductCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { productService } from '@/services/api/productService'
import { toast } from 'react-toastify'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    niche: '',
    description: '',
    images: [],
    commissionType: 'per_post',
    commissionValue: ''
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
      commissionValue: ''
    })
    setEditingProduct(null)
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
        commissionValue: product.commissionValue.toString()
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
            Manage your products and create campaigns
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
            <h2 className="text-xl font-bold text-white">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
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
    </div>
  )
}

export default ProductManagement