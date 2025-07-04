import settingsData from "@/services/mockData/settings.json";

class SettingsService {
  constructor() {
    this.settings = { ...settingsData }
  }

  async getSettings() {
    await this.delay(300)
    return { ...this.settings }
  }

  async updateSettings(updates) {
    await this.delay(400)
    this.settings = { ...this.settings, ...updates }
    return { ...this.settings }
  }

  async updatePassword(currentPassword, newPassword) {
    await this.delay(500)
    // Simulate password validation
    if (currentPassword !== 'currentpass123') {
      throw new Error('Current password is incorrect')
    }
    return true
  }

  async uploadProfileImage(file) {
    await this.delay(1000)
    // Simulate file upload
const imageUrl = URL.createObjectURL(file)
    this.settings.profileImage = imageUrl
    return imageUrl
  }
  async updateSubscriptionTier(newTier) {
    await this.delay(500)
    // Validate tier
    const validTiers = ['free', 'starter', 'growth', 'pro']
    if (!validTiers.includes(newTier)) {
      throw new Error('Invalid subscription tier')
    }
    
    // Update subscription details
    const slotLimits = {
      free: 2,
      starter: 5,
      growth: 10,
      pro: 999
    }
    
    this.settings.subscriptionTier = newTier
    this.settings.totalSlots = slotLimits[newTier]
    this.settings.usedSlots = Math.min(this.settings.usedSlots, slotLimits[newTier])
    
    // Update billing date if upgrading
    if (newTier !== 'free') {
      const nextMonth = new Date()
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      this.settings.nextBillingDate = nextMonth.toISOString()
    }
    
    return { ...this.settings }
  }

  async getSubscriptionTiers() {
    await this.delay(200)
    return {
      free: {
        name: 'Free',
        price: 0,
        slots: 2,
        features: ['Basic Analytics', 'Email Support', 'Campaign Templates']
      },
      starter: {
        name: 'Starter',
        price: 29,
        slots: 5,
        features: ['Advanced Analytics', 'Priority Support', 'Campaign Templates', 'API Access']
      },
      growth: {
        name: 'Growth',
        price: 59,
        slots: 10,
        features: ['Real-time Analytics', '24/7 Support', 'API Access', 'Team Collaboration', 'Custom Integrations']
      },
      pro: {
        name: 'Pro',
        price: 99,
        slots: 999,
        features: ['AI-Powered Analytics', 'Dedicated Manager', 'Custom Integrations', 'White-label Options', 'Priority Processing']
      }
    }
  }

  async getSlotUsage() {
    await this.delay(200)
    return {
      used: this.settings.usedSlots,
      total: this.settings.totalSlots,
      remaining: this.settings.totalSlots - this.settings.usedSlots,
      percentage: (this.settings.usedSlots / this.settings.totalSlots) * 100
    }
  }

  async updateSlotUsage(usedSlots) {
    await this.delay(300)
    if (usedSlots > this.settings.totalSlots) {
      throw new Error('Cannot exceed slot limit for current tier')
    }
    this.settings.usedSlots = usedSlots
    return { ...this.settings }
  }

async getSocialAccounts() {
    await this.delay(200)
    return { ...this.settings.socialAccounts }
  }
  
  async connectSocialAccount(platform) {
    await this.delay(800) // Simulate OAuth flow
    
    const validPlatforms = ['youtube', 'tiktok', 'facebook', 'instagram', 'twitter', 'linkedin']
    if (!validPlatforms.includes(platform)) {
      throw new Error('Invalid social platform')
    }
    
    // Simulate connection success
    if (!this.settings.socialAccounts) {
      this.settings.socialAccounts = {}
    }
    
    // Generate mock data for connected account
    const mockAccountData = {
      youtube: { username: 'TechReviewer2024', followerCount: 125000 },
      tiktok: { username: 'lifestyle_creator', followerCount: 89000 },
      facebook: { username: 'BrandInfluencer', followerCount: 45000 },
      instagram: { username: 'daily_inspiration', followerCount: 156000 },
      twitter: { username: 'thought_leader', followerCount: 34000 },
      linkedin: { username: 'business_expert', followerCount: 12000 }
    }
    
    this.settings.socialAccounts[platform] = {
      connected: true,
      verified: Math.random() > 0.3, // 70% chance of immediate verification
      username: mockAccountData[platform].username,
      followerCount: mockAccountData[platform].followerCount,
      connectedAt: new Date().toISOString(),
      lastVerified: Math.random() > 0.3 ? new Date().toISOString() : null
    }
    
    return { ...this.settings }
  }
  
  async disconnectSocialAccount(platform) {
    await this.delay(400)
    
    if (!this.settings.socialAccounts?.[platform]) {
      throw new Error('Account not connected')
    }
    
    // Remove the social account
    delete this.settings.socialAccounts[platform]
    
    return { ...this.settings }
  }
  
  async verifySocialAccount(platform) {
    await this.delay(1000)
    
    if (!this.settings.socialAccounts?.[platform]?.connected) {
      throw new Error('Account not connected')
    }
    
    // Mark as verified
    this.settings.socialAccounts[platform].verified = true
    this.settings.socialAccounts[platform].lastVerified = new Date().toISOString()
    
    return { ...this.settings }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const settingsService = new SettingsService()