import FileTable from "../components/FileTable";
import FileDetails from "../components/FileDetails";
import DataChart from "../components/DataChart";
import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import { CRow, CCol, CInputGroup, CFormInput, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMagnifyingGlass } from '@coreui/icons';
import "../styles/Overview.css";

const Overview = () => {
  // Khai báo state để lưu trữ dữ liệu lấy từ API
  const [datasetFiles, setDatasetFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/datapropertise/"
        );
        const result = await response.json();
        setDatasetFiles(result.data);

        // Chọn file đầu tiên làm mặc định (tuỳ chọn)
        if (result.data.length > 0) {
          setSelectedFile(result.data[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Hàm xử lý khi click vào một dòng
  const handleRowClick = (file) => {
    setSelectedFile(file);
  };

  // Hàm xử lý thay đổi input tìm kiếm
  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  // Tạo dữ liệu chi tiết từ file được chọn
  const detailData1 = selectedFile
    ? [
      ["Dataset name", selectedFile.dataset_name],
      ["Rows", selectedFile.num_rows.toLocaleString()],
      ["Columns", selectedFile.num_column],
      ["Duplications", selectedFile.num_duplicates.toLocaleString()],
      ["Missing values", selectedFile.missing_value_rate],
      ["Datatype", selectedFile.data_types.join(", ")],
    ]
    : [];

  // Hàm convert từ string "%" sang float
  const parseMissingRate = (rateString) => {
    if (!rateString) return 0;
    return parseFloat(rateString.replace("%", "")) || 0;
  };

  const allMissingRates = datasetFiles.map((file) =>
    parseMissingRate(file.missing_value_rate)
  );

  const chartData = {
    labels: datasetFiles.map((file) => file.File),
    datasets: [
      {
        label: "Missing values (%)",
        data: allMissingRates,
        backgroundColor: 'rgb(242, 182, 160)',
            borderColor: 'rgb(224, 100, 105)',
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        ticks: { color: "#000" },
      },
      x: {
        ticks: { color: "#000" },
      },
    },
  };

  return (
    <div className="content" style={{ marginTop: "64px", background: "#F9FAFB" }}>
      <div 
        className="file-summary-container"
        style={{
          border: '1px solid #828282',
          boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: '16px',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '0px',
          paddingBottom: '5px',
          backgroundColor: 'rgb(217, 171, 171)'
        }}
      >
        <div 
          className="title-file-summary"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 0',
          }}
        >
          <h5 className="text-file-summary" style={{ margin: 0, color: '#fff' }}>FILE SUMMARY</h5>
        </div>
        <CRow className="align-items-center mb-3">
          <CCol>
            <CInputGroup>
              <CFormInput 
                type="text" 
                placeholder="Search..." 
                value={searchTerm} 
                onChange={handleSearchChange} 
                style={{ color: '#000', borderColor: '#828282' }}
              />
              <CButton type="button" color="secondary">
                <CIcon icon={cilMagnifyingGlass} />
              </CButton>
            </CInputGroup>
          </CCol>
        </CRow>
        <div className="table-dataset">
          <FileTable
            datasetFiles={datasetFiles}
            onRowClick={handleRowClick}
            selectedFile={selectedFile}
          />
        </div>
      </div>

      <div 
        className="detail-dataset"
        style={{
          border: '1px solid #828282',
          boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: '16px',
          padding: '12px',
          paddingTop: '0',
          backgroundColor: 'rgb(217, 171, 171)'
        }}
      >
        <div 
          className="title-detail-dataset"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 0',
          }}
        >
          <h5 className="title-text-dataset" style={{ margin: 0, color: '#fff' }}>
            DETAIL OF {selectedFile?.File || "SELECTED FILE"}
          </h5>
        </div>
        <FileDetails detailData={detailData1} />
      </div>

      <div 
        className="missing-values"
        style={{
          border: '1px solid #828282',
          boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: '16px',
          padding: '12px',
          paddingTop: '0',
          backgroundColor: 'rgb(217, 171, 171)'
        }}
      >
        <h5 
          className="title-chart-text"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 0',
            margin: 0,
            color: '#fff'
          }}
        >
          MISSING DATA PERCENTAGE BY FILE
        </h5>
        <DataChart chartData={chartData} chartOptions={chartOptions} />
      </div>
    </div>
  );
};

export default Overview;