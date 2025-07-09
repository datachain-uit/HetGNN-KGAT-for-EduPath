import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Header = () => {
  return (
    <div className="overview-container">
      <h2 className="title-overview">OVERVIEW DATASET</h2>
    </div>
  )
}

// function Header() {
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     // Thay đổi URL nếu cần
//     axios.get('http://localhost:8000/api/hello/')
//       .then(response => {
//         setMessage(response.data.message);
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);

//   return (
//     <div>
//       <h1>React Frontend</h1>
//       <p>Message from Django: {message}</p>
//     </div>
//   );
// }

export default Header
