import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- 1. Import Hook

// --- TATA CHEMICALS BRANDED DATA ---
const masterData = {
  equipments: [
    { id: "eq_01", name: "L-1 Conveyor", location: "Old Coal Plant" },
    { id: "eq_02", name: "Vibrofeeder -1", location: "Old Coal Plant" },
    { id: "eq_03", name: "Vibrofeeder-2", location: "Old Coal Plant" },
    { id: "eq_04", name: "Crusher -1", location: "Old Coal Plant" },
    { id: "eq_05", name: "Crusher -2", location: "Old Coal Plant" },
    { id: "eq_06", name: "B2-Conveyor", location: "Old Coal Plant" },
    { id: "eq_07", name: "P-1 Conveyor", location: "New Coal Plant" },
    { id: "eq_08", name: "Vibrator -1", location: "New Coal Plant" },
    { id: "eq_09", name: "Vibrator -2", location: "New Coal Plant" },
    { id: "eq_10", name: "Crusher -1", location: "New Coal Plant" },
    { id: "eq_11", name: "Crusher -2", location: "New Coal Plant" },
    { id: "eq_12", name: "Vibrator-3", location: "New Coal Plant" },
    { id: "eq_13", name: "Vibrator -4", location: "New Coal Plant" },
    { id: "eq_14", name: "P2- Conveyor", location: "New Coal Plant" },
    { id: "eq_15", name: "R1- Conveyor", location: "New Coal Plant" },
    { id: "eq_16", name: "R2- Conveyor", location: "New Coal Plant" },
  ],
  checklistSpecs: [
    { id: "sp_01", label: "Abnormal Sound" },
    { id: "sp_02", label: "Guard all" },
    { id: "sp_03", label: "Condition of Gear box" },
    { id: "sp_04", label: "V belt/ chain/coupling condition" },
    { id: "sp_05", label: "Vibration" },
    { id: "sp_06", label: "Bearing/Temp/Abnormality" },
    { id: "sp_07", label: "Base plate J bolt" },
    { id: "sp_08", label: "Condition of belt" },
    { id: "sp_09", label: "Condition of roller" },
    { id: "sp_10", label: "Condition of skirt plate/rubber" },
    { id: "sp_11", label: "Oil/Grease level" },
    { id: "sp_12", label: "Condition of pulley" },
    { id: "sp_13", label: "Condition of Screen/Pan plate" },
    { id: "sp_14", label: "Condition of dumping pad" },
    { id: "sp_15", label: "Any other issues" }
  ]
};

// --- STYLES (Tata Branding) ---
const colors = {
  tataBlue: '#0054a6', 
  lightBlue: '#e6f0fa',
  white: '#ffffff',
  border: '#ccc',
  success: '#28a745',
  warning: '#ffc107',
  text: '#333'
};

const styles = {
  container: { padding: '20px', fontFamily: '"Helvetica Neue", Arial, sans-serif', maxWidth: '1100px', margin: '0 auto', backgroundColor: '#f4f7f6', minHeight: '100vh' },
  
  // Branding Header
  brandBar: {
    backgroundColor: colors.tataBlue,
    color: colors.white,
    padding: '15px 20px',
    borderRadius: '8px 8px 0 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  // Group title and subtitle together
  brandTextGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandTitle: { margin: 0, fontSize: '24px', fontWeight: 'bold' },
  brandSubtitle: { margin: 0, fontSize: '13px', opacity: 0.9, fontWeight: '300' },

  // New Dashboard Button Style
  dashboardBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    transition: 'background 0.3s',
    textTransform: 'uppercase'
  },

  // Form Header
  headerContainer: { backgroundColor: colors.white, padding: '20px', borderRadius: '0 0 8px 8px', marginBottom: '20px', border: `1px solid ${colors.border}`, borderTop: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  formTitle: { marginTop: '0', color: colors.tataBlue, borderBottom: `2px solid ${colors.tataBlue}`, paddingBottom: '10px' },
  headerForm: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '15px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  headerInput: { padding: '10px', borderRadius: '4px', border: `1px solid ${colors.border}`, minWidth: '220px', fontSize: '14px' },
  
  // Cards
  equipmentCard: { border: `1px solid ${colors.border}`, marginBottom: '12px', borderRadius: '6px', backgroundColor: colors.white, overflow: 'hidden' },
  equipmentHeader: {
    padding: '15px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s',
    borderBottom: '1px solid transparent'
  },
  
  // Table
  tableContainer: { padding: '0 20px 20px 20px', overflowX: 'auto', backgroundColor: '#fafafa' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: colors.white },
  th: { borderBottom: '2px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: colors.lightBlue, color: colors.tataBlue, fontSize: '14px' },
  td: { borderBottom: '1px solid #eee', padding: '12px', verticalAlign: 'middle', fontSize: '14px' },
  
  // Inputs
  inputGroup: { display: 'flex', gap: '20px', alignItems: 'center' },
  label: { display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' },
  select: { padding: '6px', borderRadius: '4px', border: `1px solid ${colors.border}`, width: '100%' },
  textInput: { padding: '6px', width: '95%', borderRadius: '4px', border: `1px solid ${colors.border}` },
  
  // Buttons
  actionBtn: {
    marginTop: '15px', padding: '10px 20px', backgroundColor: colors.tataBlue, color: 'white',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', float: 'right', marginBottom: '10px',
    fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px'
  },
  submitBtn: {
    marginTop: '30px', width: '100%', padding: '16px', backgroundColor: '#28a745', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }
};

export default function EquipmentChecklist() {
  const navigate = useNavigate(); // <--- 2. Initialize Navigate Hook
  const [operatorName, setOperatorName] = useState('');
  const [shift, setShift] = useState('Morning');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { equipments, checklistSpecs } = masterData;
  const [openEquipmentId, setOpenEquipmentId] = useState(null);
  const [formData, setFormData] = useState({});

  const toggleAccordion = (id) => {
    setOpenEquipmentId(openEquipmentId === id ? null : id);
  };

  const handleStatusChange = (eqId, specId, status) => {
    setFormData(prev => ({
      ...prev,
      [eqId]: {
        ...prev[eqId],
        [specId]: {
          ...prev[eqId]?.[specId],
          status: status,
          action: status === 'OK' ? '' : prev[eqId]?.[specId]?.action || 'Repair',
          remarks: status === 'OK' ? '' : prev[eqId]?.[specId]?.remarks || ''
        }
      }
    }));
  };

  const handleDetailChange = (eqId, specId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [eqId]: {
        ...prev[eqId],
        [specId]: { ...prev[eqId]?.[specId], [field]: value }
      }
    }));
  };

  const handleSingleAction = (eqId, eqName) => {
    if (!operatorName.trim()) {
      alert("Please enter Operator Name at the top before taking action.");
      return;
    }
    const eqData = formData[eqId] || {};
    const filledCount = Object.keys(eqData).length;
    
    if (filledCount < checklistSpecs.length) {
      alert(`Incomplete! You have checked ${filledCount}/${checklistSpecs.length} items for ${eqName}.`);
      return;
    }
    const missingRemarks = Object.values(eqData).some(item => item.status === 'Not OK' && !item.remarks);
    if (missingRemarks) {
      alert("Please fill in Remarks for all 'Not OK' items.");
      return;
    }

    alert(`Success! Data for ${eqName} has been recorded locally.`);
    setOpenEquipmentId(null);
  };

  const handleGlobalSubmit = async () => {
    if (!operatorName.trim()) return alert("Operator Name is required.");
    if (Object.keys(formData).length === 0) return alert("No data to submit!");
    if (!window.confirm("Submit Daily Report?")) return;

    setIsSubmitting(true);

    const checklistArray = [];

    // Loop through Equipments and Flatten Data
    Object.entries(formData).forEach(([eqId, specs]) => {
        const eqInfo = masterData.equipments.find(e => e.id === eqId);
        const eqName = eqInfo ? eqInfo.name : eqId; 

        Object.entries(specs).forEach(([specId, details]) => {
            const specInfo = masterData.checklistSpecs.find(s => s.id === specId);
            const specName = specInfo ? specInfo.label : specId;

            checklistArray.push({
                equipmentId: eqId,
                equipmentName: eqName, 
                specId: specId,
                specName: specName,    
                status: details.status,
                action: details.action,
                remarks: details.remarks
            });
        });
    });

    const payload = {
        operatorName: operatorName,
        shift: shift,
        checklist: checklistArray 
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            alert("✅ Report Saved! ID: " + result.reportId);
            setFormData({});
            setOperatorName('');
            setOpenEquipmentId(null);
        } else {
            alert("❌ Server Error: " + result.detail);
        }
    } catch (error) {
        console.error(error);
        alert("❌ Network Error");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      
      {/* --- BRANDING HEADER --- */}
      <div style={styles.brandBar}>
        <div style={styles.brandTextGroup}>
            <h1 style={styles.brandTitle}>TATA CHEMICALS</h1>
            <div style={styles.brandSubtitle}>MHY Coal Plant Operations</div>
        </div>

        {/* --- 3. DASHBOARD BUTTON --- */}
        <button 
            style={styles.dashboardBtn} 
            onClick={() => navigate('/manager-dashboard')} // Replace with your actual route path
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
        >
            Manager Dashboard ➔
        </button>
      </div>

      {/* --- FORM HEADER --- */}
      <div style={styles.headerContainer}>
        <h2 style={styles.formTitle}>Daily Equipment Inspection Log</h2>
        <div style={styles.headerForm}>
          <div style={styles.formGroup}>
            <label style={{fontWeight:'bold', color:'#555'}}>Operator Name:</label>
            <input 
              type="text" 
              style={styles.headerInput} 
              placeholder="Enter Name"
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={{fontWeight:'bold', color:'#555'}}>Shift Timing:</label>
            <select style={styles.headerInput} value={shift} onChange={(e) => setShift(e.target.value)}>
              <option value="Morning">Morning (06:00 - 14:00)</option>
              <option value="Evening">Evening (14:00 - 22:00)</option>
              <option value="Night">Night (22:00 - 06:00)</option>
            </select>
          </div>
          <div style={{ ...styles.formGroup, justifyContent: 'end' }}>
             <span style={{alignSelf:'center', color: '#666', fontWeight:'bold'}}>
               Date: {new Date().toLocaleDateString()}
             </span>
          </div>
        </div>
      </div>

      {/* --- EQUIPMENT LIST --- */}
      {equipments.map((eq) => {
        const eqData = formData[eq.id] || {};
        const filledCount = Object.keys(eqData).length;
        const isComplete = filledCount === checklistSpecs.length;

        // Dynamic styles based on state
        const headerStyle = {
          ...styles.equipmentHeader,
          borderLeft: isComplete ? '6px solid #28a745' : '6px solid #ffc107',
          backgroundColor: openEquipmentId === eq.id ? '#edf2f7' : '#fff',
          borderBottom: openEquipmentId === eq.id ? '1px solid #ddd' : 'none'
        };

        return (
          <div key={eq.id} style={styles.equipmentCard}>
            <div style={headerStyle} onClick={() => toggleAccordion(eq.id)}>
              <span style={{display: 'flex', flexDirection: 'column'}}>
                <span style={{fontSize:'16px', color: '#333'}}>{eq.name}</span>
                <span style={{fontSize:'12px', color:'#777', fontWeight:'normal', marginTop:'4px'}}>
                   Location: {eq.location}
                </span>
              </span>
              <span style={{fontSize: '14px'}}>
                {isComplete ? <span style={{color:'#28a745', marginRight:'10px'}}>✓ Complete</span> : null}
                {openEquipmentId === eq.id ? '▲' : '▼'}
              </span>
            </div>

            {openEquipmentId === eq.id && (
              <div style={styles.tableContainer}>
            
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{...styles.th, width: '30%'}}>Parameter</th>
                      <th style={{...styles.th, width: '25%'}}>Status</th>
                      <th style={{...styles.th, width: '20%'}}>Action</th>
                      <th style={{...styles.th, width: '25%'}}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checklistSpecs.map((spec) => {
                      const entry = formData[eq.id]?.[spec.id] || {};
                      const isNotOk = entry.status === 'Not OK';

                      return (
                        <tr key={spec.id} style={{ backgroundColor: isNotOk ? '#fff0f0' : 'inherit' }}>
                          <td style={styles.td}>{spec.label}</td>
                          <td style={styles.td}>
                            <div style={styles.inputGroup}>
                              <label style={{...styles.label, color: entry.status === 'OK' ? 'green' : 'inherit'}}>
                                <input
                                  type="radio"
                                  name={`${eq.id}-${spec.id}-status`}
                                  checked={entry.status === 'OK'}
                                  onChange={() => handleStatusChange(eq.id, spec.id, 'OK')}
                                /> OK
                              </label>
                              <label style={{...styles.label, color: entry.status === 'Not OK' ? 'red' : 'inherit'}}>
                                <input
                                  type="radio"
                                  name={`${eq.id}-${spec.id}-status`}
                                  checked={entry.status === 'Not OK'}
                                  onChange={() => handleStatusChange(eq.id, spec.id, 'Not OK')}
                                /> Not OK
                              </label>
                            </div>
                          </td>
                          <td style={styles.td}>
                            {isNotOk && (
                              <select 
                                style={styles.select}
                                value={entry.action || 'Repair'}
                                onChange={(e) => handleDetailChange(eq.id, spec.id, 'action', e.target.value)}
                              >
                                <option value="Repair">Repair</option>
                                <option value="Replace">Replace</option>
                              </select>
                            )}
                          </td>
                          <td style={styles.td}>
                            {isNotOk && (
                              <input
                                type="text"
                                style={styles.textInput}
                                placeholder="Issue details..."
                                value={entry.remarks || ''}
                                onChange={(e) => handleDetailChange(eq.id, spec.id, 'remarks', e.target.value)}
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{overflow: 'hidden', padding: '10px 0'}}>
                   <button style={styles.actionBtn} onClick={() => handleSingleAction(eq.id, eq.name)}>
                     Save {eq.name} Log
                   </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button 
        style={{
            ...styles.submitBtn, 
            backgroundColor: isSubmitting ? '#ccc' : '#28a745',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
        }} 
        onClick={handleGlobalSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'SAVING TO DATABASE...' : 'SUBMIT DAILY REPORT'}
      </button>
    </div>
  );
}