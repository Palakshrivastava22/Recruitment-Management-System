document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      alert('Login successful');
    } else {
      alert('Login failed');
    }
  });
  
  document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/students', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: document.getElementById('name').value,
        enrollment: document.getElementById('enrollment').value,
        contact: document.getElementById('contact').value,
        email: document.getElementById('studentEmail').value,
        gender: document.getElementById('gender').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        tenth_marks: document.getElementById('tenthMarks').value,
        twelfth_marks: document.getElementById('twelfthMarks').value
      })
    });
  
    if (response.ok) {
      alert('Student added');
    } else {
      alert('Failed to add student');
    }
  });
  
  document.getElementById('addDriveForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/placement-drives', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        company_name: document.getElementById('companyName').value,
        job_role: document.getElementById('jobRole').value,
        eligibility_criteria: document.getElementById('eligibilityCriteria').value,
        date: document.getElementById('date').value
      })
    });
  
    if (response.ok) {
      alert('Placement drive added');
    } else {
      alert('Failed to add placement drive');
    }
  });
  