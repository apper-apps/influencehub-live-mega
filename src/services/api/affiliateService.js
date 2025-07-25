import affiliateData from '@/services/mockData/affiliates.json'

class AffiliateService {
  constructor() {
    this.affiliates = [...affiliateData.affiliates]
    this.referrals = [...affiliateData.referrals]
    this.commissions = [...affiliateData.commissions]
    this.payouts = [...affiliateData.payouts]
    this.lastId = Math.max(...this.affiliates.map(a => a.Id), 0)
    this.lastReferralId = Math.max(...this.referrals.map(r => r.Id), 0)
    this.lastCommissionId = Math.max(...this.commissions.map(c => c.Id), 0)
    this.lastPayoutId = Math.max(...this.payouts.map(p => p.Id), 0)
    
    // Multi-tier caching system for scale
    this.cache = new Map()
    this.sessionCache = new Map()
    this.cacheTimestamps = new Map()
    this.backgroundTasks = new Set()
    this.cacheTTL = 5 * 60 * 1000 // 5 minutes
    this.maxCacheSize = 1000
    
    // Performance monitoring
    this.requestCount = 0
    this.avgResponseTime = 0
    
    // Initialize background cleanup
    this.initializeCacheCleanup()
  }

  initializeCacheCleanup() {
    // Clean up expired cache entries every 5 minutes
    setInterval(() => {
      this.cleanExpiredCache()
    }, 5 * 60 * 1000)
  }

  cleanExpiredCache() {
    const now = Date.now()
    for (const [key, timestamp] of this.cacheTimestamps.entries()) {
      if (now - timestamp > this.cacheTTL) {
        this.cache.delete(key)
        this.sessionCache.delete(key)
        this.cacheTimestamps.delete(key)
      }
    }
    
    // Limit cache size to prevent memory issues
    if (this.cache.size > this.maxCacheSize) {
      const entries = Array.from(this.cache.entries())
      entries.slice(0, Math.floor(this.maxCacheSize * 0.2)).forEach(([key]) => {
        this.cache.delete(key)
        this.sessionCache.delete(key)
        this.cacheTimestamps.delete(key)
      })
    }
  }

  getCacheKey(method, params = {}) {
    return `${method}_${JSON.stringify(params)}`
  }

  getCachedData(key) {
    const timestamp = this.cacheTimestamps.get(key)
    if (timestamp && Date.now() - timestamp < this.cacheTTL) {
      return this.cache.get(key)
    }
    return null
  }

  setCachedData(key, data) {
    this.cache.set(key, data)
    this.cacheTimestamps.set(key, Date.now())
  }

  trackPerformance(startTime) {
    const duration = Date.now() - startTime
    this.requestCount++
    this.avgResponseTime = ((this.avgResponseTime * (this.requestCount - 1)) + duration) / this.requestCount
  }

  // Affiliate Management
async getAll(options = {}) {
    const startTime = Date.now()
    const { page = 1, limit = 50, useCache = true } = options
    const cacheKey = this.getCacheKey('getAll', { page, limit })
    
    if (useCache) {
      const cached = this.getCachedData(cacheKey)
      if (cached) {
        this.trackPerformance(startTime)
        return cached
      }
    }

    await this.delay(150) // Reduced delay for better performance
    
    // Implement pagination for better memory management
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const items = this.affiliates.slice(startIndex, endIndex).map(a => ({ ...a }))
    const hasMore = endIndex < this.affiliates.length
    
    const result = {
      items,
      hasMore,
      total: this.affiliates.length,
      page,
      limit
    }
    
    this.setCachedData(cacheKey, result)
    this.trackPerformance(startTime)
    
    // Background prefetch next page
    if (hasMore && !this.backgroundTasks.has(`prefetch_${page + 1}`)) {
      this.prefetchNextPage(page + 1, limit)
    }
    
    return result
  }

  async getById(id) {
    const startTime = Date.now()
    const cacheKey = this.getCacheKey('getById', { id })
    
    const cached = this.getCachedData(cacheKey)
    if (cached) {
      this.trackPerformance(startTime)
      return cached
    }

    await this.delay(100)
    const affiliate = this.affiliates.find(a => a.Id === id)
    const result = affiliate ? { ...affiliate } : null
    
    if (result) {
      this.setCachedData(cacheKey, result)
    }
    
    this.trackPerformance(startTime)
    return result
  }

  async prefetchNextPage(page, limit) {
    const taskKey = `prefetch_${page}`
    this.backgroundTasks.add(taskKey)
    
    try {
      // Small delay to not interfere with main requests
      await this.delay(500)
      await this.getAll({ page, limit, useCache: false })
    } catch (error) {
      console.warn('Background prefetch failed:', error)
    } finally {
      this.backgroundTasks.delete(taskKey)
    }
  }
async create(affiliateData) {
    const startTime = Date.now()
    await this.delay(200) // Reduced delay
    
    const newAffiliate = {
      ...affiliateData,
      Id: ++this.lastId,
      joinDate: new Date().toISOString(),
      status: 'active',
      totalReferrals: 0,
      successfulReferrals: 0,
      totalEarnings: 0,
      pendingCommissions: 0,
      referralCode: this.generateReferralCode(affiliateData.name),
      commissionRate: 0.5
    }
    
    this.affiliates.push(newAffiliate)
    
    // Invalidate relevant caches
    this.invalidateCache(['getAll'])
    
    this.trackPerformance(startTime)
    return { ...newAffiliate }
  }

  invalidateCache(patterns = []) {
    for (const [key] of this.cache.entries()) {
      for (const pattern of patterns) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
          this.sessionCache.delete(key)
          this.cacheTimestamps.delete(key)
        }
      }
    }
  }

  async update(id, updates) {
    await this.delay(400)
    const index = this.affiliates.findIndex(a => a.Id === id)
    if (index === -1) throw new Error('Affiliate not found')
    
    this.affiliates[index] = { ...this.affiliates[index], ...updates }
    return { ...this.affiliates[index] }
  }

  async delete(id) {
    await this.delay(300)
    const index = this.affiliates.findIndex(a => a.Id === id)
    if (index === -1) throw new Error('Affiliate not found')
    
    this.affiliates.splice(index, 1)
    return true
  }

  // Referral Management
  async getAllReferrals() {
    await this.delay(300)
    return [...this.referrals]
  }

  async getReferralsByAffiliate(affiliateId) {
    await this.delay(250)
    return this.referrals.filter(r => r.affiliateId === affiliateId)
  }

  async createReferral(referralData) {
    await this.delay(400)
    const newReferral = {
      ...referralData,
      Id: ++this.lastReferralId,
      signupDate: new Date().toISOString(),
      status: 'pending',
      subscriptionPlan: null,
      subscriptionValue: 0,
      commissionEarned: 0,
      conversionDate: null
    }
    this.referrals.push(newReferral)
    
    // Update affiliate referral count
    const affiliate = this.affiliates.find(a => a.Id === referralData.affiliateId)
    if (affiliate) {
      affiliate.totalReferrals += 1
    }
    
    return { ...newReferral }
  }

  async convertReferral(referralId, subscriptionPlan, subscriptionValue) {
    await this.delay(500)
    const referral = this.referrals.find(r => r.Id === referralId)
    if (!referral) throw new Error('Referral not found')
    
    const affiliate = this.affiliates.find(a => a.Id === referral.affiliateId)
    if (!affiliate) throw new Error('Affiliate not found')
    
    const commissionAmount = subscriptionValue * affiliate.commissionRate
    
    // Update referral
    referral.status = 'converted'
    referral.subscriptionPlan = subscriptionPlan
    referral.subscriptionValue = subscriptionValue
    referral.commissionEarned = commissionAmount
    referral.conversionDate = new Date().toISOString()
    
    // Create commission record
    const commission = {
      Id: ++this.lastCommissionId,
      affiliateId: affiliate.Id,
      referralId: referralId,
      amount: commissionAmount,
      date: new Date().toISOString(),
      status: 'pending',
      payoutDate: null,
      subscriptionPlan: subscriptionPlan,
      customerName: referral.name
    }
    this.commissions.push(commission)
    
    // Update affiliate statistics
    affiliate.successfulReferrals += 1
    affiliate.pendingCommissions += commissionAmount
    
    return { referral: { ...referral }, commission: { ...commission } }
  }

  // Commission Management
  async getAllCommissions() {
    await this.delay(300)
    return [...this.commissions]
  }

  async getCommissionsByAffiliate(affiliateId) {
    await this.delay(250)
    return this.commissions.filter(c => c.affiliateId === affiliateId)
  }

  async getCommissionById(id) {
    await this.delay(200)
    const commission = this.commissions.find(c => c.Id === id)
    return commission ? { ...commission } : null
  }

  // Payout Management
  async getAllPayouts() {
    await this.delay(300)
    return [...this.payouts]
  }

  async getPayoutsByAffiliate(affiliateId) {
    await this.delay(250)
    return this.payouts.filter(p => p.affiliateId === affiliateId)
  }

  async createPayout(affiliateId, amount, method = 'bank_transfer') {
    await this.delay(600)
    const affiliate = this.affiliates.find(a => a.Id === affiliateId)
    if (!affiliate) throw new Error('Affiliate not found')
    
    if (amount > affiliate.pendingCommissions) {
      throw new Error('Payout amount exceeds pending commissions')
    }
    
    // Create payout record
    const payout = {
      Id: ++this.lastPayoutId,
      affiliateId: affiliateId,
      amount: amount,
      date: new Date().toISOString(),
      status: 'completed',
      method: method,
      transactionId: `TXN_${Date.now()}_${affiliateId}`,
      commissionsIncluded: this.commissions.filter(c => 
        c.affiliateId === affiliateId && c.status === 'pending'
      ).length
    }
    this.payouts.push(payout)
    
    // Update commission statuses
    this.commissions.forEach(commission => {
      if (commission.affiliateId === affiliateId && commission.status === 'pending') {
        commission.status = 'paid'
        commission.payoutDate = payout.date
      }
    })
    
    // Update affiliate totals
    affiliate.pendingCommissions -= amount
    affiliate.totalEarnings += amount
    affiliate.lastPayoutDate = payout.date
    
    return { ...payout }
  }

  // Analytics and Statistics
  async getAffiliateStats(affiliateId) {
    await this.delay(300)
    const affiliate = this.affiliates.find(a => a.Id === affiliateId)
    if (!affiliate) throw new Error('Affiliate not found')
    
    const referrals = this.referrals.filter(r => r.affiliateId === affiliateId)
    const commissions = this.commissions.filter(c => c.affiliateId === affiliateId)
    const payouts = this.payouts.filter(p => p.affiliateId === affiliateId)
    
    const conversionRate = referrals.length > 0 ? 
      (referrals.filter(r => r.status === 'converted').length / referrals.length) * 100 : 0
    
    const avgCommissionValue = commissions.length > 0 ?
      commissions.reduce((sum, c) => sum + c.amount, 0) / commissions.length : 0
    
    return {
      totalReferrals: referrals.length,
      convertedReferrals: referrals.filter(r => r.status === 'converted').length,
      pendingReferrals: referrals.filter(r => r.status === 'pending').length,
      conversionRate: conversionRate,
      totalCommissions: commissions.reduce((sum, c) => sum + c.amount, 0),
      paidCommissions: commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0),
      pendingCommissions: commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0),
      avgCommissionValue: avgCommissionValue,
      totalPayouts: payouts.reduce((sum, p) => sum + p.amount, 0),
      lastPayoutDate: affiliate.lastPayoutDate
    }
  }

  async getTopPerformers(limit = 5) {
    await this.delay(250)
    return [...this.affiliates]
      .sort((a, b) => b.totalEarnings - a.totalEarnings)
      .slice(0, limit)
  }

  // Utility Methods
  generateReferralCode(name) {
    const prefix = name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${prefix}${year}${random}`
  }

  generateReferralLink(referralCode) {
    return `https://influencehub.com/signup?ref=${referralCode}`
  }

  async validateReferralCode(code) {
    await this.delay(200)
    const affiliate = this.affiliates.find(a => a.referralCode === code && a.status === 'active')
    return affiliate ? { ...affiliate } : null
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const affiliateService = new AffiliateService()