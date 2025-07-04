import messageData from '@/services/mockData/messages.json'

class MessageService {
  constructor() {
    this.conversations = [...messageData.conversations]
    this.messages = [...messageData.messages]
    
    // Real-time messaging optimizations
    this.cache = new Map()
    this.messageCache = new Map()
    this.unreadCounts = new Map()
    this.lastMessageTimes = new Map()
    this.subscribers = new Map()
    
    // Message pagination for large conversations
    this.messagePageSize = 50
    this.maxCachedMessages = 200
    
    // Typing indicators and presence
    this.typingIndicators = new Map()
    this.userPresence = new Map()
    
    this.initializeRealTimeFeatures()
  }

  initializeRealTimeFeatures() {
    // Simulate real-time updates
    setInterval(() => {
      this.updateUserPresence()
    }, 30000)

    // Clean up typing indicators
    setInterval(() => {
      this.cleanupTypingIndicators()
    }, 5000)
  }

  updateUserPresence() {
    // Simulate users going online/offline
    this.conversations.forEach(conv => {
      this.userPresence.set(conv.partnerId, Math.random() > 0.3)
    })
  }

  cleanupTypingIndicators() {
    const now = Date.now()
    for (const [key, timestamp] of this.typingIndicators.entries()) {
      if (now - timestamp > 5000) {
        this.typingIndicators.delete(key)
      }
    }
  }

  async getConversations(options = {}) {
    const { page = 1, limit = 20 } = options
    await this.delay(150)
    
    // Add presence and unread count information
    const enrichedConversations = this.conversations.map(conv => ({
      ...conv,
      isOnline: this.userPresence.get(conv.partnerId) || false,
      unreadCount: this.unreadCounts.get(conv.Id) || conv.unreadCount || 0
    }))
    
    const startIndex = (page - 1) * limit
    const items = enrichedConversations.slice(startIndex, startIndex + limit)
    
    return {
      items,
      hasMore: startIndex + limit < enrichedConversations.length,
      total: enrichedConversations.length
    }
  }

  async getMessages(conversationId, options = {}) {
    const { page = 1, limit = this.messagePageSize, useCache = true } = options
    const cacheKey = `messages_${conversationId}_${page}`
    
    if (useCache && this.messageCache.has(cacheKey)) {
      return this.messageCache.get(cacheKey)
    }

    await this.delay(100)
    
    const conversationMessages = this.messages.filter(m => 
      m.conversationId === parseInt(conversationId)
    )
    
    // Sort by timestamp and paginate
    conversationMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    
    const startIndex = (page - 1) * limit
    const items = conversationMessages.slice(startIndex, startIndex + limit)
      .map(m => ({ ...m }))
    
    const result = {
      items,
      hasMore: startIndex + limit < conversationMessages.length,
      total: conversationMessages.length,
      page
    }
    
    // Cache with size limit
    if (this.messageCache.size > this.maxCachedMessages) {
      const firstKey = this.messageCache.keys().next().value
      this.messageCache.delete(firstKey)
    }
    
    this.messageCache.set(cacheKey, result)
    return result
  }

  async sendMessage(conversationId, text) {
    await this.delay(400)
    const newMessage = {
      Id: Math.max(...this.messages.map(m => m.Id)) + 1,
      conversationId: parseInt(conversationId),
      senderId: 'current_user',
      text: text,
      timestamp: new Date().toISOString(),
      isOwn: true,
      read: true
    }
    this.messages.push(newMessage)
    
    // Update conversation last message
    const conversation = this.conversations.find(c => c.Id === parseInt(conversationId))
    if (conversation) {
      conversation.lastMessage = text
      conversation.lastMessageTime = newMessage.timestamp
    }
    
    return { ...newMessage }
  }

  async markAsRead(conversationId) {
    await this.delay(200)
    const conversation = this.conversations.find(c => c.Id === parseInt(conversationId))
    if (conversation) {
      conversation.unreadCount = 0
    }
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const messageService = new MessageService()