import React, { useState } from 'react';

const screenings = [
  { name: 'Hypertension', test: 'Blood Pressure Measurement', ageRange: [18, Infinity], frequency: 'Every 1-2 years' },
  { name: 'Tobacco Use', test: 'Smoking Cessation Counseling', ageRange: [18, Infinity], criteria: 'smoker', frequency: 'Ongoing counseling' },
  { name: 'Cervical Cancer', test: 'Pap Smear or HPV Test', ageRange: [21, 65], criteria: 'female', frequency: 'Pap every 3 years, HPV every 5 years (30-65)' },
  { name: 'Colorectal Cancer', test: 'Stool-Based Tests, Colonoscopy, Sigmoidoscopy', ageRange: [45, 75], frequency: 'Stool tests yearly, colonoscopy every 10 years' },
  { name: 'Type 2 Diabetes', test: 'Fasting Blood Glucose or A1c', ageRange: [35, 70], frequency: 'Every 3 years' },
  { name: 'Lipid Disorders', test: 'Cholesterol/Lipid Panel', ageRange: [40, 75], frequency: 'Every 5 years or based on risk' },
  { name: 'Breast Cancer', test: 'Mammogram', ageRange: [50, 74], criteria: 'female', frequency: 'Every 2 years' },
  { name: 'Lung Cancer', test: 'Low-Dose CT Scan', ageRange: [50, 80], criteria: 'smoker', frequency: 'Annually' },
  { name: 'Cardiovascular Disease', test: 'Stress test', ageRange: [50, 59], frequency: 'Individualized, based on physician advice' },
  { name: 'Abdominal Aortic Aneurysm', test: 'Ultrasonography', ageRange: [65, 75], criteria: 'male_smoker', frequency: 'One-time' },
];

const vaccines = [
  { name: 'Hepatitis B', ageRange: [0, Infinity], frequency: '3 doses over 6 months' },
  { name: 'Hepatitis A', ageRange: [1, Infinity], frequency: '2 doses, 6-12 months apart' },
  { name: 'MMR (Measles, Mumps, Rubella)', ageRange: [1, Infinity], frequency: '2 doses (first at 12-15 months, second at 4-6 years)' },
  { name: 'Varicella (Chickenpox)', ageRange: [1, Infinity], frequency: '2 doses (first at 12-15 months, second at 4-6 years)' },
  { name: 'Flu (Influenza)', ageRange: [0.5, Infinity], frequency: 'Annually during flu season' },
  { name: 'COVID-19', ageRange: [0.5, Infinity], frequency: 'Primary series + boosters as per CDC' },
  { name: 'HPV (Human Papillomavirus)', ageRange: [11, 26], frequency: '2-3 doses depending on age at initiation' },
  { name: 'Meningococcal (MenACWY)', ageRange: [11, 18], frequency: 'First dose at 11-12 years, booster at 16' },
  { name: 'Tdap (Tetanus, Diphtheria, Pertussis)', ageRange: [11, Infinity], frequency: 'Once, then Td booster every 10 years' },
  { name: 'Meningococcal B', ageRange: [16, 23], frequency: '2-3 doses depending on age at initiation' },
  { name: 'Zoster (Shingles)', ageRange: [50, Infinity], frequency: '2 doses, 2-6 months apart' },
  { name: 'Pneumococcal (PCV13, PPSV23)', ageRange: [65, Infinity], frequency: 'One-time dose for most adults (PCV13); revaccination after 5 years (PPSV23)' },
];

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Mock email service
const sendEmail = (to, subject, body) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Email sent to ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${body}`);
      resolve();
    }, 1000);
  });
};

const PreventiveScreeningHelper = () => {
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  const [smoker, setSmoker] = useState('');
  const [email, setEmail] = useState('');
  const [otherEmail, setOtherEmail] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const calculateAge = () => {
    if (!month || !day || !year) return null;
    const birthDate = new Date(`${month} ${day}, ${year}`);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateDueDate = (item) => {
    const today = new Date();
    let dueDate = new Date(today);

    switch (item.frequency) {
      case 'Annually':
        dueDate.setFullYear(today.getFullYear() + 1);
        break;
      case 'Every 2 years':
        dueDate.setFullYear(today.getFullYear() + 2);
        break;
      case 'Every 3 years':
        dueDate.setFullYear(today.getFullYear() + 3);
        break;
      case 'Every 5 years or based on risk':
        dueDate.setFullYear(today.getFullYear() + 5);
        break;
      default:
        dueDate.setMonth(today.getMonth() + 6);
    }

    return dueDate.toLocaleDateString();
  };

  const generateRecommendations = () => {
    const age = calculateAge();
    if (age === null) {
      alert('Please enter a valid date of birth');
      return;
    }

    const recommendedScreenings = screenings.filter(screening => {
      const [minAge, maxAge] = screening.ageRange;
      if (age >= minAge && age <= (maxAge === Infinity ? age : maxAge)) {
        if (screening.criteria) {
          if (screening.criteria === 'female' && gender === 'female') return true;
          if (screening.criteria === 'smoker' && smoker === 'yes') return true;
          if (screening.criteria === 'male_smoker' && gender === 'male' && smoker === 'yes') return true;
          return false;
        }
        return true;
      }
      return false;
    });

    const recommendedVaccines = vaccines.filter(vaccine => {
      const [minAge, maxAge] = vaccine.ageRange;
      return age >= minAge && age <= (maxAge === Infinity ? age : maxAge);
    });

    const allRecommendations = [...recommendedScreenings, ...recommendedVaccines].map(item => ({
      ...item,
      dueDate: calculateDueDate(item)
    }));

    allRecommendations.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    setRecommendations(allRecommendations);
  };

  const handleNotify = async (emailToNotify) => {
    const emailSubject = 'Your Preventive Screening Recommendations';
    const emailBody = `
      Preventive Screening Recommendations:
      
      Up next:
      ${recommendations.slice(0, 3).map(item => 
        `- ${item.name}: ${item.test || 'Vaccine'}
         Due date: ${item.dueDate}
         Frequency: ${item.frequency}`
      ).join('\n\n')}

      In the future:
      ${recommendations.slice(3).map(item => 
        `- ${item.name}: ${item.test || 'Vaccine'}
         Due date: ${item.dueDate}
         Frequency: ${item.frequency}`
      ).join('\n\n')}
    `;

    try {
      await sendEmail(emailToNotify, emailSubject, emailBody);
      alert(`Email sent successfully to ${emailToNotify}`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again later.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Recursive Health</h1>
        <h2 className="text-2xl font-semibold text-black">Preventive Screening Helper</h2>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Date of Birth:</label>
        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border border-gray-300 p-2 rounded w-1/3"
          >
            <option value="">Month</option>
            {months.map((m, index) => (
              <option key={index} value={m}>{m}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Day"
            min="1"
            max="31"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="border border-gray-300 p-2 rounded w-1/3"
          />
          <input
            type="number"
            placeholder="Year"
            min="1900"
            max={new Date().getFullYear()}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-gray-300 p-2 rounded w-1/3"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Gender:</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Smoker:</label>
        <select
          value={smoker}
          onChange={(e) => setSmoker(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded"
        >
          <option value="">Select Smoker Status</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <button
        onClick={generateRecommendations}
        className="bg-blue-500 text-white p-2 rounded mb-4 w-full hover:bg-blue-600 transition"
      >
        Generate Recommendations
      </button>
      {recommendations.length > 0 && (
        <>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Your Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <button
            onClick={() => handleNotify(email)}
            className="bg-blue-500 text-white p-2 rounded mb-4 w-full hover:bg-blue-600 transition"
          >
            Email me my recommendations
          </button>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Remind Someone Else (Email):</label>
            <input
              type="email"
              value={otherEmail}
              onChange={(e) => setOtherEmail(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <button
            onClick={() => handleNotify(otherEmail)}
            className="bg-black text-white p-2 rounded mb-4 w-full hover:bg-gray-800 transition"
          >
            Email recommendations to someone else
          </button>
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-500">Up next:</h2>
            <ul className="space-y-4 mb-6">
              {recommendations.slice(0, 3).map((item, index) => (
                <li key={index} className="border-b pb-2">
                  <strong className="text-lg">{item.name}</strong> - {item.test || 'Vaccine'}
                  <br />
                  <span className="text-sm text-gray-600">
                    Due date: {item.dueDate}
                    <br />
                    Frequency: {item.frequency}
                  </span>
                </li>
              ))}
            </ul>
            <h2 className="text-xl font-bold mb-4 text-blue-500">In the future:</h2>
            <ul className="space-y-4">
              {recommendations.slice(3).map((item, index) => (
                <li key={index} className="border-b pb-2">
                  <strong className="text-lg">{item.name}</strong> - {item.test || 'Vaccine'}
                  <br />
                  <span className="text-sm text-gray-600">
                    Due date: {item.dueDate}
                    <br />
                    Frequency: {item.frequency}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default PreventiveScreeningHelper;
