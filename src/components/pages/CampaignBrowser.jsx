import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SearchBar from '@/components/molecules/SearchBar'
import CampaignCard from '@/components/molecules/CampaignCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { campaignService } from '@/services/api/campaignService'

const CampaignBrowser = () => {
  const [campaigns, setCampaigns] = useState([])
  const [filteredCampaigns, setFilteredCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState([])
  const [sortBy, setSortBy] = useState('newest')

  const filters = ['Fashion', 'Beauty', 'Tech', 'Food', 'Lifestyle', 'Sports', 'Gaming']
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'highest_commission', label: 'Highest Commission' },
    { value: 'deadline', label: 'Deadline Soon' },
    { value: 'most_popular', label: 'Most Popular' }
  ]

  useEffect(() => {
    loadCampaigns()
  }, [])

  useEffect(() => {
    filterAndSortCampaigns()
  }, [campaigns, searchQuery, selectedFilters, sortBy])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await campaignService.getAll()
      setCampaigns(data)
    } catch (err) {
      setError('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortCampaigns = () => {
    let filtered = [...campaigns]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(campaign =>
        campaign.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.storeName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(campaign =>
        selectedFilters.includes(campaign.niche)
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'highest_commission':
        filtered.sort((a, b) => b.commissionValue - a.commissionValue)
        break
      case 'deadline':
        filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        break
      case 'most_popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    setFilteredCampaigns(filtered)
  }

  const handleAcceptCampaign = async (campaignId) => {
    try {
      await campaignService.update(campaignId, { status: 'accepted' })
      setCampaigns(campaigns.map(c => 
        c.Id === campaignId ? { ...c, status: 'accepted' } : c
      ))
    } catch (err) {
      setError('Failed to accept campaign')
    }
  }

  const handleDeclineCampaign = async (campaignId) => {
    try {
      await campaignService.update(campaignId, { status: 'declined' })
      setCampaigns(campaigns.map(c => 
        c.Id === campaignId ? { ...c, status: 'declined' } : c
      ))
    } catch (err) {
      setError('Failed to decline campaign')
    }
  }

  if (loading) return <Loading type="cards" />
  if (error) return <Error message={error} onRetry={loadCampaigns} />

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Campaign Browser</h1>
          <p className="text-gray-400 mt-2">
            Discover exciting collaboration opportunities with brands
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="info" icon="Target">
            {filteredCampaigns.length} campaigns
          </Badge>
          <Button
            variant="secondary"
            icon="RefreshCw"
            onClick={loadCampaigns}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface rounded-lg border border-gray-700 p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Bar */}
          <div className="lg:col-span-2">
            <SearchBar
              placeholder="Search campaigns by product, brand, or description..."
              onSearch={setSearchQuery}
              filters={filters}
              onFilterChange={setSelectedFilters}
            />
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <label className="form-label">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {selectedFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-400">Active filters:</span>
            {selectedFilters.map(filter => (
              <Badge
                key={filter}
                variant="primary"
                size="small"
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => setSelectedFilters(selectedFilters.filter(f => f !== filter))}
              >
                {filter}
                <ApperIcon name="X" size={12} className="ml-1" />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="small"
              onClick={() => setSelectedFilters([])}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </motion.div>

      {/* Campaign Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredCampaigns.length === 0 ? (
          <Empty 
            type="campaigns"
            title="No campaigns found"
            description="Try adjusting your search or filters to find more campaigns"
            onAction={() => {
              setSearchQuery('')
              setSelectedFilters([])
            }}
            actionText="Clear Filters"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CampaignCard
                  campaign={campaign}
                  userType="influencer"
                  onAccept={handleAcceptCampaign}
                  onDecline={handleDeclineCampaign}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Load More */}
      {filteredCampaigns.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            variant="outline"
            size="large"
            icon="ChevronDown"
            onClick={() => {/* Load more campaigns */}}
          >
            Load More Campaigns
          </Button>
        </motion.div>
      )}
    </div>
  )
}

export default CampaignBrowser