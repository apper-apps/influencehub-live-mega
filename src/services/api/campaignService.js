import campaignData from '@/services/mockData/campaigns.json'

class CampaignService {
  constructor() {
    this.campaigns = [...campaignData]
    
    // Advanced caching with TTL and memory management
    this.cache = new Map()
    this.cacheTimestamps = new Map()
    this.cacheTTL = 3 * 60 * 1000 // 3 minutes for real-time data
    this.maxCacheSize = 500
    
    // Connection pooling simulation
    this.activeConnections = 0
    this.maxConnections = 10
    this.connectionQueue = []
    
    // Background refresh for frequently accessed data
    this.frequentlyAccessed = new Set()
    this.accessCounts = new Map()
    
    this.initializeOptimizations()
  }

  initializeOptimizations() {
    // Background cache refresh for popular items
    setInterval(() => {
      this.refreshFrequentlyAccessed()
    }, 60000) // Every minute

    // Cache cleanup
    setInterval(() => {
      this.cleanExpiredCache()
    }, 2 * 60 * 1000) // Every 2 minutes
  }

  async acquireConnection() {
    if (this.activeConnections >= this.maxConnections) {
      return new Promise(resolve => {
        this.connectionQueue.push(resolve)
      })
    }
    this.activeConnections++
    return Promise.resolve()
  }

  releaseConnection() {
    this.activeConnections--
    if (this.connectionQueue.length > 0) {
      const nextRequest = this.connectionQueue.shift()
      this.activeConnections++
      nextRequest()
    }
  }

  getCacheKey(method, params = {}) {
    return `${method}_${JSON.stringify(params)}`
  }

  getCachedData(key) {
    const timestamp = this.cacheTimestamps.get(key)
    if (timestamp && Date.now() - timestamp < this.cacheTTL) {
      // Track access for popularity
      const count = this.accessCounts.get(key) || 0
      this.accessCounts.set(key, count + 1)
      if (count > 5) {
        this.frequentlyAccessed.add(key)
      }
      return this.cache.get(key)
    }
    return null
  }

  setCachedData(key, data) {
    this.cache.set(key, data)
    this.cacheTimestamps.set(key, Date.now())
    
    if (this.cache.size > this.maxCacheSize) {
      this.cleanOldCache()
    }
  }

  cleanExpiredCache() {
    const now = Date.now()
    for (const [key, timestamp] of this.cacheTimestamps.entries()) {
      if (now - timestamp > this.cacheTTL) {
        this.cache.delete(key)
        this.cacheTimestamps.delete(key)
        this.accessCounts.delete(key)
        this.frequentlyAccessed.delete(key)
      }
    }
  }

  cleanOldCache() {
    const sortedEntries = Array.from(this.cacheTimestamps.entries())
      .sort(([, a], [, b]) => a - b)
    
    const toDelete = sortedEntries.slice(0, Math.floor(this.maxCacheSize * 0.3))
    toDelete.forEach(([key]) => {
      this.cache.delete(key)
      this.cacheTimestamps.delete(key)
      this.accessCounts.delete(key)
      this.frequentlyAccessed.delete(key)
    })
  }

  async refreshFrequentlyAccessed() {
    for (const cacheKey of this.frequentlyAccessed) {
      try {
        const [method, paramsStr] = cacheKey.split('_', 2)
        const params = JSON.parse(paramsStr || '{}')
        
        if (method === 'getAll') {
          await this.getAll({ ...params, useCache: false })
        }
      } catch (error) {
        console.warn('Background refresh failed:', error)
      }
    }
  }

  async getAll(options = {}) {
    const { page = 1, limit = 20, useCache = true } = options
    const cacheKey = this.getCacheKey('getAll', { page, limit })
    
    if (useCache) {
      const cached = this.getCachedData(cacheKey)
      if (cached) return cached
    }

    await this.acquireConnection()
    
    try {
      await this.delay(150) // Optimized delay
      
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const items = this.campaigns.slice(startIndex, endIndex)
        .map(c => ({ ...c }))
      
      const result = {
        items,
        hasMore: endIndex < this.campaigns.length,
        total: this.campaigns.length,
        page,
        limit
      }
      
      this.setCachedData(cacheKey, result)
      return result
      
    } finally {
      this.releaseConnection()
    }
  }

  async getById(id) {
    await this.delay(200)
    const campaign = this.campaigns.find(c => c.Id === parseInt(id))
    if (!campaign) {
      throw new Error('Campaign not found')
    }
    return { ...campaign }
  }

  async create(campaignData) {
    await this.delay(500)
    const newCampaign = {
      ...campaignData,
      Id: Math.max(...this.campaigns.map(c => c.Id)) + 1,
      status: 'pending',
      createdAt: new Date().toISOString(),
      views: 0,
      applications: 0
    }
    this.campaigns.push(newCampaign)
    return { ...newCampaign }
  }

  async update(id, updates) {
    await this.delay(300)
    const index = this.campaigns.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Campaign not found')
    }
    
    this.campaigns[index] = { ...this.campaigns[index], ...updates }
    return { ...this.campaigns[index] }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.campaigns.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Campaign not found')
    }
    
    this.campaigns.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const campaignService = new CampaignService()