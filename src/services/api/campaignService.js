import campaignData from '@/services/mockData/campaigns.json'

class CampaignService {
  constructor() {
    this.campaigns = [...campaignData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.campaigns]
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