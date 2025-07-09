import React, { useState, useEffect, useMemo } from 'react';
import {
    CButton, CCol, CCloseButton, CFormInput, CInputGroup, CRow,
    CTable, CTableBody, CTableDataCell, CTableHead,
    CTableHeaderCell, CTableRow
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilFilter, cilMagnifyingGlass } from '@coreui/icons';

// Constants
const USERS_DATA = [
    { id: 'U_100090', name: 'Sun Mei', gender: 'Male', courses: 5 },
    { id: 'U_2765', name: 'Xu Gang', gender: 'Male', courses: 7 },
    { id: 'U_7866', name: 'Wu Xiaoli', gender: 'Male', courses: 9 },
    { id: 'U_10043', name: 'Huang Lei', gender: 'Male', courses: 6 },
    { id: 'U_37587', name: 'Zhao Jing', gender: 'Female', courses: 6 },
    { id: 'U_38569', name: 'Chen Hao', gender: 'Male', courses: 9 },
    { id: 'U_44446', name: 'Liu Yang', gender: 'Male', courses: 7 },
    { id: 'U_89763', name: 'Li Wei', gender: 'Male', courses: 8 },
    { id: 'U_20478', name: 'Song Li', gender: 'Other', courses: 5 },
    { id: 'U_12475', name: 'Jiang Lei', gender: 'Male', courses: 5 },
    { id: 'U_88885', name: 'Cao Yu', gender: 'Male', courses: 6 },
    { id: 'U_88889', name: 'Deng Feng', gender: 'Male', courses: 5 },
    { id: 'U_46464', name: 'He Jun', gender: 'Female', courses: 8 },
    { id: 'U_99996', name: 'Lin Wei', gender: 'Male', courses: 10 },
    { id: 'U_72632', name: 'Guo Yan', gender: 'Female', courses: 11 },
    { id: 'U_65573', name: 'Zhou Jie', gender: 'Male', courses: 5 },
];

const RECENT_COURSES_DATA = [
    { id: 1, code: 'C_707038', title: 'data mining: theory and algorithm', date: '09/09/2019' },
    { id: 2, code: 'C_674910', title: 'software theory basics', date: '10/08/2019' },
    { id: 3, code: 'C_682129', title: 'pattern aesthetics and creation', date: '01/07/2019' },
    { id: 4, code: 'C_597208', title: 'organic chemistry', date: '20/04/2019' },
    { id: 5, code: 'C_597314', title: 'english talk about the new silk road on the sea', date: '10/02/2019' },
];

const RECOMMENDATION_COURSES_DATA = [
    {
        id: 1,
        code: 'C_758221',
        title: 'advanced data visualization with seaborn',
        school: 'tsinghua university',
        about: 'a comprehensive course designed to help you master professional-level data visualization techniques using Python\'s Seaborn library. You\'ll learn to create stunning, insightful plots for complex datasets, customize aesthetics, and apply advanced statistical visualizations. Perfect for data analysts and scientists looking to enhance their storytelling with data. Elevate your skills and turn raw data into compelling visual narratives'
    },
    {
        id: 2,
        code: 'C_808654',
        title: 'deep learning for real-world applications',
        school: 'tsinghua university',
        about: 'This course dives into practical deep learning techniques for real-world applications. You\'ll explore neural networks, CNNs, RNNs, and transformers while working on industry-relevant projects like image recognition, NLP, and predictive modeling. Gain hands-on experience with TensorFlow/PyTorch and learn to deploy models effectively. Ideal for aspiring AI engineers and data scientists ready to bridge theory and practice.'
    },
    {
        id: 3,
        code: 'C_735214',
        title: 'reinforcement learning: from basics to bandits',
        school: 'tsinghua university',
        about: 'This course introduces reinforcement learning, starting with core concepts and advancing to multi-armed bandits. Learn key algorithms, explore exploration-exploitation tradeoffs, and apply techniques to real-world decision-making problems. Perfect for beginners eager to dive into RL fundamentals.'
    },
    {
        id: 4,
        code: 'C_879040',
        title: 'modern frontend development with react',
        school: 'southeast university',
        about: 'This course teaches modern frontend development using React. Master components, hooks, state management, and responsive design to build fast, scalable web apps. Gain hands-on experience with real-world projects and best practices.'
    },
    {
        id: 5,
        code: 'C_681655',
        title: 'introduction to neural network architectures',
        school: 'tsinghua university',
        about: 'This course explores fundamental neural network architectures, from simple perceptrons to CNNs and RNNs. Learn how they work, their applications, and gain hands-on experience building basic models. Perfect for beginners starting their AI journey.'
    },
    {
        id: 6,
        code: 'C_697265',
        title: 'secure coding principles for web developers',
        school: 'beijing forestry university',
        about: 'This course teaches essential secure coding practices for web development. Learn to prevent common vulnerabilities (SQLI, XSS, CSRF) and implement security best practices in your code. Build robust applications while protecting user data from modern threats.'
    },
    {
        id: 7,
        code: 'C_1025064',
        title: 'mathematical foundations of machine learning',
        school: 'southeast university',
        about: 'This course covers the essential math behind machine learning, including linear algebra, calculus, probability, and optimization. Master the core concepts needed to understand and develop ML algorithms effectively.'
    },
    {
        id: 8,
        code: 'C_697288',
        title: 'ux research and design fundamentals',
        school: 'southeast university',
        about: 'This course introduces UX research and design fundamentals. Learn user-centered design principles, conduct effective research, and create intuitive interfaces. Gain hands-on experience with wireframing, prototyping, and usability testing.'
    },
    {
        id: 9,
        code: 'C_707456',
        title: 'advanced object-oriented programming in java',
        school: 'beijing forestry university',
        about: 'This course dives deep into advanced OOP concepts in Java, including design patterns, SOLID principles, and efficient memory management. Build robust, scalable applications while mastering inheritance, polymorphism, and encapsulation at an expert level.'
    },
    {
        id: 10,
        code: 'C_936973',
        title: 'introduction to chinese legal system',
        school: 'beijing forestry university',
        about: 'This course provides a foundational understanding of China\'s legal system, covering its structure, key laws, and unique characteristics. Explore topics like civil law, business regulations, and the role of the Communist Party within legal frameworks.'
    }
];

// Styles
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
    totalStudents: {
        fontSize: 16,
        fontWeight: 600,
        color: '#FFFFFF',
        background: 'rgb(199, 91, 122)',
        border: '0.3px solid rgba(0, 0, 0, 0.8)',
        borderRadius: '4px',
        marginRight: '12px'
    },
    tableContainer: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #828282',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: '16px',
        overflowY: 'auto',
        minHeight: '500px',
        maxHeight: 'calc(100vh - 12px)',
    },
    tableHeader: {
        height: '45px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        position: 'sticky',
        top: 0,
        zIndex: 1
    },
    tableRow: {
        cursor: 'pointer',
        boxSizing: 'border-box',
        height: '56px',
        borderTop: '1px solid rgba(0, 0, 0, 0.4)'
    },
    recommendButton: {
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
    userDetailPopup: {
        position: 'relative',
        width: '800px',
        height: '627px',
        background: 'rgb(244, 217, 208)',
        borderRadius: '8px',
        overflowY: 'auto', // Thêm dòng này để có thanh cuộn dọc
        overflowX: 'hidden', // Thêm dòng này để ẩn thanh cuộn ngang
    },
    recommendPopup: {
        background: 'rgb(244, 217, 208)',
        width: '680px',
        height: '90vh',
        borderRadius: '8px',
        position: 'relative',
        overflowY: 'auto',
    },
    filterContainer: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '0 8px'
    },
    filterIcon: {
        marginLeft: '4px'
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
        fontSize: '13px',
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

const TotalStudents = () => (
    <CCol xs="auto" className="text-end" style={styles.totalStudents}>
        Total students: 24.068
    </CCol>
);

const UserTableHeader = ({ onGenderFilterClick, onCoursesFilterClick, showGenderDropdown, showCoursesDropdown, genderFilterOptions, sortOrder, handleSortOrder, handleGenderFilter, handleCourseRangeFilter, handleResetFilters }) => {
    const headerStyle = {
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: '16px',
        lineHeight: '150%',
        color: '#000000'
    };

    const [minCourses, setMinCourses] = useState('');
    const [maxCourses, setMaxCourses] = useState('');

    const handleRangeSubmit = (e) => {
        if (e.key === 'Enter') {
            let min = parseInt(minCourses, 10);
            let max = parseInt(maxCourses, 10);
            if (isNaN(min) || min < 0) min = null;
            if (isNaN(max) || max < 0) max = null;
            if (min !== null && max !== null && min > max) [min, max] = [max, min];
            handleCourseRangeFilter({ min, max });
            setMinCourses('');
            setMaxCourses('');
        }
    };

    const handleInputClick = (e) => {
        e.stopPropagation();
    };

    return (
        <CTableHead style={styles.tableHeader}>
            <CTableRow>
                <CTableHeaderCell style={{ ...headerStyle, width: '115px' }}>User ID</CTableHeaderCell>
                <CTableHeaderCell style={{ ...headerStyle, width: '122px' }}>Avatar</CTableHeaderCell>
                <CTableHeaderCell style={{ ...headerStyle, width: '58px' }}>Name</CTableHeaderCell>
                <CTableHeaderCell style={{ ...headerStyle, width: '87px', paddingLeft: '0px', position: 'relative', }}>
                    <div className="filter-container" style={styles.filterContainer} onClick={onGenderFilterClick}>
                        Gender
                        <CIcon icon={cilFilter} style={styles.filterIcon} />
                    </div>
                    {showGenderDropdown && (
                        <div className="dropdown" style={styles.dropdown}>
                            <button
                                style={styles.dropdownButton}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.dropdownButtonHover.backgroundColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => handleResetFilters('gender')}
                            >
                                All
                            </button>
                            {genderFilterOptions.map(option => (
                                <button
                                    key={option}
                                    style={styles.dropdownButton}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.dropdownButtonHover.backgroundColor}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    onClick={() => handleGenderFilter(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </CTableHeaderCell>
                <CTableHeaderCell style={{ ...headerStyle, width: '180px', textAlign: 'center', position: 'relative' }}>
                    <div className="filter-container" style={styles.filterContainer} onClick={onCoursesFilterClick}>
                        Total course enrolled
                        <CIcon icon={cilFilter} style={styles.filterIcon} />
                    </div>
                    {showCoursesDropdown && (
                        <div className="dropdown" style={styles.dropdown}>
                            <button
                                style={styles.dropdownButton}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.dropdownButtonHover.backgroundColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => handleResetFilters('courses')}
                            >
                                All
                            </button>
                            <button
                                style={styles.dropdownButton}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.dropdownButtonHover.backgroundColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => handleSortOrder('asc')}
                            >
                                Sort Ascending
                            </button>
                            <button
                                style={styles.dropdownButton}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.dropdownButtonHover.backgroundColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => handleSortOrder('desc')}
                            >
                                Sort Descending
                            </button>
                            <div style={styles.rangeFilterContainer}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={styles.rangeLabel}>Min:</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={minCourses}
                                        onChange={(e) => setMinCourses(e.target.value)}
                                        onKeyDown={handleRangeSubmit}
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
                                        value={maxCourses}
                                        onChange={(e) => setMaxCourses(e.target.value)}
                                        onKeyDown={handleRangeSubmit}
                                        onClick={handleInputClick}
                                        style={styles.rangeInput}
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </CTableHeaderCell>
                <CTableHeaderCell style={{ ...headerStyle, width: '108px', textAlign: 'center' }}>Recommend</CTableHeaderCell>
            </CTableRow>
        </CTableHead>
    );
};

const UserTableRow = ({ user, onRowClick, onRecommendClick }) => {
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

    const handleRecommendHover = (e, isHover) => {
        e.currentTarget.style.backgroundColor = isHover
            ? 'rgba(224, 100, 105, 0.8)'
            : 'rgba(224, 100, 105, 1)';
    };


    return (
        <CTableRow
            onClick={() => onRowClick(user)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={styles.tableRow}
        >
            <CTableDataCell style={{ ...firstCellStyle, width: '70px' }}>{user.user_id}</CTableDataCell>
            <CTableDataCell style={{ width: '45px' }}>
                <img
                    src="/public/logo_edupath_remove_bg.png"
                    alt={`Avatar for ${user.user_name}`}
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
            </CTableDataCell>
            <CTableDataCell style={{ ...cellStyle, width: '175px' }}>{user.user_name}</CTableDataCell>
            <CTableDataCell style={{ ...cellStyle, width: '86px' }}>{user.user_gender}</CTableDataCell>
            <CTableDataCell style={{ ...cellStyle, width: '98px', fontWeight: 700, textAlign: 'center' }}>{user.enrollment_count}</CTableDataCell>
            <CTableDataCell style={{ width: '80px', textAlign: 'center' }}>
                <CButton
                    color="success"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onRecommendClick(user.user_id); }}
                    onMouseEnter={(e) => handleRecommendHover(e, true)}
                    onMouseLeave={(e) => handleRecommendHover(e, false)}
                    style={styles.recommendButton}
                >
                    Show
                </CButton>
            </CTableDataCell>
        </CTableRow>
    );
};

const CourseTable = ({ courses, loading }) => {
    const tableStyle = {
        display: 'flex',
        flexDirection: 'column',
        width: '750px',
        minHeight: '232px',
        background: '#FFFFFF',
        border: '1px solid #5B5B5B',
        borderRadius: '4px',
        position: 'absolute',
        left: '25px',
        top: '278px',
    };

    const headerCellStyle = {
        fontFamily: 'Inter',
        fontWeight: 600,
        fontSize: '13px',
        lineHeight: '130%',
        color: '#000000',
        padding: '10px 12px',
        borderRight: '1px solid #5B5B5B',
        borderBottom: '1px solid #5B5B5B',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    };

    const dataCellStyle = {
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: '13px',
        lineHeight: '130%',
        color: '#000000',
        padding: '10px 12px',
        borderRight: '1px solid #5B5B5B',
        borderBottom: '1px solid #5B5B5B',
        backgroundColor: 'rgba(255, 255, 255, 0.002)',
    };

    return (
    <div style={tableStyle}>
        <div style={{ display: 'flex' }}>
        <div style={{ ...headerCellStyle, width: '120px' }}>Course_id</div>
        <div style={{ ...headerCellStyle, width: '180px' }}>Course Name</div>
        <div style={{ ...headerCellStyle, width: '380px' }}>Course About</div>
        <div style={{ ...headerCellStyle, width: '120px', borderRight: 'none' }}>Enroll Date</div>
        </div>

        <div>
        {loading ? (
            <div style={{ padding: '16px', textAlign: 'center' }}>Loading courses...</div>
        ) : courses.length === 0 ? (
            <div style={{ ...dataCellStyle, textAlign: 'center', width: '100%' }}>
            No courses found
            </div>
        ) : (
            courses.map((course) => (
            <div key={course.course_id} style={{ display: 'flex' }}>
                <div style={{ ...dataCellStyle, width: '120px' }}>{course.course_id}</div>
                <div style={{ ...dataCellStyle, width: '180px' }}>
                {/* {course.course_name?.length > 30
                    ? `${course.course_name.slice(0, 30)}...`   
                    : course.course_name} */course.course_name}
                
                </div>
                <div style={{ ...dataCellStyle, width: '380px' }}>
                {/* {course.course_about?.length > 70
                    ? `${course.course_about.slice(0, 70)}...`
                    : course.course_about} */course.course_about}
                </div>
                <div style={{ ...dataCellStyle, width: '120px', borderRight: 'none' }}>{course.enroll_time}</div>
            </div>
            ))
        )}
        </div>
    </div>
    );
}

const UserDetailPopup = ({ user, courses, onClose ,loading }) => {
    const labelStyle = {
        fontFamily: 'Inter',
        fontWeight: 600,
        fontSize: '16px',
        lineHeight: '150%',
        color: '#000000',
        position: 'absolute',
        width: '183px',
        height: '28px',
        left: '28px',
        display: 'flex',
        alignItems: 'center',
    };

    const valueStyle = {
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '150%',
        color: '#000000',
        position: 'absolute',
        width: '138px',
        height: '28px',
        left: '232px',
        display: 'flex',
        alignItems: 'center',
    };

    return (
        <div style={styles.userDetailPopup} onClick={(e) => e.stopPropagation()}>
            <div style={{
                position: 'absolute',
                width: '164px',
                height: '41px',
                left: 'calc(50% - 164px/2)',
                top: '9px',
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '150%',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                color: '#000000',
            }}>
                USER DETAILS
            </div>

            <div style={{ ...labelStyle, top: '61px' }}>User ID:</div>
            <div style={{ ...valueStyle, top: '61px' }}>{user.user_id}</div>

            <div style={{ ...labelStyle, top: '106px' }}>User name:</div>
            <div style={{ ...valueStyle, top: '106px' }}>{user.user_name}</div>

            <div style={{ ...labelStyle, top: '151px' }}>User gender:</div>
            <div style={{ ...valueStyle, top: '151px' }}>{user.user_gender}</div>

            <div style={{ ...labelStyle, top: '196px' }}>Total course enrolled:</div>
            <div style={{ ...valueStyle, top: '196px' }}>{user.enrollment_count}</div>

            <div style={{ ...labelStyle, top: '241px' }}>5 most recent courses:</div>

            <CourseTable courses={courses} loading={loading} />

            <div style={{
                position: 'absolute',
                width: '45px',
                height: '45px',
                right: '15px',
                top: '9px',
                borderRadius: '8px',
            }}>
                <CCloseButton
                    style={{
                        position: 'absolute',
                        width: '30px',
                        height: '30px',
                        left: '9px',
                    }}
                    onClick={onClose}
                />
            </div>
        </div>
    );
};

const RecommendPopup = ({ userId, users, courses, onClose ,loading}) => {
    const user = users.find(u => u.user_id === userId) || {};
    const [recommendCourses, setRecommendCourses] = useState([]);
    const [isRecommendLoading, setIsRecommendLoading] = useState(false);

    const fetchRecommendations = async () => {
        setIsRecommendLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/user/${userId}/recommendation`);
            if (!response.ok) throw new Error('Không thể tải danh sách khóa học khuyến nghị');
            const json = await response.json();
            // Giả sử API trả về mảng khóa học trong json.data
            setRecommendCourses(json.data || []);
        } catch (error) {
            console.error('Lỗi khi tải khóa học khuyến nghị:', error);
            alert('Không thể tải danh sách khóa học khuyến nghị. Vui lòng thử lại sau.');
            setRecommendCourses([]);
        } finally {
            setIsRecommendLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchRecommendations();
        }
    }, [userId]);

    const headerStyle = {
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: '16px',
        lineHeight: '150%',
        color: '#000000',
        textAlign: 'center',
        marginBottom: '20px'
    };

    const sectionTitleStyle = {
        fontFamily: 'Inter',
        fontWeight: 600,
        fontSize: '14px',
        lineHeight: '150%',
        color: '#000000',
        marginBottom: '10px',
        marginTop: '20px'
    };

    const tableStyle = {
        width: '100%',
        border: '1px solid #5B5B5B',
        borderRadius: '4px',
        backgroundColor: '#FFFFFF',
        marginBottom: '20px'
    };

    const headerCellStyle = {
        fontFamily: 'Inter',
        fontWeight: 600,
        fontSize: '13px',
        lineHeight: '130%',
        color: '#000000',
        padding: '8px',
        borderBottom: '1px solid #5B5B5B',
        borderRight: '1px solid #5B5B5B',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        textAlign: 'center'
    };

    const dataCellStyle = {
        fontFamily: 'Inter',
        fontWeight: 400,
        fontSize: '13px',
        lineHeight: '130%',
        color: '#000000',
        padding: '8px',
        borderBottom: '1px solid #5B5B5B',
        borderRight: '1px solid #5B5B5B',
        backgroundColor: 'rgba(255, 255, 255, 0.002)',
        verticalAlign: 'top'
    };

    return (
        <div style={styles.recommendPopup} onClick={(e) => e.stopPropagation()}>
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                zIndex: 10
            }}>
                <CCloseButton onClick={onClose} />
            </div>

            <div style={{
                ...headerStyle,
                marginTop: '15px',
                marginBottom: '10px'
            }}>
                RECOMMENDATIONS FOR USER
            </div>

            <div style={{ padding: '0 20px' }}>
                <div style={{
                    display: 'flex',
                    marginBottom: '5px'
                }}>
                    <span style={{
                        fontFamily: 'Inter',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#000000',
                        width: '100px'
                    }}>User ID:</span>
                    <span style={{
                        fontFamily: 'Inter',
                        fontWeight: 400,
                        fontSize: '14px',
                        color: '#000000'
                    }}>{user.user_id}</span>
                </div>

                <div style={{
                    display: 'flex',
                    marginBottom: '15px'
                }}>
                    <span style={{
                        fontFamily: 'Inter',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#000000',
                        width: '100px'
                    }}>User name:</span>
                    <span style={{
                        fontFamily: 'Inter',
                        fontWeight: 400,
                        fontSize: '14px',
                        color: '#000000'
                    }}>{user.user_name}</span>
                </div>

                <div style={sectionTitleStyle}>5 most recent courses:</div>

                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={{ ...headerCellStyle, width: '8%' }}>No.</th>
                            <th style={{ ...headerCellStyle, width: '20%' }}>Course ID</th>
                            <th style={{ ...headerCellStyle, width: '52%' }}>Course Name</th>
                            <th style={{ ...headerCellStyle, width: '20%', borderRight: 'none' }}>Enroll Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr style={{ padding: '16px', textAlign: 'center' }}>
                                <td>Loading courses...</td></tr>
                        ) : courses.length === 0 ? (
                            <tr style={{ ...dataCellStyle, textAlign: 'center', width: '100%' }}>
                            <td>No courses found</td>
                            </tr>
                        ) : (
                        courses.map((course,index) => (
                            <tr key={course.id}>
                                <td style={{ ...dataCellStyle, textAlign: 'center' }}>{index + 1}</td>
                                <td style={dataCellStyle}>{course.course_id}</td>
                                <td style={dataCellStyle}>{course.course_name}</td>
                                <td style={{ ...dataCellStyle, borderRight: 'none' }}>{course.enroll_time}</td>
                            </tr>
                        )))}
                    </tbody>
                </table>

                <div style={sectionTitleStyle}>Recommendation courses:</div>

                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={{ ...headerCellStyle, width: '6%' }}>No.</th>
                            <th style={{ ...headerCellStyle, width: '15%' }}>Course ID</th>
                            <th style={{ ...headerCellStyle, width: '22%' }}>Course name</th>
                            <th style={{ ...headerCellStyle, width: '18%' }}>School</th>
                            <th style={{ ...headerCellStyle, width: '39%', borderRight: 'none' }}>About</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isRecommendLoading ? (
                            <tr>
                                <td colSpan={5} style={{ ...dataCellStyle, textAlign: 'center' }}>
                                    Recommedations is loading...
                                </td>
                            </tr>
                        ) : recommendCourses.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ ...dataCellStyle, textAlign: 'center' }}>
                                    No recommendations found
                                </td>
                            </tr>
                        ) : (
                            recommendCourses.map((course, index) => (
                                <tr key={course.id || index}>
                                    <td style={{ ...dataCellStyle, textAlign: 'center' }}>{index + 1}</td>
                                    <td style={dataCellStyle}>{course.course_id}</td>
                                    <td style={dataCellStyle}>{course.course_name}</td>
                                    <td style={dataCellStyle}>
                                    {Array.isArray(course.school_name)
                                        ? course.school_name.join(', ')
                                        : course.school_name}
                                    </td>
                                    <td style={{ ...dataCellStyle, borderRight: 'none' }}>{course.course_about}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Main Component
const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userCourses, setUserCourses] = useState([])

    const [recommendPopup, setRecommendPopup] = useState(null);
    const [genderFilter, setGenderFilter] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [courseFilter, setCourseFilter] = useState({ min: null, max: null });
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [isUserLoading, setIsUserLoading] = useState(false);
    const genderFilterOptions = ['Male', 'Female', 'Other'];



    
    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const courseCache = new Map();

    const fetchCourses = async (userId) => {
        if (courseCache.has(userId)) {
            return courseCache.get(userId);
        }
        setIsLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/user/${userId}/course`);
            if (!response.ok) throw new Error('Không thể tải danh sách khóa học');
            const json = await response.json();
            const topCourses = json.data.slice(-5).reverse();
            courseCache.set(userId, topCourses);
            return topCourses;
        } catch (error) {
            console.error('Lỗi khi tải khóa học:', error);
            alert('Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const handleRowClick = async (user) => {
        setSelectedUser(user);
        const courses = await fetchCourses(user.user_id);
        setUserCourses(courses);
    };

    const handleRecommendClick = async (user) => {

        
        setRecommendPopup(user);
        // setSelectedUser(user);
        const courses = await fetchCourses(user);
        setUserCourses(courses);


    };
    const closePopup = () => {
        setSelectedUser(null);
        setRecommendPopup(null);
        setUserCourses([]);
    };

    const handleGenderFilterClick = (e) => {
        e.stopPropagation();
        setShowGenderDropdown(prev => !prev);
        setShowCoursesDropdown(false);
    };

    const handleCoursesFilterClick = (e) => {
        e.stopPropagation();
        setShowCoursesDropdown(prev => !prev);
        setShowGenderDropdown(false);
    };

    const handleGenderFilter = (gender) => {
        setGenderFilter(gender);
        setShowGenderDropdown(false);
    };

    const handleSortOrder = (order) => {
        setSortOrder(order);
        setShowCoursesDropdown(false);
    };

    const handleCourseRangeFilter = ({ min, max }) => {
        setCourseFilter({ min, max });
        setShowCoursesDropdown(false);
    };

    const handleResetFilters = (type) => {
        if (type === 'gender') {
            setGenderFilter(null);
            setShowGenderDropdown(false);
        } else if (type === 'courses') {
            setSortOrder(null);
            setCourseFilter({ min: null, max: null });
            setShowCoursesDropdown(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.filter-container') && !e.target.closest('.dropdown')) {
                setShowGenderDropdown(false);
                setShowCoursesDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
    const fetchUsers = async () => {
        setIsUserLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/user/");
            const json = await response.json();
            setAllUsers(json.data || []);
            console.log("Fetched users:", json.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            setAllUsers([]);
        } finally {
            setIsUserLoading(false);
        }
    };

    fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        let users = [...allUsers];
        
        // Filter by searchTerm
        if (searchTerm) {
            users = users.filter(user =>
                user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by genderFilter
        if (genderFilter) {
            users = users.filter(user => user.user_gender === genderFilter);
        }

        // Filter by courseFilter
        if (courseFilter.min !== null) {
            users = users.filter(user => user.enrollment_count >= courseFilter.min);
        }
        if (courseFilter.max !== null) {
            users = users.filter(user => user.enrollment_count <= courseFilter.max);
        }

        // Sort by sortOrder
        if (sortOrder) {
            users.sort((a, b) =>
                sortOrder === 'asc' ? a.enrollment_count - b.enrollment_count : b.enrollment_count - a.enrollment_count
            );
        }

        return users;
    }, [searchTerm, genderFilter, sortOrder, courseFilter,allUsers]);

    return (
        <div style={styles.container}>
            <CRow className="align-items-center mb-3" style={{ '--bs-gutter-x': '0.25rem' }}>
                <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
                {/* <FilterButton /> */}
                <TotalStudents />
            </CRow>

            <div style={styles.tableContainer}>
                <CTable responsive style={{ width: '100%', height: '100%' }}>
                    <UserTableHeader
                        onGenderFilterClick={handleGenderFilterClick}
                        onCoursesFilterClick={handleCoursesFilterClick}
                        showGenderDropdown={showGenderDropdown}
                        showCoursesDropdown={showCoursesDropdown}
                        genderFilterOptions={genderFilterOptions}
                        sortOrder={sortOrder}
                        handleSortOrder={handleSortOrder}
                        handleGenderFilter={handleGenderFilter}
                        handleCourseRangeFilter={handleCourseRangeFilter}
                        handleResetFilters={handleResetFilters}
                    />
                    <CTableBody>
                        {isUserLoading ? (
                            <CTableRow>
                                <CTableDataCell colSpan={6}>Loading users...</CTableDataCell>
                            </CTableRow>
                        ) : (
                        allUsers.length === 0 ? (
                            <CTableRow>
                                <CTableDataCell colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                                    No users found
                                </CTableDataCell>
                            </CTableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <UserTableRow
                                    key={user.user_id}
                                    user={user}
                                    onRowClick={handleRowClick}
                                    onRecommendClick={handleRecommendClick}
                                />
                            ))
                        ))}
                    </CTableBody>
                </CTable>
            </div>

            {selectedUser && (
                <div style={styles.popupOverlay} onClick={closePopup}>
                    <UserDetailPopup user={selectedUser} courses={userCourses} onClose={closePopup} loading={isLoading} />
                </div>
            )}

            {recommendPopup && (
                <div style={styles.popupOverlay} onClick={closePopup}>
                    <RecommendPopup
                        userId={recommendPopup}
                        users={allUsers}
                        courses={userCourses}
                        onClose={closePopup}
                        loading={isLoading}
                    />
                </div>
            )}
        </div>
    );
};

export default UserManagement;