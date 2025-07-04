import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { messageService } from '@/services/api/messageService'
import { toast } from 'react-toastify'

const MessagingCenter = () => {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [messageText, setMessageText] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.Id)
    }
  }, [selectedConversation])

  const loadConversations = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await messageService.getConversations()
      setConversations(data)
      if (data.length > 0) {
        setSelectedConversation(data[0])
      }
    } catch (err) {
      setError('Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId) => {
    try {
      const data = await messageService.getMessages(conversationId)
      setMessages(data)
    } catch (err) {
      toast.error('Failed to load messages')
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedConversation) return

    try {
      setSendingMessage(true)
      const message = await messageService.sendMessage(selectedConversation.Id, messageText)
      setMessages([...messages, message])
      setMessageText('')
    } catch (err) {
      toast.error('Failed to send message')
    } finally {
      setSendingMessage(false)
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString()
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadConversations} />

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Messages</h1>
          <p className="text-gray-400 mt-2">
            Communicate with your collaboration partners
          </p>
        </div>
        
        <Button
          variant="secondary"
          icon="RefreshCw"
          onClick={loadConversations}
          loading={loading}
        >
          Refresh
        </Button>
      </motion.div>

      {/* Messaging Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface rounded-lg border border-gray-700 overflow-hidden"
        style={{ height: '600px' }}
      >
        <div className="flex h-full">
          {/* Conversations Sidebar */}
          <div className="w-1/3 border-r border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h2 className="font-semibold text-white">Conversations</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center">
                  <Empty 
                    type="messages"
                    title="No conversations"
                    description="Start a campaign to begin messaging"
                  />
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {conversations.map((conversation) => (
                    <motion.div
                      key={conversation.Id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`
                        p-3 rounded-lg cursor-pointer transition-all duration-200
                        ${selectedConversation?.Id === conversation.Id
                          ? 'bg-primary/20 border border-primary/30'
                          : 'hover:bg-gray-700'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                          <ApperIcon name="User" size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-white truncate">
                              {conversation.partnerName}
                            </h3>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="error" size="small">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 truncate">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(conversation.lastMessageTime)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="default" size="small">
                          {conversation.campaignTitle}
                        </Badge>
                        <Badge variant={conversation.status === 'active' ? 'success' : 'warning'} size="small">
                          {conversation.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <ApperIcon name="User" size={16} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          {selectedConversation.partnerName}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {selectedConversation.campaignTitle}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="success" size="small">
                        Online
                      </Badge>
                      <Button variant="ghost" size="small" icon="MoreHorizontal">
                        Options
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <ApperIcon name="MessageCircle" size={48} className="text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message.Id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`
                          max-w-xs lg:max-w-md px-4 py-2 rounded-lg
                          ${message.isOwn 
                            ? 'bg-gradient-to-r from-primary to-secondary text-white' 
                            : 'bg-gray-700 text-white'
                          }
                        `}>
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${message.isOwn ? 'text-white/70' : 'text-gray-400'}`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-700">
                  <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 form-input"
                      disabled={sendingMessage}
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      icon="Send"
                      disabled={!messageText.trim() || sendingMessage}
                      loading={sendingMessage}
                    >
                      Send
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ApperIcon name="MessageCircle" size={48} className="text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default MessagingCenter