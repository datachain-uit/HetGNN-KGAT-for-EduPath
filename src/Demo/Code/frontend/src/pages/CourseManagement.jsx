import React, { useState, useMemo, useEffect } from 'react';
import {
    CButton, CCol, CCloseButton, CFormInput, CInputGroup, CRow,
    CTable, CTableBody, CTableDataCell, CTableHead,
    CTableHeaderCell, CTableRow
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilFilter, cilMagnifyingGlass } from '@coreui/icons';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Constants
const COURSES_DATA = [
    { id: 'C_1245', name: 'analysis of northern song dynasty to modern literature', school: 'tsinghua university', students: 5000, recommendedNum: 800 },
    { id: 'C_2765', name: 'data mining: theory and algorithm', school: 'tsinghua university', students: 3000, recommendedNum: 950 },
    { id: 'C_7866', name: 'software theory basics', school: 'beijing forestry university', students: 4000, recommendedNum: 600 },
    { id: 'C_10043', name: 'principles of ideological and political education', school: 'shanxi university', students: 350, recommendedNum: 200 },
    { id: 'C_37587', name: 'plant fiber chemistry', school: 'tsinghua university', students: 1000, recommendedNum: 450 },
    { id: 'C_38569', name: 'database technology and programming', school: 'nankai university', students: 1500, recommendedNum: 700 },
    { id: 'C_44446', name: 'history of western philosophy', school: 'southeast university', students: 223, recommendedNum: 150 },
    { id: 'C_89763', name: 'the master of e-era - the practice of mooc teachers', school: 'tsinghua university', students: 120, recommendedNum: 100 },
    { id: 'C_20478', name: 'blockchain and cryptocurrency', school: 'tsinghua university', students: 125, recommendedNum: 850 },
    { id: 'C_12475', name: 'nutrition around you', school: 'tsinghua university', students: 57, recommendedNum: 50 },
    { id: 'C_88885', name: 'educational quantitative research methods (advanced)', school: 'beijing forestry university', students: 63, recommendedNum: 120 },
    { id: 'C_88889', name: 'marketing practices', school: 'beijing university', students: 57, recommendedNum: 300 },
    { id: 'C_46464', name: 'world champion liu wei teaches you how to play table tennis', school: 'tsinghua university', students: 1090, recommendedNum: 400 },
    { id: 'C_99996', name: 'introduction to china\'s economy', school: 'tsinghua university', students: 2180, recommendedNum: 900 },
    { id: 'C_72632', name: 'western music in the 20th century', school: 'tsinghua university', students: 110, recommendedNum: 80 },
    { id: 'C_65573', name: 'basics of c++ language programming', school: 'tsinghua university', students: 2500, recommendedNum: 750 },
];

// Mock data for recommended fields chart
const RECOMMENDED_FIELDS_DATA = {
    fields: ['Computer Science', 'Data Science', 'Economics', 'Literature', 'Philosophy', 'Chemistry', 'Biology', 'Music', 'History', 'Nutrition'],
    counts: [2500, 2000, 1800, 1500, 1200, 1000, 900, 800, 700, 600],
};

const styles = {
    container: {
        marginTop: 64,
        paddingTop: 8,
        paddingBottom: 12,
        width: '100%',
        fontFamily: 'Inter, sans-serif'
    },
    searchInput: {
        fontSize: 16,
        borderRadius: 5,
        padding: '5px 10px',
        border: '1px solid #ced4da'
    },
    button: {
        backgroundColor: '#6c757d',
        border: 'none',
        padding: '5px 10px',
        borderRadius: 5,
        fontSize: 16,
        lineHeight: '150%',
        fontWeight: 500,
        color: '#fff'
    },
    searchButton: {
        backgroundColor: '#6c757d',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '0 5px 5px 0',
    },
    totalCourses: {
        fontSize: 16,
        fontWeight: 600,
        color: '#FFFFFF',
        background: 'rgb(199, 91, 122)',
        border: '1px solid rgba(0, 0, 0, 0.8)',
        borderRadius: '4px',
        marginRight: '12px'
    },
    tableContainer: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #828282',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: '16px',
        overflowY: 'auto',
        maxHeight: '600px',
    },
    tableHeader: {
        height: '45px',
        backgroundColor: '#0071bc',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        position: 'sticky',
        top: 0,
        zIndex: 1
    },
    tableRow: {
        cursor: 'pointer',
        boxSizing: 'border-box',
        height: '55px',
        borderTop: '1px solid rgba(0, 0, 0, 0.4)'
    },
    showButton: {
        backgroundColor: 'rgb(224, 100, 105)',
        borderRadius: '4px',
        color: '#FFFFFF',
        fontSize: '16px',
        lineHeight: '150%',
        padding: '3px 10px',
        border: 'none',
        transition: 'background-color 0.2s',
    },
    popupOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    courseDetailPopup: {
        position: 'relative',
        width: '500px',
        height: '450px',
        background: 'rgb(244, 217, 208)',
        borderRadius: '8px',
        padding: '20px',
        overflowY: 'auto',
    },
    chartContainer: {
        marginTop: '-8px',
        marginBottom: '12px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #828282',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        height: '400px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    chartWrapper: {
        flex: 1,
        width: '100%',
    },
    filterContainer: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '0 8px'
    },
    filterIcon: {
        marginLeft: '4px',
        width: '20px',
        height: '20px'
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        backgroundColor: '#FFFFFF',
        border: '1px solid #828282',
        borderRadius: '4px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1001,
        padding: '8px',
        minWidth: '150px'
    },
    dropdownButton: {
        display: 'block',
        width: '100%',
        padding: '8px 12px',
        fontFamily: 'Inter',
        fontSize: '14px',
        color: '#000000',
        backgroundColor: 'transparent',
        border: 'none',
        textAlign: 'left',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'background-color 0.2s'
    },
    dropdownButtonHover: {
        backgroundColor: 'rgba(255, 170, 170, 0.5)'
    },
    rangeFilterContainer: {
        padding: '8px 12px'
    },
    rangeInput: {
        width: '80px',
        padding: '4px',
        margin: '4px',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        fontSize: '14px'
    },
    rangeLabel: {
        fontFamily: 'Inter',
        fontSize: '12px',
        color: '#000000',
        marginRight: '8px'
    }
};

// Sub-components
const SearchBar = ({ searchTerm, onSearchChange }) => (
    <CCol>
        <CInputGroup style={{ width: '100%' }}>
            <CFormInput
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={onSearchChange}
                style={styles.searchInput}
            />
            <CButton type="button" color="secondary" style={styles.searchButton}>
                <CIcon icon={cilMagnifyingGlass} style={{ color: '#fff' }} />
            </CButton>
        </CInputGroup>
    </CCol>
);

const FilterButton = () => (
    <CCol xs="auto">
        <CButton color="secondary" className="me-2" style={styles.button}>
            <CIcon icon={cilFilter} style={{ marginRight: 5 }} /> Filter
        </CButton>
    </CCol>
);

const TotalCourses = () => (
    <CCol xs="auto" className="text-end" style={styles.totalCourses}>
        Total courses: {2539}
    </CCol>
);

const CourseTableHeader = ({
    onStudentsFilterClick,
    onRecommendedFilterClick,
    showStudentsDropdown,
    showRecommendedDropdown,
    studentsSortOrder,
    recommendedSortOrder,
    handleStudentsSortOrder,
    handleRecommendedSortOrder,
    handleStudentsRangeFilter,
    handleRecommendedRangeFilter,
    handleResetFilters
}) => {
    const headerStyle = {
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: '16px',
        lineHeight: '150%',
        color: 'black'
    };

    const [minStudents, setMinStudents] = useState('');
    const [maxStudents, setMaxStudents] = useState('');
    const [minRecommended, setMinRecommended] = useState('');
    const [maxRecommended, setMaxRecommended] = useState('');

    const handleStudentsRangeSubmit = (e) => {
        if (e.key === 'Enter') {
            let min = parseInt(minStudents, 10);
            let max = parseInt(maxStudents, 10);
            if (isNaN(min) || min < 0) min = null;
            if (isNaN(max) || max < 0) max = null;
            if (min !== null && max !== null && min > max) [min, max] = [max, min];
            handleStudentsRangeFilter({ min, max });
            setMinStudents('');
            setMaxStudents('');
        }
    };

    const handleRecommendedRangeSubmit = (e) => {
        if (e.key === 'Enter') {
            let min = parseInt(minRecommended, 10);
            let max = parseInt(maxRecommended, 10);
            if (isNaN(min) || min < 0) min = null;
            if (isNaN(max) || max < 0) max = null;
            if (min !== null && max !== null && min > max) [min, max] = [max, min];
            handleRecommendedRangeFilter({ min, max });
            setMinRecommended('');
            setMaxRecommended('');
        }
    };

    const handleInputClick = (e) => {
        e.stopPropagation();
    };

    return (
        <CTableHead style={styles.tableHeader}>
            <CTableRow>
                <CTableHeaderCell style={{ ...headerStyle, width: '100px' }}>Course ID</CTableHeaderCell>
                <CTableHeaderCell style={{ ...headerStyle, width: '250px' }}>Name</CTableHeaderCell>
                <CTableHeaderCell style={{ ...headerStyle, width: '150px' }}>School</CTableHeaderCell>
                <CTableHeaderCell style={{ ...headerStyle, width: '150px', textAlign: 'center', position: 'relative' }}>
                    <div className="filter-container" style={styles.filterContainer} onClick={onStudentsFilterClick}>
                        Num stu. enrolled
                        <CIcon icon={cilFilter} style={styles.filterIcon} />
                    </div>
                    {showStudentsDropdown && (
                        <div className="dropdown" style={styles.dropdown}>
                            <button
                                style={styles.dropdownButton}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.dropdownButtonHover.backgroundColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => handleResetFilters('enrollment_count')}
                            >
                                All
                            </button>
                            <button
                                style={styles.dropdownButton}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.dropdownButtonHover.backgroundColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => handleStudentsSortOrder('asc')}
                            >
                                Sort Ascending
                            </button>
                            <button
                                style={styles.dropdownButton}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.dropdownButtonHover.backgroundColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => handleStudentsSortOrder('desc')}
                            >
                                Sort Descending
                            </button>
                            <div style={styles.rangeFilterContainer}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={styles.rangeLabel}>Min:</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={minStudents}
                                        onChange={(e) => setMinStudents(e.target.value)}
                                        onKeyDown={handleStudentsRangeSubmit}
                                        onClick={handleInputClick}
                                        style={styles.rangeInput}
                                        placeholder="Min"
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={styles.rangeLabel}>Max:</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={maxStudents}
                                        onChange={(e) => setMaxStudents(e.target.value)}
                                        onKeyDown={handleStudentsRangeSubmit}
                                        onClick={handleInputClick}
                                        style={styles.rangeInput}
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </CTableHeaderCell>
                <CTableHeaderCell style={{ ...headerStyle, width: '150px', textAlign: 'center', position: 'relative' }}>
                    <div className="filter-container" style={styles.filterContainer} onClick={onRecommendedFilterClick}>
                        Recommended num
                        <CIcon icon={cilFilter} style={styles.filterIcon} />
                    </div>
                    {showRecommendedDropdown && (
                        <div className="dropdown" style={styles.dropdown}>
                            <button
                                style={styles.dropdownButton}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.dropdownButtonHover.backgroundColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => handleResetFilters('recommendation_count')}
                            >
                                All
                            </button>
                            <button
                                style={styles.dropdownButton}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.dropdownButtonHover.backgroundColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => handleRecommendedSortOrder('asc')}
                            >
                                Sort Ascending
                            </button>
                            <button
                                style={styles.dropdownButton}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.dropdownButtonHover.backgroundColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => handleRecommendedSortOrder('desc')}
                            >
                                Sort Descending
                            </button>
                            <div style={styles.rangeFilterContainer}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={styles.rangeLabel}>Min:</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={minRecommended}
                                        onChange={(e) => setMinRecommended(e.target.value)}
                                        onKeyDown={handleRecommendedRangeSubmit}
                                        onClick={handleInputClick}
                                        style={styles.rangeInput}
                                        placeholder="Min"
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={styles.rangeLabel}>Max:</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={maxRecommended}
                                        onChange={(e) => setMaxRecommended(e.target.value)}
                                        onKeyDown={handleRecommendedRangeSubmit}
                                        onClick={handleInputClick}
                                        style={styles.rangeInput}
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </CTableHeaderCell>
                <CTableHeaderCell style={{ ...headerStyle, width: '100px', textAlign: 'center' }}>Details</CTableHeaderCell>
            </CTableRow>
        </CTableHead>
    );
};

const CourseTableRow = ({ course, onRowClick, onShowClick }) => {
    const cellStyle = {
        fontFamily: 'Inter',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '150%',
        color: '#000000'
    };

    const firstCellStyle = {
        ...cellStyle,
        paddingLeft: '16px'
    };

    const handleMouseEnter = (e) => {
        e.currentTarget.style.transform = 'scale(1.01)';
        e.currentTarget.style.transition = 'transform 0.2s';
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = 'scale(1)';
    };

    const handleShowHover = (e, isHover) => {
        e.currentTarget.style.backgroundColor = isHover
            ? 'rgba(224, 100, 105, 0.8)'
            : 'rgba(224, 100, 105, 1)';
    };

    return (
        <CTableRow
            onClick={() => onRowClick(course)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={styles.tableRow}
        >
            <CTableDataCell style={{ ...firstCellStyle, width: '120px' }}>{course.course_id}</CTableDataCell>
            <CTableDataCell style={{ ...cellStyle, width: '300px' }}>{course.course_name}</CTableDataCell>
            <CTableDataCell style={{ ...cellStyle, width: '200px' }}>{course.school_name}</CTableDataCell>
            <CTableDataCell style={{ ...cellStyle, width: '150px', textAlign: 'center' }}>{course.enrollment_count}</CTableDataCell>
            <CTableDataCell style={{ ...cellStyle, width: '150px', textAlign: 'center' }}>{course.recommendation_count}</CTableDataCell>
            <CTableDataCell style={{ width: '100px', textAlign: 'center' }}>
                <CButton
                    color="success"
                    size="sm"
                    onClick={() => { onShowClick(course) }}
                    onMouseEnter={(e) => handleShowHover(e, true)}
                    onMouseLeave={(e) => handleShowHover(e, false)}
                    style={styles.showButton}
                >
                    Show
                </CButton>
            </CTableDataCell>
        </CTableRow>
    );
};

const CourseDetailPopup = ({ course, onClose }) => {
    const labelStyle = {
        fontFamily: 'Inter',
        fontWeight: 600,
        fontSize: '16px',
        lineHeight: '150%',
        color: '#000000',
        marginBottom: '5px',
    };

    const valueStyle = {
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '150%',
        color: '#000000',
        marginBottom: '15px',
    };

    return (
        <div style={styles.courseDetailPopup} onClick={(e) => e.stopPropagation()}>
            <div style={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '150%',
                textAlign: 'center',
                marginBottom: '20px',
                color: '#000000',
            }}>
                COURSE DETAILS
            </div>
            <div>
                <div style={labelStyle}>Course ID:</div>
                <div style={valueStyle}>{course.course_id}</div>
            </div>
            <div>
                <div style={labelStyle}>Course name:</div>
                <div style={valueStyle}>{course.course_name}</div>
            </div>
            <div>
                <div style={labelStyle}>Field:</div>
                <div style={valueStyle}>{course.course_field}</div>
            </div>
            <div>
                <div style={labelStyle}>School:</div>
                <div style={valueStyle}>{course.school_name}</div>
            </div>
            <div>
                <div style={labelStyle}>Teacher:</div>
                <div style={valueStyle}>{course.teacher_name}</div>
            </div>
            <div>
                <div style={labelStyle}>Total students enrolled:</div>
                <div style={valueStyle}>{course.enrollment_count}</div>
            </div>
            <div>
                <div style={labelStyle}>Course description:</div>
                <div style={valueStyle}>{course.course_about}</div>
            </div>
            <CCloseButton
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                }}
                onClick={onClose}
            />
        </div>
    );
};



// New Chart Component
const RecommendedFieldsChart = React.memo(() => {

    const [fieldData, setFieldData] = useState([]);
    const [fieldLoading, setFieldLoading] = useState(false);

    useEffect(() => {
        const fetchFieldData = async () => {
            try {
                setFieldLoading(true);
                const response = await fetch('http://127.0.1:8000/api/field/');
                const data = await response.json();
                setFieldData(data.data || []);
                console.log('Fetched field data:', data.data);

            } catch (error) {
                console.error('Error fetching field data:', error);
                setFieldData([]);
            } finally {
                setFieldLoading(false);
            }
        };
        fetchFieldData();
    }, []);

    // Tách labels và data từ fieldData
    const labels = fieldData.map(item => item.course_field);
    const counts = fieldData.map(item => item.count);

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Recommendations',
            data: counts,
            backgroundColor: 'rgb(242, 182, 160)',
            borderColor: 'rgb(224, 100, 105)',
            borderWidth: 1,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y} recommendations` } }
        },
        scales: {
            x: {
            ticks: {
                callback: function(value, index, ticks) {
                    const label = this.getLabelForValue(value);
                    return label.length > 15 ? label.slice(0, 13) + '...' : label;
                },
                maxRotation: 45,
                minRotation: 0,
                autoSkip: false,
            }
        },
            y: { beginAtZero: true, ticks: { stepSize: 20 } }
        },
    };

    return (
        <div style={styles.chartContainer}>
            <h3 style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
                TOP 10 RECOMMENDED FIELDS
            </h3>
            <div style={styles.chartWrapper}>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
});

// Main Component
const CourseManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [studentsSortOrder, setStudentsSortOrder] = useState(null);
    const [recommendedSortOrder, setRecommendedSortOrder] = useState(null);
    const [studentsFilter, setStudentsFilter] = useState({ min: null, max: null });
    const [recommendedFilter, setRecommendedFilter] = useState({ min: null, max: null });
    const [showStudentsDropdown, setShowStudentsDropdown] = useState(false);
    const [showRecommendedDropdown, setShowRecommendedDropdown] = useState(false);
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleRowClick = (course) => setSelectedCourse(course);
    const handleShowClick = (courseId) => {
        const course = COURSES_DATA.find(c => c.id === courseId);
        setSelectedCourse(course);
    };
    const closePopup = () => setSelectedCourse(null);

    const handleStudentsFilterClick = (e) => {
        e.stopPropagation();
        setShowStudentsDropdown(prev => !prev);
        setShowRecommendedDropdown(false);
    };

    const handleRecommendedFilterClick = (e) => {
        e.stopPropagation();
        setShowRecommendedDropdown(prev => !prev);
        setShowStudentsDropdown(false);
    };

    const handleStudentsSortOrder = (order) => {
        setStudentsSortOrder(order);
        setShowStudentsDropdown(false);
    };

    const handleRecommendedSortOrder = (order) => {
        setRecommendedSortOrder(order);
        setShowRecommendedDropdown(false);
    };

    const handleStudentsRangeFilter = ({ min, max }) => {
        setStudentsFilter({ min, max });
        setShowStudentsDropdown(false);
    };

    const handleRecommendedRangeFilter = ({ min, max }) => {
        setRecommendedFilter({ min, max });
        setShowRecommendedDropdown(false);
    };

    const handleResetFilters = (type) => {
        if (type === 'enrollment_count') {
            setStudentsSortOrder(null);
            setStudentsFilter({ min: null, max: null });
            setShowStudentsDropdown(false);
        } else if (type === 'recommendation_count') {
            setRecommendedSortOrder(null);
            setRecommendedFilter({ min: null, max: null });
            setShowRecommendedDropdown(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.filter-container') && !e.target.closest('.dropdown')) {
                setShowStudentsDropdown(false);
                setShowRecommendedDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://127.0.0.1:8000/api/course/');
                // Map API data to match component's expected format
                const json = await response.json();
                setAllCourses(json.data || []);
                console.log('Fetched courses:', json.data);
            } catch (err) {
                setError('Failed to fetch courses. Please try again later.');
                setAllCourses([]);
                setLoading(false);
            } finally {
                setLoading(false);
            }

        };
    fetchCourses();
    }, []);

    const filteredCourses = useMemo(() => {
        let courses = [...allCourses];

        // Filter by searchTerm
        if (searchTerm) {
            courses = courses.filter(course =>
                course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.course_id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by studentsFilter
        if (studentsFilter.min !== null) {
            courses = courses.filter(course => course.enrollment_count >= studentsFilter.min);
        }
        if (studentsFilter.max !== null) {
            courses = courses.filter(course => course.enrollment_count <= studentsFilter.max);
        }

        // Filter by recommendedFilter
        if (recommendedFilter.min !== null) {
            courses = courses.filter(course => course.recommendation_count >= recommendedFilter.min);
        }
        if (recommendedFilter.max !== null) {
            courses = courses.filter(course => course.recommendation_count <= recommendedFilter.max);
        }

        // Sort by studentsSortOrder
        if (studentsSortOrder) {
            courses.sort((a, b) =>
                studentsSortOrder === 'asc' ? a.enrollment_count - b.enrollment_count : b.enrollment_count - a.enrollment_count
            );
        }

        // Sort by recommendedSortOrder
        if (recommendedSortOrder && !studentsSortOrder) {
            courses.sort((a, b) =>
                recommendedSortOrder === 'asc' ? a.recommendation_count - b.recommendation_count : b.recommendation_count - a.recommendation_count
            );
        }

        return courses;
    }, [searchTerm, studentsSortOrder, recommendedSortOrder, studentsFilter, recommendedFilter,allCourses]);

    return (
        <div style={styles.container}>
            <CRow className="align-items-center mb-3" style={{ '--bs-gutter-x': '0.25rem' }}>
                <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
                {/* <FilterButton /> */}
                <TotalCourses />
            </CRow>

            <RecommendedFieldsChart />

            <div style={styles.tableContainer}>
                <CTable responsive style={{ width: '100%', height: '100%' }}>
                    <CourseTableHeader
                        onStudentsFilterClick={handleStudentsFilterClick}
                        onRecommendedFilterClick={handleRecommendedFilterClick}
                        showStudentsDropdown={showStudentsDropdown}
                        showRecommendedDropdown={showRecommendedDropdown}
                        studentsSortOrder={studentsSortOrder}
                        recommendedSortOrder={recommendedSortOrder}
                        handleStudentsSortOrder={handleStudentsSortOrder}
                        handleRecommendedSortOrder={handleRecommendedSortOrder}
                        handleStudentsRangeFilter={handleStudentsRangeFilter}
                        handleRecommendedRangeFilter={handleRecommendedRangeFilter}
                        handleResetFilters={handleResetFilters}
                    />
                    <CTableBody>
                        {loading ? (
                            <CTableRow>
                                <CTableDataCell colSpan={6} style={{ textAlign: 'center', padding: '20px' }}> Loading Courses...</CTableDataCell>
                            </CTableRow>     
                        ):(
                        filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                                <CourseTableRow
                                    key={course.course_id}
                                    course={course}
                                    onRowClick={handleRowClick}
                                    onShowClick={handleShowClick}
                                />
                            ))
                        ) : (
                            <CTableRow>
                                <CTableDataCell colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                                    No courses found
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </div>

            {selectedCourse && (
                <div style={styles.popupOverlay} onClick={closePopup}>
                    <CourseDetailPopup course={selectedCourse} onClose={closePopup} />
                </div>
            )}
        </div>
    );
};

export default CourseManagement;