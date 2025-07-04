import React, { useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'

const Loading = React.memo(({ type = 'dashboard', count = 6 }) => {
  // Performance optimization: memoize animation variants
  const skeletonVariants = useMemo(() => ({
    loading: {
      opacity: [1, 0.5, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }), [])

  // Cleanup any pending animations on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending animation frames
      if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
        // Animation cleanup handled by framer-motion
      }
    }
  }, [])

  // Memoize skeleton items to prevent recreation
  const skeletonItems = useMemo(() => 
    Array.from({ length: Math.min(count, 20) }, (_, i) => i), 
    [count]
  )

  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              variants={skeletonVariants}
              animate="loading"
              className="bg-surface p-6 rounded-lg border border-gray-700"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-600 rounded-lg shimmer"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-600 rounded shimmer"></div>
                  <div className="h-6 bg-gray-600 rounded shimmer"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Campaigns */}
          <motion.div
            variants={skeletonVariants}
            animate="loading"
            className="bg-surface p-6 rounded-lg border border-gray-700"
          >
            <div className="h-6 bg-gray-600 rounded mb-4 shimmer"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-600 rounded shimmer"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-gray-600 rounded shimmer"></div>
                    <div className="h-3 bg-gray-600 rounded w-3/4 shimmer"></div>
                  </div>
                  <div className="w-16 h-6 bg-gray-600 rounded shimmer"></div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Analytics Chart */}
          <motion.div
            variants={skeletonVariants}
            animate="loading"
            className="bg-surface p-6 rounded-lg border border-gray-700"
          >
            <div className="h-6 bg-gray-600 rounded mb-4 shimmer"></div>
            <div className="h-64 bg-gray-600 rounded shimmer"></div>
          </motion.div>
        </div>
      </div>
    )
  }

if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletonItems.map((i) => (
          <motion.div
            key={i}
            variants={skeletonVariants}
            animate="loading"
            className="bg-surface p-6 rounded-lg border border-gray-700"
            style={{ willChange: 'opacity' }}
          >
            <div className="w-full h-48 bg-gray-600 rounded mb-4 shimmer"></div>
            <div className="space-y-3">
              <div className="h-5 bg-gray-600 rounded shimmer"></div>
              <div className="h-4 bg-gray-600 rounded w-3/4 shimmer"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-600 rounded w-20 shimmer"></div>
                <div className="h-8 bg-gray-600 rounded w-24 shimmer"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'virtualized') {
    return (
      <div className="space-y-4">
        {skeletonItems.slice(0, 10).map((i) => (
          <motion.div
            key={i}
            variants={skeletonVariants}
            animate="loading"
            className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-gray-700"
            style={{ willChange: 'opacity' }}
          >
            <div className="w-12 h-12 bg-gray-600 rounded shimmer flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-600 rounded shimmer"></div>
              <div className="h-3 bg-gray-600 rounded w-2/3 shimmer"></div>
            </div>
            <div className="w-20 h-6 bg-gray-600 rounded shimmer flex-shrink-0"></div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className="bg-surface rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="h-6 bg-gray-600 rounded w-48 shimmer"></div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                variants={skeletonVariants}
                animate="loading"
                className="flex items-center gap-4 p-4 bg-gray-800 rounded"
              >
                <div className="w-12 h-12 bg-gray-600 rounded shimmer"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-600 rounded shimmer"></div>
                  <div className="h-3 bg-gray-600 rounded w-2/3 shimmer"></div>
                </div>
                <div className="w-20 h-6 bg-gray-600 rounded shimmer"></div>
                <div className="w-24 h-8 bg-gray-600 rounded shimmer"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        variants={skeletonVariants}
        animate="loading"
        className="w-8 h-8 bg-primary rounded-full"
        style={{ willChange: 'opacity' }}
      />
    </div>
  )
})

Loading.displayName = 'Loading'

export default Loading