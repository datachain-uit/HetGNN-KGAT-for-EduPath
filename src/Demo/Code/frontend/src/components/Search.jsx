import React from 'react'
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMagnifyingGlass } from '@coreui/icons'

const SearchBar = () => {
  return (
    <div className="search-container" style={{ marginTop: 64, paddingTop: 8, paddingBottom: 12, fontFamily: 'Inter, sans-serif' }}>
      <CRow className="align-items-center mb-3">
        <CCol>
          <CInputGroup>
            <CFormInput type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} />
            <CButton type="button" color="secondary">
              <CIcon icon={cilMagnifyingGlass} />
            </CButton>
          </CInputGroup>
        </CCol>
      </CRow>
    </div>
  )
}

export default SearchBar
