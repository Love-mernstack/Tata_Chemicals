import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateP1PDF } from './utils/pdfGeneratorP1';
import logoSrc from '../download.png';

// --- PROFESSIONAL TATA CHEMICALS STYLES ---
const colors = {
  tataBlue: '#0054a6',
  lightBlue: '#e6f0fa',
  white: '#ffffff',
  red: '#dc3545',
  green: '#28a745',
  border: '#ccc',
  text: '#333',
  criticalRed: '#c62828',
  criticalBg: '#ffebee',
  warningOrange: '#f57c00'
};

const styles = {
  container: { 
    padding: '20px', 
    fontFamily: '"Helvetica Neue", Arial, sans-serif', 
    maxWidth: '1200px', 
    margin: '0 auto', 
    backgroundColor: '#f4f7f6', 
    minHeight: '100vh' 
  },
  
  // Professional Header with Logo
  brandBar: {
    background: 'linear-gradient(135deg, #0054a6 0%, #003d7a 100%)',
    color: colors.white,
    padding: '20px 25px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    boxShadow: '0 4px 12px rgba(0, 84, 166, 0.3)',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  logo: {
    height: '45px',
    width: 'auto',
    backgroundColor: 'white',
    padding: '5px 10px',
    borderRadius: '4px'
  },
  brandTextGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandTitle: { 
    margin: 0, 
    fontSize: '22px', 
    fontWeight: 'bold',
    letterSpacing: '0.5px'
  },
  brandSubtitle: {
    fontSize: '12px',
    opacity: 0.95,
    marginTop: '4px',
    fontWeight: '300'
  },
  headerButtons: {
    display: 'flex',
    gap: '10px'
  },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap'
  },

  // Professional Alert Banner
  alertBanner: {
    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
    padding: '16px 24px',
    borderRadius: '8px',
    marginBottom: '25px',
    borderLeft: '5px solid #f57c00',
    boxShadow: '0 2px 8px rgba(245, 124, 0, 0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },

  
  // Success Banner (No Issues)
  successBanner: {
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.15)',
    border: '2px solid #81c784'
  },

  // Professional Report Cards
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    border: '2px solid #ffe0b2',
    marginBottom: '20px',
    overflow: 'hidden',
    boxShadow: '0 3px 10px rgba(245, 124, 0, 0.12)',
    transition: 'all 0.3s ease'
  },
  cardHeader: {
    padding: '18px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
    borderBottom: '2px solid #ffb74d',
    transition: 'all 0.3s ease'
  },
  
  // Professional Badges
  badge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
    boxShadow: '0 2px 6px rgba(245, 124, 0, 0.3)',
    marginLeft: '10px'
  },
  
  // Table Container
  tableContainer: { 
    padding: '0 24px 24px 24px', 
    borderTop: '2px solid #ffcdd2', 
    backgroundColor: '#fafafa' 
  },
  
  // Professional Table
  table: { 
    width: '100%', 
    borderCollapse: 'collapse', 
    marginTop: '15px', 
    backgroundColor: 'white', 
    fontSize: '13px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  th: { 
    textAlign: 'left', 
    padding: '14px 12px', 
    background: 'linear-gradient(135deg, #e6f0fa 0%, #bbdefb 100%)', 
    color: colors.tataBlue, 
    borderBottom: '2px solid #64b5f6', 
    fontWeight: 'bold',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  td: { 
    padding: '12px', 
    borderBottom: '1px solid #f5f5f5',
    verticalAlign: 'middle'
  },
  
  // Issue Row
  issueRow: { 
    backgroundColor: '#fff8e1',
    transition: 'all 0.2s ease'
  },
  
  // Equipment Header
  equipmentHeader: {
    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
    padding: '14px 18px',
    borderRadius: '8px',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '2px solid #ffb74d',
    boxShadow: '0 2px 6px rgba(255, 183, 77, 0.2)'
  },
  
  // Remarks Box
  remarksBox: {
    marginTop: '12px',
    padding: '14px 18px',
    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
    borderLeft: `5px solid ${colors.criticalRed}`,
    borderRadius: '6px',
    boxShadow: '0 2px 6px rgba(245, 124, 0, 0.15)'
  }
};

export default function SeniorManagerDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReportId, setExpandedReportId] = useState(null);

  // Fetch P1 Priority Reports
  useEffect(() => {
    fetchP1Reports();
  }, []);

  const fetchP1Reports = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/reports/p1-priorities');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        alert("Failed to load P1 priority reports");
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

  // Count P1 Issues
  const getP1Count = (entries) => {
    return entries.filter(e => e.priority === 'P1').length;
  };

  if (loading) return <div style={{padding:'20px', textAlign:'center'}}>Loading P1 Priority Reports...</div>;

  return (
    <div style={styles.container}>
      
      {/* --- PROFESSIONAL TATA CHEMICALS HEADER --- */}
      <div style={styles.brandBar}>
        <div style={styles.logoContainer}>
          <img src={logoSrc} alt="TATA Chemicals" style={styles.logo} />
          <div style={styles.brandTextGroup}>
            <h1 style={styles.brandTitle}>SENIOR MANAGER DASHBOARD</h1>
            <div style={styles.brandSubtitle}>MHY Coal Plant - P1 Critical Issues Monitor</div>
          </div>
        </div>
        <div style={styles.headerButtons}>
          <button 
            style={styles.backBtn} 
            onClick={() => navigate('/manager-dashboard')}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'}
          >
            ⬅ Manager Dashboard
          </button>
          <button 
            style={styles.backBtn} 
            onClick={() => navigate('/')}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'}
          >
            🏠 Operator Form
          </button>
        </div>
      </div>

      {/* --- P1 REPORTS LIST --- */}
      {reports.length === 0 ? (
        <div style={styles.successBanner}>
            <div style={{fontSize: '48px', marginBottom: '12px'}}>✅</div>
            <h2 style={{color: '#2e7d32', margin: '8px 0', fontSize: '24px', fontWeight: 'bold'}}>
              No P1 Critical Issues
            </h2>
            <p style={{color: '#666', margin: '8px 0', fontSize: '15px'}}>
              All equipment is operating within acceptable parameters.
            </p>
            <p style={{color: '#888', margin: '8px 0', fontSize: '13px', fontStyle: 'italic'}}>
              Excellent work by the operations team!
            </p>
        </div>
      ) : (
        <>
          <div style={styles.alertBanner}>
            <div style={{fontSize: '28px'}}>⚠️</div>
            <div>
              <strong style={{color: '#e65100', fontSize: '16px', display: 'block', marginBottom: '4px'}}>
                URGENT ATTENTION REQUIRED
              </strong>
              <span style={{color: '#666', fontSize: '14px'}}>
                {reports.length} Report{reports.length > 1 ? 's' : ''} containing P1 Critical Issues requiring immediate action
              </span>
            </div>
          </div>
          
          {reports.map((report) => {
            const p1Count = getP1Count(report.entries);
            const isExpanded = expandedReportId === report.id;
            const dateStr = new Date(report.createdAt).toLocaleString();

            return (
              <div key={report.id} style={styles.card}>
                
                {/* Report Summary Header */}
                <div 
                  style={{
                      ...styles.cardHeader,
                      background: isExpanded 
                        ? 'linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%)'
                        : 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
                  }} 
                  onClick={() => toggleReport(report.id)}
                >
                  <div>
                    <div style={{fontSize:'17px', fontWeight:'bold', color: colors.warningOrange, display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span style={{fontSize: '20px'}}>⚠️</span>
                      <span>{report.operatorName}</span>
                    </div>
                    <div style={{fontSize:'12px', color:'#666', marginTop:'6px', fontWeight: '500'}}>
                      📅 Submitted: {dateStr}
                    </div>
                  </div>

                  <div style={{display:'flex', alignItems:'center', gap: '12px'}}>
                     {/* Professional Download Button */}
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         generateP1PDF(report);
                       }}
                       style={{
                         background: 'linear-gradient(135deg, #0054a6 0%, #003d7a 100%)',
                         color: 'white',
                         border: 'none',
                         padding: '10px 18px',
                         borderRadius: '6px',
                         cursor: 'pointer',
                         fontSize: '13px',
                         fontWeight: 'bold',
                         display: 'flex',
                         alignItems: 'center',
                         gap: '6px',
                         boxShadow: '0 3px 8px rgba(0, 84, 166, 0.3)',
                         transition: 'all 0.3s ease'
                       }}
                       onMouseEnter={(e) => {
                         e.target.style.transform = 'translateY(-2px)';
                         e.target.style.boxShadow = '0 5px 12px rgba(0, 84, 166, 0.4)';
                       }}
                       onMouseLeave={(e) => {
                         e.target.style.transform = 'translateY(0)';
                         e.target.style.boxShadow = '0 3px 8px rgba(0, 84, 166, 0.3)';
                       }}
                     >
                       📄 Download P1 Report
                     </button>
                     
                     {/* P1 Count Badge */}
                     <span style={styles.badge}>
                       🔴 {p1Count} P1 Issue{p1Count > 1 ? 's' : ''}
                     </span>
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
                        const p1InEquipment = eqData.specs.filter(s => s.priority === 'P1').length;
                        
                        return (
                          <div key={eqId} style={{marginBottom: '28px'}}>
                            {/* Professional Equipment Header */}
                            <div style={styles.equipmentHeader}>
                              <span style={{fontWeight: 'bold', color: colors.warningOrange, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <span style={{fontSize: '18px'}}>🔧</span>
                                <span>{eqData.name}</span>
                              </span>
                              <span style={{
                                color: colors.warningOrange, 
                                fontSize: '14px', 
                                fontWeight: 'bold',
                                padding: '4px 12px',
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}>
                                🔴 {p1InEquipment} Critical Issue{p1InEquipment > 1 ? 's' : ''}
                              </span>
                            </div>

                            {/* Specs Table - P1 Only */}
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
                                {eqData.specs.map((entry) => (
                                  <tr key={entry.id} style={styles.issueRow}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff3e0'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff8e1'}
                                  >
                                    <td style={{...styles.td, fontWeight: '500'}}>{entry.specName}</td>
                                    <td style={styles.td}>
                                      <span style={{
                                        color: colors.red, 
                                        fontWeight:'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                      }}>❌ Not OK</span>
                                    </td>
                                    <td style={styles.td}>{entry.action || '-'}</td>
                                    <td style={styles.td}>
                                      <span style={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
                                        padding: '5px 10px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        display: 'inline-block',
                                        boxShadow: '0 2px 4px rgba(245, 124, 0, 0.3)'
                                      }}>
                                        🔴 P1 - CRITICAL
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            {/* Professional Remarks Box */}
                            {eqData.remarks && (
                              <div style={styles.remarksBox}>
                                <div style={{
                                  fontWeight: 'bold', 
                                  color: colors.warningOrange, 
                                  marginBottom: '8px', 
                                  fontSize: '13px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}>
                                  📝 Equipment Remarks
                                </div>
                                <div style={{color: '#555', fontSize: '13px', lineHeight: '1.6'}}>
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
          })}
        </>
      )}
    </div>
  );
}
