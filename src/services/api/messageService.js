import messageData from '@/services/mockData/messages.json'

class MessageService {
  constructor() {
    this.conversations = [...messageData.conversations]
    this.messages = [...messageData.messages]
  }

  async getConversations() {
    await this.delay(300)
    return [...this.conversations]
  }

  async getMessages(conversationId) {
    await this.delay(200)
    const conversationMessages = this.messages.filter(m => m.conversationId === parseInt(conversationId))
    return [...conversationMessages]
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