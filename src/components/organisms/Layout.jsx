import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/organisms/Header'
import Sidebar from '@/components/organisms/Sidebar'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userType, setUserType] = useState('store') // This would come from auth context - 'store', 'influencer', or 'affiliate'
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle mobile keyboard events
  useEffect(() => {
    if (window.Capacitor) {
      import('@capacitor/keyboard').then(({ Keyboard }) => {
        const showListener = Keyboard.addListener('keyboardWillShow', () => {
          document.body.classList.add('keyboard-open')
        })
        
        const hideListener = Keyboard.addListener('keyboardWillHide', () => {
          document.body.classList.remove('keyboard-open')
        })

        return () => {
          showListener.remove()
          hideListener.remove()
        }
      })
    }
  }, [])

  return (
    <div className="flex h-screen bg-background mobile-layout">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        userType={userType}
        isMobile={isMobile}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          userType={userType}
          isMobile={isMobile}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 safe-area-inset">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout