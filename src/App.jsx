import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import LandingPage from '@/components/pages/LandingPage'
import Dashboard from '@/components/pages/Dashboard'
import CampaignBrowser from '@/components/pages/CampaignBrowser'
import ProductManagement from '@/components/pages/ProductManagement'
import MessagingCenter from '@/components/pages/MessagingCenter'
import Analytics from '@/components/pages/Analytics'
import Wallet from '@/components/pages/Wallet'
import Settings from '@/components/pages/Settings'
import AffiliateDashboard from '@/components/pages/AffiliateDashboard'
import AffiliateReferrals from '@/components/pages/AffiliateReferrals'
import AffiliateCommissions from '@/components/pages/AffiliateCommissions'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-white">
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
        />
      </div>
    </Router>
  )
}

export default App