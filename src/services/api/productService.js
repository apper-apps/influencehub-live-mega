import productData from '@/services/mockData/products.json'

class ProductService {
  constructor() {
    this.products = [...productData]
    
    // Multi-layer caching for AI recommendations
    this.cache = new Map()
    this.aiCache = new Map()
    this.cacheTimestamps = new Map()
    this.cacheTTL = 10 * 60 * 1000 // 10 minutes
    this.aiCacheTTL = 30 * 60 * 1000 // 30 minutes for AI results
    
    // AI recommendation engine optimizations
    this.influencerPool = this.generateInfluencerPool(500) // Pre-generate larger pool
    this.matchCache = new Map()
    this.popularQueries = new Map()
    
    // Background processing
    this.processingQueue = []
    this.isProcessing = false
    
    // Performance metrics
    this.aiRequestCount = 0
    this.avgAiResponseTime = 0
    
    this.initializeAIOptimizations()
  }

  initializeAIOptimizations() {
    // Pre-compute popular recommendation combinations
    setInterval(() => {
      this.preComputePopularRecommendations()
    }, 5 * 60 * 1000)

    // Process queued AI requests
    setInterval(() => {
      this.processAIQueue()
    }, 1000)
  }

generateInfluencerPool(size) {
    const authenticNames = [
      'Sarah Chen', 'Michael Torres', 'Emma Silva', 'David Park', 'Lisa Rodriguez',
      'Alex Morgan', 'Maya Singh', 'Ryan Liu', 'Zoe Williams', 'Jake Martinez',
      'Ava Thompson', 'Ethan Kumar', 'Sophia Davis', 'Noah Anderson', 'Olivia Lee',
      'Lucas Garcia', 'Mia Johnson', 'Liam Wilson', 'Isabella Brown', 'Mason Smith'
    ]
    
    const niches = ['Fashion', 'Beauty', 'Tech', 'Food', 'Lifestyle', 'Sports', 'Gaming']
    const contentStyles = ['authentic', 'professional', 'creative', 'educational', 'entertaining']
    const engagementTiers = ['low', 'medium', 'high', 'premium']
    
    const pool = []
    for (let i = 0; i < size; i++) {
      const name = authenticNames[i % authenticNames.length] + (i >= authenticNames.length ? ` ${Math.floor(i / authenticNames.length) + 1}` : '')
      const baseFollowers = Math.floor(Math.random() * 500000) + 50000 // More realistic range: 50K-550K
      const engagement = Math.random() * 4 + 2 // Realistic engagement: 2-6%
      
      pool.push({
        id: i + 1,
        name,
        username: name.toLowerCase().replace(' ', '') + (1000 + i),
        niche: niches[Math.floor(Math.random() * niches.length)],
        secondaryNiches: [niches[Math.floor(Math.random() * niches.length)]],
        followers: baseFollowers > 100000 ? `${Math.floor(baseFollowers/1000)}K` : `${Math.floor(baseFollowers/1000)}K`,
        engagement: `${engagement.toFixed(1)}%`,
        qualityScore: Math.floor(Math.random() * 2) + 3, // More conservative 3-4 range
        contentStyle: contentStyles[Math.floor(Math.random() * contentStyles.length)],
        engagementTier: engagementTiers[Math.floor(Math.random() * engagementTiers.length)],
        averageViews: Math.floor(baseFollowers * (engagement / 100) * 20), // Realistic view calculation
        responseRate: Math.floor(Math.random() * 20) + 75 // 75-95% response rate
      })
    }
    
    return pool
  }

  async getAll(options = {}) {
    const { page = 1, limit = 20, useCache = true } = options
    const cacheKey = `getAll_${page}_${limit}`
    
    if (useCache && this.cache.has(cacheKey)) {
      const timestamp = this.cacheTimestamps.get(cacheKey)
      if (timestamp && Date.now() - timestamp < this.cacheTTL) {
        return this.cache.get(cacheKey)
      }
    }

    await this.delay(150)
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const items = this.products.slice(startIndex, endIndex).map(p => ({ ...p }))
    
    const result = {
      items,
      hasMore: endIndex < this.products.length,
      total: this.products.length,
      page,
      limit
    }
    
    this.cache.set(cacheKey, result)
    this.cacheTimestamps.set(cacheKey, Date.now())
    
    return result
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

// SmartMatch+ AI Recommendations with optimizations
  async getRecommendations(productCriteria) {
    const startTime = Date.now()
    const criteriaKey = JSON.stringify(productCriteria)
    
    // Check AI cache first
    if (this.aiCache.has(criteriaKey)) {
      const timestamp = this.cacheTimestamps.get(criteriaKey)
      if (timestamp && Date.now() - timestamp < this.aiCacheTTL) {
        this.trackAIPerformance(startTime)
        return this.aiCache.get(criteriaKey)
      }
    }
    
    // Track popular queries for pre-computation
    const count = this.popularQueries.get(criteriaKey) || 0
    this.popularQueries.set(criteriaKey, count + 1)
    
    // Add to processing queue if system is busy
    if (this.isProcessing) {
      return new Promise(resolve => {
        this.processingQueue.push({ criteria: productCriteria, resolve })
      })
    }
    
    this.isProcessing = true
    
    try {
      // Reduced delay with background processing
      await this.delay(400)
      
      // Use pre-generated influencer pool for better performance
      const suitableInfluencers = this.influencerPool.filter(influencer => 
        this.isInfluencerSuitable(influencer, productCriteria)
      )
      
      // Batch process recommendations
      const recommendations = await this.batchProcessRecommendations(suitableInfluencers, productCriteria)
      
      // Cache results
      this.aiCache.set(criteriaKey, recommendations)
      this.cacheTimestamps.set(criteriaKey, Date.now())
      
      this.trackAIPerformance(startTime)
      return recommendations
      
    } finally {
      this.isProcessing = false
      this.processAIQueue() // Process next in queue
    }
  }

  isInfluencerSuitable(influencer, criteria) {
    // Quick filtering before expensive calculations
    if (criteria.niche && influencer.niche !== criteria.niche) {
      return influencer.secondaryNiches?.includes(criteria.niche)
    }
    return true
  }

  async batchProcessRecommendations(influencers, criteria) {
    const batchSize = 50
    const results = []
    
    for (let i = 0; i < influencers.length; i += batchSize) {
      const batch = influencers.slice(i, i + batchSize)
      const batchResults = batch.map(influencer => ({
        ...influencer,
        matchScore: this.calculateMatchScore(influencer, criteria)
      }))
      results.push(...batchResults)
      
      // Small delay between batches to prevent blocking
      if (i + batchSize < influencers.length) {
        await this.delay(10)
      }
    }
    
    return results
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 12) // Return top 12 matches
  }

  async processAIQueue() {
    if (this.processingQueue.length === 0 || this.isProcessing) return
    
    const { criteria, resolve } = this.processingQueue.shift()
    try {
      const result = await this.getRecommendations(criteria)
      resolve(result)
    } catch (error) {
      resolve([])
    }
  }

  trackAIPerformance(startTime) {
    const duration = Date.now() - startTime
    this.aiRequestCount++
    this.avgAiResponseTime = ((this.avgAiResponseTime * (this.aiRequestCount - 1)) + duration) / this.aiRequestCount
  }

  async preComputePopularRecommendations() {
    // Pre-compute recommendations for frequently requested criteria
    const popularEntries = Array.from(this.popularQueries.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
    
    for (const [criteriaKey] of popularEntries) {
      try {
        const criteria = JSON.parse(criteriaKey)
        if (!this.aiCache.has(criteriaKey)) {
          await this.getRecommendations(criteria)
        }
      } catch (error) {
        console.warn('Pre-computation failed:', error)
      }
    }
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
    const authenticNames = [
      'Sarah Chen', 'Michael Torres', 'Emma Silva', 'David Park', 'Lisa Rodriguez',
      'Alex Morgan', 'Maya Singh', 'Ryan Liu', 'Zoe Williams', 'Jake Martinez',
      'Ava Thompson', 'Ethan Kumar', 'Sophia Davis', 'Noah Anderson', 'Olivia Lee',
      'Lucas Garcia', 'Mia Johnson', 'Liam Wilson', 'Isabella Brown', 'Mason Smith'
    ]
    
    const niches = ['Fashion', 'Beauty', 'Tech', 'Food', 'Lifestyle', 'Sports', 'Gaming']
    const contentStyles = ['authentic', 'professional', 'creative', 'educational', 'entertaining']
    const engagementTiers = ['low', 'medium', 'high', 'premium']
    
    return authenticNames.map((name, index) => {
      const baseFollowers = Math.floor(Math.random() * 400000) + 80000 // Realistic 80K-480K range
      const engagement = Math.random() * 3.5 + 2.5 // Industry standard 2.5-6% engagement
      const qualityScore = Math.floor(Math.random() * 2) + 3 // Conservative 3-4 quality range
      
      return {
        id: index + 1,
        name,
        username: name.toLowerCase().replace(' ', '') + (2000 + index),
        niche: criteria.niche || niches[Math.floor(Math.random() * niches.length)],
        secondaryNiches: [niches[Math.floor(Math.random() * niches.length)]],
        followers: `${Math.floor(baseFollowers/1000)}K`,
        engagement: `${engagement.toFixed(1)}%`,
        qualityScore,
        contentStyle: contentStyles[Math.floor(Math.random() * contentStyles.length)],
        engagementTier: engagementTiers[Math.floor(Math.random() * engagementTiers.length)],
        averageViews: Math.floor(baseFollowers * (engagement / 100) * 15), // Realistic view calculation
        responseRate: Math.floor(Math.random() * 15) + 80 // Professional 80-95% response rate
      }
    })
  }
}

export const productService = new ProductService()