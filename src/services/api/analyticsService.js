import analyticsData from '@/services/mockData/analytics.json'

class AnalyticsService {
  constructor() {
    this.analytics = { ...analyticsData }
  }

  async getAnalytics(timeRange = '30d') {
    await this.delay(400)
    
    // Simulate different data based on time range
    const multiplier = this.getMultiplier(timeRange)
    
    return {
      totalRevenue: Math.floor(this.analytics.totalRevenue * multiplier),
      totalEarnings: Math.floor(this.analytics.totalEarnings * multiplier),
      activeCampaigns: Math.floor(this.analytics.activeCampaigns * multiplier),
      completedCampaigns: Math.floor(this.analytics.completedCampaigns * multiplier),
      totalViews: Math.floor(this.analytics.totalViews * multiplier),
      totalEngagement: Math.floor(this.analytics.totalEngagement * multiplier),
      conversionRate: this.analytics.conversionRate,
      successRate: this.analytics.successRate,
      chartData: this.generateChartData(timeRange),
      topProducts: this.analytics.topProducts,
      topInfluencers: this.analytics.topInfluencers
    }
  }

  getMultiplier(timeRange) {
    switch (timeRange) {
      case '7d': return 0.25
      case '30d': return 1
      case '90d': return 3
      case '1y': return 12
      default: return 1
    }
  }

  generateChartData(timeRange) {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    const data = []
    
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - i))
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 1000) + 500,
        views: Math.floor(Math.random() * 5000) + 1000,
        conversions: Math.floor(Math.random() * 50) + 10
      })
    }
    
    return data
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const analyticsService = new AnalyticsService()