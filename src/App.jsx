import { useState } from 'react';
import { BookOpen, Calendar, BarChart2, BookOpenCheck, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import papersData from './data/papers.json';
import './App.css';

// Accordion Component for individual questions
const Accordion = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <div 
        className="accordion-header" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="accordion-title">{question}</span>
        <ChevronDown className="accordion-icon" size={20} />
      </div>
      {isOpen && (
        <div className="accordion-content">
          <div className="markdown-body">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [activePaper, setActivePaper] = useState(papersData[3]?.paper || 'Summer 2025'); // Default to Summer 2025 based on image

  const currentPaperData = papersData.find(p => p.paper === activePaper) || papersData[0];

  const getIconForNav = (name) => {
    if (name.includes('Analysis')) return <BarChart2 size={18} />;
    if (name.includes('Predictive')) return <BookOpenCheck size={18} />;
    return <Calendar size={18} />;
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <BookOpen className="logo-icon" size={32} />
          <div className="sidebar-title-container">
            <div>
              <div className="sidebar-title">Sociology</div>
              <div className="sidebar-title">Q&A Vault</div>
            </div>
            <div>
              <div className="sidebar-author">CC</div>
              <div className="sidebar-author">Swayam</div>
              <div className="sidebar-author">Jain</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div 
            className={`nav-item ${activePaper === 'Predictive Analysis' ? 'active' : ''}`}
            onClick={() => setActivePaper('Predictive Analysis')}
          >
            {getIconForNav('Analysis')}
            <span>Predictive Analysis</span>
          </div>

          <div className="sidebar-section-title">EXAM PAPERS</div>
          
          {papersData.map((paper) => (
            <div 
              key={paper.paper}
              className={`nav-item ${activePaper === paper.paper ? 'active' : ''}`}
              onClick={() => setActivePaper(paper.paper)}
            >
              {getIconForNav(paper.paper)}
              <span>{paper.paper}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <h1 className="content-title">{activePaper}</h1>
          <p className="content-subtitle">Click on any question below to reveal the detailed answer.</p>
        </div>

        <div className="accordion-list">
          {activePaper === 'Predictive Analysis' ? (
            <div className="accordion-item" style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <h3>Welcome to the Sociology Q&A Vault</h3>
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                This vault contains extensive model answers for past year sociology papers and a highly accurate predictive question paper.
                Select an exam paper from the sidebar to view the questions and answers.
              </p>
            </div>
          ) : (
            currentPaperData.questions.map((q, index) => (
              <Accordion 
                key={index} 
                question={q.question} 
                answer={q.answer} 
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
