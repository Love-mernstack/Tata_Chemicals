import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateISOPDF } from './utils/pdfGenerator';

// --- STYLES (Reusing Tata Branding) ---
const colors = {
  tataBlue: '#0054a6',
  lightBlue: '#e6f0fa',
  white: '#ffffff',
  red: '#dc3545',
  green: '#28a745',
  border: '#ccc',
  text: '#333'
};

const styles = {
  container: { padding: '20px', fontFamily: '"Helvetica Neue", Arial, sans-serif', maxWidth: '1100px', margin: '0 auto', backgroundColor: '#f4f7f6', minHeight: '100vh' },
  
  // Header
  brandBar: {
    backgroundColor: colors.tataBlue,
    color: colors.white,
    padding: '15px 20px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  brandTitle: { margin: 0, fontSize: '20px', fontWeight: 'bold' },
  backBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.5)',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px'
  },

  // Report Card
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #ddd',
    marginBottom: '15px',
    overflow: 'hidden',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  cardHeader: {
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: '#fff',
    borderBottom: '1px solid transparent'
  },
  
  // Status Badges
  badge: {
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white',
    marginLeft: '10px'
  },
  
  // Table
  tableContainer: { padding: '0 20px 20px 20px', borderTop: '1px solid #eee', backgroundColor: '#fafafa' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px', backgroundColor: 'white', fontSize: '13px' },
  th: { textAlign: 'left', padding: '10px', backgroundColor: colors.lightBlue, color: colors.tataBlue, borderBottom: '2px solid #ddd' },
  td: { padding: '10px', borderBottom: '1px solid #eee' },
  
  // Issue Row
  issueRow: { backgroundColor: '#fff5f5' },
  okRow: { backgroundColor: '#fff' }
};

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [priorityChanges, setPriorityChanges] = useState({}); // Track local priority changes
  const [saving, setSaving] = useState(false);

  // 1. Fetch Data on Load
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        alert("Failed to load reports");
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Could not connect to backend");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Accordion
  const toggleReport = (id) => {
    setExpandedReportId(expandedReportId === id ? null : id);
  };

  // Helper- Count Issues
  const getIssueCount = (entries) => {
    return entries.filter(e => e.status === 'Not OK').length;
  };

  // Handle local priority change
  const handlePriorityChange = (entryId, newPriority) => {
    setPriorityChanges(prev => ({
      ...prev,
      [entryId]: newPriority || null
    }));
  };

  // Get current priority (from local changes or original data)
  const getCurrentPriority = (entry) => {
    return priorityChanges.hasOwnProperty(entry.id) 
      ? priorityChanges[entry.id] 
      : entry.priority;
  };

  // Save all priorities
  const saveAllPriorities = async () => {
    if (Object.keys(priorityChanges).length === 0) {
      alert("No priority changes to save");
      return;
    }

    setSaving(true);
    try {
      const updatePromises = Object.entries(priorityChanges).map(([entryId, priority]) =>
        fetch(`http://127.0.0.1:8000/entries/${entryId}/priority`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priority })
        })
      );

      const results = await Promise.all(updatePromises);
      const allSuccessful = results.every(r => r.ok);

      if (allSuccessful) {
        alert(`✅ Successfully saved ${Object.keys(priorityChanges).length} priority changes`);
        setPriorityChanges({});
        await fetchReports(); // Refresh data
      } else {
        alert("⚠️ Some priorities failed to save");
      }
    } catch (error) {
      console.error('Error saving priorities:', error);
      alert('❌ Network error while saving');
    } finally {
      setSaving(false);
    }
  };




  if (loading) return <div style={{padding:'20px', textAlign:'center'}}>Loading Dashboard...</div>;

  return (
    <div style={styles.container}>
      
      {/* --- DASHBOARD HEADER --- */}
      <div style={styles.brandBar}>
        <div>
          <h1 style={styles.brandTitle}>Manager Dashboard</h1>
          <span style={{fontSize:'12px', opacity:0.8}}>Overview of Daily Inspections</span>
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
          <button 
            style={{
              ...styles.backBtn,
              backgroundColor: Object.keys(priorityChanges).length > 0 ? '#28a745' : 'transparent',
              fontWeight: Object.keys(priorityChanges).length > 0 ? 'bold' : 'normal'
            }} 
            onClick={saveAllPriorities}
            disabled={saving || Object.keys(priorityChanges).length === 0}
          >
            {saving ? 'Saving...' : `💾 Save Priorities${Object.keys(priorityChanges).length > 0 ? ` (${Object.keys(priorityChanges).length})` : ''}`}
          </button>
          <button 
            style={{
              ...styles.backBtn,
              backgroundColor: '#ff9800',
              border: '1px solid rgba(255,255,255,0.5)'
            }} 
            onClick={() => navigate('/senior-manager-dashboard')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f57c00'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ff9800'}
          >
            👔 Senior Manager →
          </button>
          <button style={styles.backBtn} onClick={() => navigate('/')}>
            ⬅ Back to Operator Form
          </button>
        </div>
      </div>

      {/* --- REPORTS LIST --- */}
      {reports.length === 0 ? (
        <div style={{textAlign:'center', color:'#666', marginTop:'40px'}}>
            <h3>No reports submitted yet.</h3>
        </div>
      ) : (
        reports.map((report) => {
          const issueCount = getIssueCount(report.entries);
          const isExpanded = expandedReportId === report.id;
          const dateStr = new Date(report.createdAt).toLocaleString();

          return (
            <div key={report.id} style={styles.card}>
              
              {/* Report Summary Header */}
              <div 
                style={{
                    ...styles.cardHeader, 
                    backgroundColor: isExpanded ? '#f8f9fa' : 'white',
                    borderBottom: isExpanded ? '1px solid #ddd' : 'none'
                }} 
                onClick={() => toggleReport(report.id)}
              >
                <div>
                  <div style={{fontSize:'16px', fontWeight:'bold', color: colors.tataBlue}}>
                    {report.operatorName}
                  </div>
                  <div style={{fontSize:'12px', color:'#888', marginTop:'4px'}}>
                    Submitted: {dateStr}
                  </div>
                </div>

                <div style={{display:'flex', alignItems:'center', gap: '10px'}}>
                   {/* Download PDF Button */}
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       generateISOPDF(report);
                     }}
                     style={{
                       backgroundColor: colors.tataBlue,
                       color: 'white',
                       border: 'none',
                       padding: '8px 16px',
                       borderRadius: '4px',
                       cursor: 'pointer',
                       fontSize: '12px',
                       fontWeight: 'bold',
                       display: 'flex',
                       alignItems: 'center',
                       gap: '5px'
                     }}
                     onMouseEnter={(e) => e.target.style.backgroundColor = '#003d7a'}
                     onMouseLeave={(e) => e.target.style.backgroundColor = colors.tataBlue}
                   >
                     📄 Download ISO Report
                   </button>
                   
                   {/* Status Badge */}
                   {issueCount > 0 ? (
                     <span style={{...styles.badge, backgroundColor: colors.red}}>
                       ⚠️ {issueCount} Issues Found
                     </span>
                   ) : (
                     <span style={{...styles.badge, backgroundColor: colors.green}}>
                       ✅ All Systems OK
                     </span>
                   )}
                   <span style={{marginLeft:'15px', fontSize:'18px', color:'#ccc'}}>
                     {isExpanded ? '▲' : '▼'}
                   </span>
                </div>
              </div>

              {/* Report Details (Expandable) */}
              {isExpanded && (
                <div style={styles.tableContainer}>
                  {/* Group entries by equipment */}
                  {(() => {
                    // Group entries by equipmentId
                    const equipmentGroups = {};
                    report.entries.forEach(entry => {
                      if (!equipmentGroups[entry.equipmentId]) {
                        equipmentGroups[entry.equipmentId] = {
                          name: entry.equipmentName,
                          remarks: entry.equipmentRemarks,
                          specs: []
                        };
                      }
                      equipmentGroups[entry.equipmentId].specs.push(entry);
                    });

                    return Object.entries(equipmentGroups).map(([eqId, eqData]) => {
                      const issuesInEquipment = eqData.specs.filter(s => s.status === 'Not OK').length;
                      
                      return (
                        <div key={eqId} style={{marginBottom: '25px'}}>
                          {/* Equipment Header */}
                          <div style={{
                            backgroundColor: colors.lightBlue,
                            padding: '12px 15px',
                            borderRadius: '4px',
                            marginBottom: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{fontWeight: 'bold', color: colors.tataBlue, fontSize: '15px'}}>
                              {eqData.name}
                            </span>
                            {issuesInEquipment > 0 && (
                              <span style={{color: colors.red, fontSize: '13px', fontWeight: 'bold'}}>
                                ⚠️ {issuesInEquipment} Issue{issuesInEquipment > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>

                          {/* Specs Table */}
                          <table style={styles.table}>
                            <thead>
                              <tr>
                                <th style={{...styles.th, width: '40%'}}>Parameter</th>
                                <th style={{...styles.th, width: '20%'}}>Status</th>
                                <th style={{...styles.th, width: '20%'}}>Action</th>
                                <th style={{...styles.th, width: '20%'}}>Priority</th>
                              </tr>
                            </thead>
                            <tbody>
                              {eqData.specs.sort((a, b) => (a.status === 'Not OK' ? -1 : 1)).map((entry) => {
                                const isIssue = entry.status === 'Not OK';
                                return (
                                  <tr key={entry.id} style={isIssue ? styles.issueRow : styles.okRow}>
                                    <td style={styles.td}>{entry.specName}</td>
                                    <td style={styles.td}>
                                      {isIssue ? (
                                        <span style={{color: colors.red, fontWeight:'bold'}}>❌ Not OK</span>
                                      ) : (
                                        <span style={{color: colors.green}}>✓ OK</span>
                                      )}
                                    </td>
                                    <td style={styles.td}>{entry.action || '-'}</td>
                                    <td style={styles.td}>
                              {isIssue && (
                                <select
                                  value={getCurrentPriority(entry)}
                                  onChange={(e) => handlePriorityChange(entry.id, e.target.value)}
                                  style={{
                                    padding: '5px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    backgroundColor: getCurrentPriority(entry) === 'P1' ? '#ffebee' : 
                                                   getCurrentPriority(entry) === 'P2' ? '#fff3e0' : 
                                                   getCurrentPriority(entry) === 'P3' ? '#e8f5e9' : 'white'
                                  }}
                                >
                                  <option value="">No Priority</option>
                                  <option value="P1">P1 - Critical</option>
                                  <option value="P2">P2 - High</option>
                                  <option value="P3">P3 - Medium</option>
                                </select>
                              )}
                              {!isIssue && '-'}
                            </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>

                          {/* Equipment Remarks */}
                          {eqData.remarks && (
                            <div style={{
                              marginTop: '10px',
                              padding: '12px',
                              backgroundColor: '#fffbf0',
                              borderLeft: `4px solid ${colors.warning}`,
                              borderRadius: '4px'
                            }}>
                              <div style={{fontWeight: 'bold', color: colors.text, marginBottom: '5px', fontSize: '13px'}}>
                                Equipment Remarks:
                              </div>
                              <div style={{color: '#666', fontSize: '13px'}}>
                                {eqData.remarks}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}