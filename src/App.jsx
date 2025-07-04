import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import AffiliateReferrals from "@/components/pages/AffiliateReferrals";
import ProductManagement from "@/components/pages/ProductManagement";
import Settings from "@/components/pages/Settings";
import AffiliateCommissions from "@/components/pages/AffiliateCommissions";
import Analytics from "@/components/pages/Analytics";
import AffiliateDashboard from "@/components/pages/AffiliateDashboard";
import Dashboard from "@/components/pages/Dashboard";
import Wallet from "@/components/pages/Wallet";
import CampaignBrowser from "@/components/pages/CampaignBrowser";
import LandingPage from "@/components/pages/LandingPage";
import MessagingCenter from "@/components/pages/MessagingCenter";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-surface rounded-lg p-6 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
            >
>
              Refresh Page
            </button>
            {(typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
                <pre className="mt-2 text-xs text-red-400 overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
        </div>
      )
    }

    return this.props.children
}
}
const App = React.memo(() => {
  useEffect(() => {
    // Set document title for consistent branding
    document.title = 'Yphoeniex Influencer Hub'
    
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
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-white mobile-app-container">
          <ErrorBoundary>
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
          </ErrorBoundary>
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
      </BrowserRouter>
    </ErrorBoundary>
  )
})

App.displayName = 'App'

export default App