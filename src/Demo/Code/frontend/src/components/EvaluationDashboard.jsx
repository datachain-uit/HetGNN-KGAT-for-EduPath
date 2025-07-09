import {
  CCard,
  CCardBody,
  CProgress,
  CRow,
  CCol,
  CCardHeader,
  CBadge,
  CButton,
  CListGroup,
  CListGroupItem,
} from "@coreui/react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React, { useEffect, useRef, useState } from "react";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EvaluationDashboard = () => {
  const models = ["4-layer-stacked LSTM", "BiLSTM", "GRU", "RNN"];
  const [direct, setDirect] = useState(null);
  const [reliabilityData1, setReliabilityData1] = useState(null);
  const [relevanceData1, setRelevanceData1] = useState(null);
  const [performance, setPerformance] = useState(null);
  const pdfRef = useRef();

  const getColor = (index) => {
    const colors = [
      "#3366CC",
      "#DC3912",
      "#FF9900",
      "#109618",
      "#990099",
      "#0099C6",
      "#DD4477",
      "#66AA00",
      "#B82E2E",
      "#316395",
      "#994499",
      "#22AA99",
    ];
    return colors[index % colors.length];
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8000/api/metrics/");
        const result = await response.json();

        const dataset = result.data.map((entry) => entry.dataset);
        const models = Object.keys(result.data[0]?.evaluation?.accuracy || {});
        const combinedDatasets = [];
        const combinedRelevance = [];
        const combinePerformance = [];
        const combinedirect = [];
        combinedirect.push({
          label: "Completeness",
          backgroundColor: getColor(0),
          data: result.data.map((entry) => entry?.completeness ?? 0),
        });
        combinedirect.push({
          label: "Consistency",
          backgroundColor: getColor(1),
          data: result.data.map((entry) => entry?.consistency ?? 0),
        });
        setDirect({ labels: dataset, datasets: combinedirect });

        models.forEach((model, modelIndex) => {
          combinePerformance.push({
            label: `Macro precision - ${model}`,
            backgroundColor: getColor(modelIndex),
            data: result.data.map(
              (entry) =>
                entry?.performance_model?.marcro?.macro_precision?.[model] ?? 0
            ),
          });
          combinePerformance.push({
            label: `Macro recall - ${model}`,
            backgroundColor: getColor(modelIndex),
            data: result.data.map(
              (entry) =>
                entry?.performance_model?.marcro?.macro_recall?.[model] ?? 0
            ),
          });
          combinePerformance.push({
            label: `Macro F1-score - ${model}`,
            backgroundColor: getColor(modelIndex),
            data: result.data.map(
              (entry) =>
                entry?.performance_model?.marcro?.macro_f1_score?.[model] ?? 0
            ),
          });
          combinePerformance.push({
            label: `Weighted precision - ${model}`,
            backgroundColor: getColor(modelIndex),
            data: result.data.map(
              (entry) =>
                entry?.performance_model?.weighted?.weighted_precision?.[
                  model
                ] ?? 0
            ),
          });
          combinePerformance.push({
            label: `Weighted recall - ${model}`,
            backgroundColor: getColor(modelIndex),
            data: result.data.map(
              (entry) =>
                entry?.performance_model?.weighted?.weighted_recall?.[model] ??
                0
            ),
          });
          combinePerformance.push({
            label: `Weighted F1-score - ${model}`,
            backgroundColor: getColor(modelIndex),
            data: result.data.map(
              (entry) =>
                entry?.performance_model?.weighted?.weighted_f1_score?.[
                  model
                ] ?? 0
            ),
          });
          combinedRelevance.push({
            label: `AUC-ROC (D) - ${model}`,
            backgroundColor: getColor(modelIndex),
            data: result.data.map(
              (entry) => entry?.evaluation?.auc_roc?.label_d?.[model] ?? 0
            ),
          });
          combinedRelevance.push({
            label: `AUC-ROC (E) - ${model}`,
            backgroundColor: getColor(modelIndex),
            data: result.data.map(
              (entry) => entry?.evaluation?.auc_roc?.label_e?.[model] ?? 0
            ),
          });
          combinedDatasets.push({
            label: `Accuracy - ${model}`,
            backgroundColor: getColor(modelIndex),
            data: result.data.map(
              (entry) => entry?.evaluation?.accuracy?.[model] ?? 0
            ),
          });
          combinedDatasets.push({
            label: `F1-score (D) - ${model}`,
            backgroundColor: getColor(modelIndex + models.length),
            data: result.data.map(
              (entry) => entry?.evaluation?.f1_score?.label_d?.[model] ?? 0
            ),
          });
          combinedDatasets.push({
            label: `F1-score (E) - ${model}`,
            backgroundColor: getColor(modelIndex + models.length * 2),
            data: result.data.map(
              (entry) => entry?.evaluation?.f1_score?.label_e?.[model] ?? 0
            ),
          });
        });
        setPerformance({ labels: dataset, datasets: combinePerformance });
        setRelevanceData1({ labels: dataset, datasets: combinedRelevance });
        setReliabilityData1({ labels: dataset, datasets: combinedDatasets });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleExportPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("evaluation.pdf");
    });
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="direct-evaluation">
          <strong>DIRECT EVALUATION</strong>
        </CCardHeader>
        <CCardBody className="direct-body">
          {direct && (
            <Bar
              data={direct}
              options={{
                responsive: true,
                indexAxis: "y", // ← thêm dòng này để làm biểu đồ nằm ngang
                plugins: { legend: { position: "bottom" } },
                scales: {
                  x: { min: 0, max: 100 }, // vì trục x giờ là trục giá trị
                  y: { beginAtZero: true },
                },
              }}
            />
          )}
        </CCardBody>
        <CCardBody>
          {/* progress bar & definitions omitted for brevity */}
          <div className="export-pdf-container">
            <CButton
              color="primary"
              size="lg"
              onClick={handleExportPDF}
              className="button-pdf"
            >
              Export to PDF
            </CButton>
          </div>
        </CCardBody>
      </CCard>

      {/* INDIRECT EVALUATION - Reliability */}
      <CCard className="reliability-chart">
        <CCardHeader className="indirect-header">
          INDIRECT EVALUATION - Reliability - Accuracy + F1-Score
        </CCardHeader>
        <CCardBody className="indirect-body">
          {reliabilityData1 && (
            <Bar
              data={reliabilityData1}
              options={{
                responsive: true,
                plugins: { legend: { position: "bottom" } },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          )}
        </CCardBody>
      </CCard>

      {/* INDIRECT EVALUATION - Relevance */}
      <CCard className="relevance-chart">
        <CCardHeader className="indirect-header">
          INDIRECT EVALUATION - Relevance - AUC-ROC
        </CCardHeader>
        <CCardBody className="indirect-body">
          {relevanceData1 && (
            <Bar
              data={relevanceData1}
              options={{
                responsive: true,
                plugins: { legend: { position: "bottom" } },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          )}
        </CCardBody>
      </CCard>

      {/* INDIRECT EVALUATION - Performance */}
      <CCard className="performance-chart">
        <CCardHeader className="indirect-header">Model Performance - Macro - Weighted</CCardHeader>
        <CCardBody className="indirect-body">
          {performance && (
            <Bar
              data={performance}
              options={{
                responsive: true,
                plugins: { legend: { position: "bottom" } },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          )}
        </CCardBody>
      </CCard>
    </>
  );
};

export default EvaluationDashboard;
