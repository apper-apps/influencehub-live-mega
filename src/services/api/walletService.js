import React from "react";
import Error from "@/components/ui/Error";
import walletData from "@/services/mockData/wallet.json";

class WalletService {
  constructor() {
    this.wallet = { ...walletData.wallet }
    this.transactions = [...walletData.transactions]
  }

  async getWallet() {
    await this.delay(300)
    return { ...this.wallet }
  }

  async getTransactions() {
    await this.delay(200)
    return [...this.transactions]
  }

  async requestPayout(amount) {
    await this.delay(500)
    
    if (amount > this.wallet.availableBalance) {
      throw new Error('Insufficient balance')
    }
    
    const transaction = {
      Id: Math.max(...this.transactions.map(t => t.Id)) + 1,
      type: 'payout',
      amount: amount,
      description: 'Payout to PayPal',
      campaignName: 'System',
      status: 'completed',
      timestamp: new Date().toISOString()
    }
    
    this.transactions.unshift(transaction)
    this.wallet.availableBalance -= amount
    this.wallet.totalPaidOut += amount
    
    return { ...transaction }
  }

  async addEarning(campaignId, amount, description) {
    await this.delay(300)
    
    const transaction = {
      Id: Math.max(...this.transactions.map(t => t.Id)) + 1,
      type: 'earning',
      amount: amount,
      description: description,
      campaignName: `Campaign ${campaignId}`,
      status: 'completed',
      timestamp: new Date().toISOString()
    }
    
    this.transactions.unshift(transaction)
    this.wallet.availableBalance += amount
    this.wallet.totalEarned += amount
    
return { ...transaction }
  }

  async addDeposit(amount, paymentMethod = 'PayPal') {
    await this.delay(400)
    
    if (amount <= 0) {
      throw new Error('Invalid deposit amount')
    }
    
    const transaction = {
      Id: Math.max(...this.transactions.map(t => t.Id)) + 1,
      type: 'deposit',
      amount: amount,
      description: `Deposit via ${paymentMethod}`,
      campaignName: 'System',
      status: 'completed',
      timestamp: new Date().toISOString()
    }
    
    this.transactions.unshift(transaction)
    this.wallet.availableBalance += amount
    
    return { ...transaction }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new WalletService()