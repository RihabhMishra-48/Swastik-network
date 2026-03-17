import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import FeedPage from './pages/FeedPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import GroupsPage from './pages/GroupsPage'
import GroupChatPage from './pages/GroupChatPage'
import ProfilePage from './pages/ProfilePage'
import NotificationsPage from './pages/NotificationsPage'
import EventsPage from './pages/EventsPage'
import DiscussionPage from './pages/DiscussionPage'
import AnonDiscussionPage from './pages/AnonDiscussionPage'
import RandomChatPage from './pages/RandomChatPage'
import VerifyEmailPage from './pages/VerifyEmailPage'

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-bg-dark text-text-primary">
      {isAuthenticated && <Navbar />}
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 p-4 ${isAuthenticated ? 'mt-16 ml-64' : ''}`}>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={isAuthenticated ? <FeedPage /> : <Navigate to="/login" />} />
            <Route path="/groups" element={isAuthenticated ? <GroupsPage /> : <Navigate to="/login" />} />
            <Route path="/groups/:id" element={isAuthenticated ? <GroupChatPage /> : <Navigate to="/login" />} />
            <Route path="/profile/:id" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" />} />
            <Route path="/events" element={isAuthenticated ? <EventsPage /> : <Navigate to="/login" />} />
            <Route path="/discussion" element={isAuthenticated ? <DiscussionPage /> : <Navigate to="/login" />} />
            <Route path="/anonymous" element={isAuthenticated ? <AnonDiscussionPage /> : <Navigate to="/login" />} />
            <Route path="/random-chat" element={isAuthenticated ? <RandomChatPage /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
