import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CContainer } from '@coreui/react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import UserManagement from './pages/UserManagement';
import CourseManagement from './pages/CourseManagement'
import Overview from './pages/Overview';
import Education from './pages/Education';
import PersonalizedLearning from './pages/PersonalizedLearning';
import ScrollToTopButton from './components/common/ScrollToTopButton';

function MainLayout() {
  const location = useLocation();

  // Mapping URL path to title
  const getTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'USER MANAGEMENT';
        case '/course':
          return 'COURSE MANAGEMENT';
      case '/overview':
        return 'OVERVIEW DATASET';
      case '/education':
        return 'EDUCATION MANAGEMENT';
      case '/learning':
        return 'PERSIONALIZED LEARNING';
      default:
        return '';
    }
  };

  const title = getTitle(location.pathname);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '240px', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <main style={{ flexGrow: 1, overflowY: 'auto' }}>
        <Header title={title} />
        <CContainer>
          <Routes>
          <Route path="/" element={<UserManagement />} />
          <Route path="/course" element={<CourseManagement />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/education" element={<Education />} />
            <Route path="/learning" element={<PersonalizedLearning />} />
          </Routes>
        </CContainer>
        <ScrollToTopButton />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;