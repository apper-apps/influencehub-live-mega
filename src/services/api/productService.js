import productData from '@/services/mockData/products.json'

class ProductService {
  constructor() {
    this.products = [...productData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.products]
  }

  async getById(id) {
    await this.delay(200)
    const product = this.products.find(p => p.Id === parseInt(id))
    if (!product) {
      throw new Error('Product not found')
    }
    return { ...product }
  }

  async create(productData) {
    await this.delay(500)
    const newProduct = {
      ...productData,
      Id: Math.max(...this.products.map(p => p.Id)) + 1,
      createdAt: new Date().toISOString(),
      activeCampaigns: 0,
      totalViews: 0,
      totalSales: 0
    }
    this.products.push(newProduct)
    return { ...newProduct }
  }

  async update(id, updates) {
    await this.delay(300)
    const index = this.products.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Product not found')
    }
    
    this.products[index] = { ...this.products[index], ...updates }
    return { ...this.products[index] }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.products.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Product not found')
    }
    
    this.products.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

  // SmartMatch+ AI Recommendations
  async getRecommendations(productCriteria) {
    await this.delay(800) // Simulate AI processing time
    
    const influencers = this.generateInfluencers(productCriteria)
    
    // Apply AI matching algorithm
    const recommendations = influencers.map(influencer => {
      const matchScore = this.calculateMatchScore(influencer, productCriteria)
      return {
        ...influencer,
        matchScore
      }
    })
    
    // Sort by match score and return top matches
    return recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 9) // Return top 9 matches
  }

  calculateMatchScore(influencer, criteria) {
    let score = 0
    
    // Niche compatibility (40% weight)
    if (influencer.niche === criteria.niche) score += 40
    else if (influencer.secondaryNiches?.includes(criteria.niche)) score += 25
    
    // Quality score match (20% weight)
    const qualityDiff = Math.abs(influencer.qualityScore - criteria.qualityScore)
    score += Math.max(0, 20 - (qualityDiff * 5))
    
    // Engagement tier match (20% weight)
    const engagementTiers = { low: 1, medium: 2, high: 3, premium: 4 }
    const tierDiff = Math.abs(engagementTiers[influencer.engagementTier] - engagementTiers[criteria.engagementTier])
    score += Math.max(0, 20 - (tierDiff * 7))
    
    // Content style match (10% weight)
    if (influencer.contentStyle === criteria.contentStyle) score += 10
    
    // Boost bonus (10% weight)
    if (criteria.boostActive) {
      score += Math.min(10, criteria.boostMultiplier * 3)
    }
    
    return Math.min(100, Math.max(0, score))
  }

  async calculateBoost(productId, multiplier) {
    await this.delay(200)
    
    const baseDaily = 10 // Base daily cost
    const cost = baseDaily * multiplier
    
    return cost
  }

  async activateBoost(productId, multiplier) {
    await this.delay(300)
    
    const product = this.products.find(p => p.Id === parseInt(productId))
    if (!product) {
      throw new Error('Product not found')
    }
    
    // Update product with boost settings
    product.boostActive = true
    product.boostMultiplier = multiplier
    product.boostActivatedAt = new Date().toISOString()
    
    return {
      success: true,
      cost: this.calculateBoost(productId, multiplier),
      visibilityIncrease: multiplier * 50 // 50% increase per multiplier
    }
  }

  generateInfluencers(criteria) {
    const names = [
      'Sarah Johnson', 'Mike Chen', 'Emma Rodriguez', 'David Kim', 'Lisa Zhang',
      'Alex Thompson', 'Maya Patel', 'Ryan Williams', 'Zoe Martinez', 'Jake Brown',
      'Ava Davis', 'Ethan Wilson', 'Sophia Lee', 'Noah Garcia', 'Olivia Moore',
      'Lucas Anderson', 'Mia Taylor', 'Liam Jackson', 'Isabella White', 'Mason Harris'
    ]
    
    const niches = ['Fashion', 'Beauty', 'Tech', 'Food', 'Lifestyle', 'Sports', 'Gaming']
    const contentStyles = ['authentic', 'professional', 'creative', 'educational', 'entertaining']
    const engagementTiers = ['low', 'medium', 'high', 'premium']
    
    return names.map((name, index) => {
      const followers = Math.floor(Math.random() * 900000) + 100000 // 100K-1M followers
      const engagement = Math.random() * 8 + 1 // 1-9% engagement
      const qualityScore = Math.floor(Math.random() * 3) + 3 // 3-5 stars
      
      return {
        id: index + 1,
        name,
        username: name.toLowerCase().replace(' ', '') + Math.floor(Math.random() * 999),
        niche: criteria.niche || niches[Math.floor(Math.random() * niches.length)],
        secondaryNiches: [niches[Math.floor(Math.random() * niches.length)]],
        followers: followers > 1000000 ? '1M+' : followers > 100000 ? `${Math.floor(followers/1000)}K` : `${Math.floor(followers/1000)}K`,
        engagement: `${engagement.toFixed(1)}%`,
        qualityScore,
        contentStyle: contentStyles[Math.floor(Math.random() * contentStyles.length)],
        engagementTier: engagementTiers[Math.floor(Math.random() * engagementTiers.length)],
        averageViews: Math.floor(Math.random() * 500000) + 50000,
        responseRate: Math.floor(Math.random() * 30) + 70 // 70-100% response rate
      }
    })
  }
}

export const productService = new ProductService()