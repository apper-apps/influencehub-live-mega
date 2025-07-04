import React, { Suspense, lazy, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Loading from '@/components/ui/Loading'

// Lazy load pages for better performance
const LandingPage = lazy(() => import('@/components/pages/LandingPage'))
const Dashboard = lazy(() => import('@/components/pages/Dashboard'))
const CampaignBrowser = lazy(() => import('@/components/pages/CampaignBrowser'))
const ProductManagement = lazy(() => import('@/components/pages/ProductManagement'))
const MessagingCenter = lazy(() => import('@/components/pages/MessagingCenter'))
const Analytics = lazy(() => import('@/components/pages/Analytics'))
const Wallet = lazy(() => import('@/components/pages/Wallet'))
const Settings = lazy(() => import('@/components/pages/Settings'))
const AffiliateDashboard = lazy(() => import('@/components/pages/AffiliateDashboard'))
const AffiliateReferrals = lazy(() => import('@/components/pages/AffiliateReferrals'))
const AffiliateCommissions = lazy(() => import('@/components/pages/AffiliateCommissions'))

const App = React.memo(() => {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration)
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError)
        })
    }

    // Handle mobile app status bar
    if (window.Capacitor) {
      import('@capacitor/status-bar').then(({ StatusBar }) => {
        StatusBar.setBackgroundColor({ color: '#111827' })
        StatusBar.setStyle({ style: 'dark' })
      })
    }
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-background text-white mobile-app-container">
        <Suspense fallback={<Loading type="dashboard" />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="campaigns" element={<CampaignBrowser />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="messages" element={<MessagingCenter />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="settings" element={<Settings />} />
              <Route path="affiliate" element={<AffiliateDashboard />} />
              <Route path="affiliate/referrals" element={<AffiliateReferrals />} />
              <Route path="affiliate/commissions" element={<AffiliateCommissions />} />
            </Route>
          </Routes>
        </Suspense>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{ zIndex: 9999 }}
          limit={5}
          className="mobile-toast-container"
        />
      </div>
    </Router>
  )
})

App.displayName = 'App'

export default App