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
}

export const productService = new ProductService()