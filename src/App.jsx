import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ExplorePage from './pages/ExplorePage'
import BookDetailPage from './pages/BookDetailPage'
import LibraryPage from './pages/LibraryPage'
import GenresPage from './pages/GenresPage'
import CommunityPage from './pages/CommunityPage'
import DashboardPage from './pages/DashboardPage'
import SearchPage from './pages/SearchPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ExplorePage />} />
        <Route path="book/:id" element={<BookDetailPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="genres" element={<GenresPage />} />
        <Route path="genres/:genre" element={<GenresPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="search" element={<SearchPage />} />
      </Route>
    </Routes>
  )
}

export default App
