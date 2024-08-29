import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';

const App = () => {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);

  // Load users from a CSV file on component mount
  React.useEffect(() => {
    fetch('/participants.csv') // Make sure your CSV file is in the public folder
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          complete: (result) => {
            setUsers(result.data.map((row) => row[0].toLowerCase())); // Assuming names are in the first column
          }
        });
      });
  }, []);

  const handleDownload = () => {
    const userName = name.trim().toLowerCase();

    if (users.includes(userName)) {
      const img = new Image();
      img.src = '/certificate_template.png';

      img.onload = () => {
        const doc = new jsPDF('landscape', 'px', 'a4');
        doc.addImage(img, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
        doc.text(name, 250, 250);
        doc.save(`${name}-certificate.pdf`);
      };
    } else {
      alert('Name not found in the records.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Certificate Generator</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        style={{ padding: '10px', width: '300px' }}
      />
      <button onClick={handleDownload} style={{ padding: '10px 20px', marginLeft: '20px' }}>
        Generate Certificate
      </button>
    </div>
  );
};

export default App;
