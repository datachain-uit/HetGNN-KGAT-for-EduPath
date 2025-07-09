import React from "react";
import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";

const LabelCountTable = ({ labelCounts }) => {
  return (
    <CCard className="border-info border-2 rounded-3">
      <CCardBody className="p-3">
        <h6 className="label-count-title">Label Count Table</h6>
        <CTable
          responsive
          hover
          style={{ tableLayout: "fixed", width: "100%" }} 
        >
          <CTableHead className="label-header">
            <CTableRow>
              <CTableHeaderCell style={{ width: "50%" }}>
                Label
              </CTableHeaderCell>
              <CTableHeaderCell style={{ width: "50%" }} className="text-end">
                Count
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody className="label-body">
            {Object.entries(labelCounts).map(([label, count]) => (
              <CTableRow key={label}>
                <CTableDataCell>{label}</CTableDataCell>
                <CTableDataCell className="text-end p-0">
                  {count.toLocaleString()}
                </CTableDataCell>
                {/* 👆 Xóa padding phải của ô cuối */}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default LabelCountTable;
