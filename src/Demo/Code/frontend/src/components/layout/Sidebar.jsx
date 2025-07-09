import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarFooter,
  CNavItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDescription, cilBraille, cilPeople, cilList } from '@coreui/icons'
import { NavLink } from 'react-router-dom'

function Sidebar() {
  const navItemStyle = {
    width: '206px',
    marginLeft: '8px',
    fontSize: '18px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    marginBottom: '4px'
  }

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = 'rgba(146, 26, 64, 0.5)'
  }

  const handleMouseLeave = (e) => {
    // Kiểm tra trạng thái active bằng cách check class hoặc aria-current
    const isActive = e.currentTarget.classList.contains('active') ||
      e.currentTarget.getAttribute('aria-current') === 'page'

    if (isActive) {
      e.currentTarget.style.backgroundColor = 'rgb(255, 152, 152)'
      e.currentTarget.style.color = 'rgb(125, 6, 51)'
    } else {
      e.currentTarget.style.backgroundColor = 'rgb(146, 26, 64)'
      e.currentTarget.style.color = '#fff'
    }
  }

  const navItems = [
    {
      to: "/",
      icon: cilPeople,
      title: "User Management",
      label: "User Management"
    },
    {
      to: "/course",
      icon: cilList,
      title: "Course Management",
      label: "Course Management"
    },
    {
      to: "/overview",
      icon: cilDescription,
      title: "Overview Dataset",
      label: "Overview Dataset"
    },
    {
      to: "/learning",
      icon: cilBraille,
      title: "Personalized Learning",
      label: "Personalized Learning"
    }
  ]

  return (
    <CSidebar
      className="vh-100"
      style={{
        backgroundColor: 'rgb(244, 217, 208)',
        width: '240px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CSidebarBrand
        className="d-flex align-items-center px-3"
        style={{
          height: '64px',
          backgroundColor: "rgba(146, 26, 64, 0.9)"
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '15%',
            overflow: 'hidden',
            marginRight: '10px',
            flexShrink: 0,
            backgroundColor: '#fff',
          }}
        >
          <img
            src="/logo_edupath_remove_bg.png"
            alt="Edupath Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "'Alfa Slab One', sans-serif",
            fontWeight: 1000,
            fontSize: '20px',
            color: 'white',
            textDecoration: 'underline',
            textDecorationColor: 'white'
          }}
        >
          EDUPATH
        </span>
      </CSidebarBrand>

      <CSidebarNav style={{ marginTop: '6px', flex: 1 }}>
        {navItems.map((item, index) => (
          <CNavItem key={index}>
            <NavLink
              to={item.to}
              style={({ isActive }) => ({
                ...navItemStyle,
                backgroundColor: isActive ? 'rgb(255, 152, 152)' : 'rgb(146, 26, 64)',
                color: isActive ? 'rgb(125, 6, 51)' : '#fff'
              })}
              className="nav-link"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <CIcon icon={item.icon} style={{ width: '30px', height: '30px' }} />
              <span
                style={{
                  fontWeight: 480,
                  fontSize: '18px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'inline-block'
                }}
                title={item.title}
              >
                {item.label}
              </span>
            </NavLink>
          </CNavItem>
        ))}
      </CSidebarNav>

      <CSidebarFooter style={{ padding: '10px', textAlign: 'center' }}>
        <img
          src="/logo_edupath_remove_bg.png"
          alt="Edupath Logo"
          style={{
            width: '180px',
            height: '180px',
            objectFit: 'cover',
            display: 'block',
            margin: '0 auto',
            opacity: '0.5',
          }}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default Sidebar