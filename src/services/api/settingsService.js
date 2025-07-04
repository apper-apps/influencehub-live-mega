import settingsData from '@/services/mockData/settings.json'

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

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const settingsService = new SettingsService()