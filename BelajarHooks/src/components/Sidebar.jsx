import { memo } from 'react'
import { modulesData } from '../data/quizData'

const Sidebar = memo(function Sidebar({ currentPage, navigateTo, quizResults, selectedModuleId }) {
  const completedCount = Object.keys(quizResults).length
  const totalModules = modulesData.length
  const overallProgress = Math.round((completedCount / totalModules) * 100)

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">⚛️</span>
          <div>
            <h1 className="logo-title">Hooks Academy</h1>
            <p className="logo-subtitle">React Mastery</p>
          </div>
        </div>
      </div>

      <div className="sidebar-progress">
        <div className="progress-info">
          <span>Progress</span>
          <span className="progress-percentage">{overallProgress}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="progress-detail">{completedCount}/{totalModules} modul selesai</p>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <p className="nav-section-title">MENU</p>
          <button
            className={`sidebar-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigateTo('dashboard')}
          >
            <span className="sidebar-item-icon">🏠</span>
            <span>Dashboard</span>
          </button>
          <button
            className={`sidebar-item ${currentPage === 'challenges' ? 'active' : ''}`}
            onClick={() => navigateTo('challenges')}
          >
            <span className="sidebar-item-icon">💻</span>
            <span>Tantangan Coding</span>
          </button>
        </div>

        <div className="nav-section">
          <p className="nav-section-title">MODUL</p>
          {modulesData.map(mod => {
            const result = quizResults[mod.id]
            const isActive = (currentPage === 'module' || currentPage === 'quiz') && selectedModuleId === mod.id
            return (
              <button
                key={mod.id}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => navigateTo('module', mod.id)}
              >
                <span className="sidebar-item-icon">{mod.icon}</span>
                <span>{mod.title}</span>
                {result && (
                  <span
                    className={`sidebar-badge ${result.percentage >= 80 ? 'badge-success' : result.percentage >= 50 ? 'badge-warning' : 'badge-danger'}`}
                  >
                    {result.percentage}%
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      <div className="sidebar-footer">
        <p>Made with 💜 for learning</p>
      </div>
    </aside>
  )
})

export default Sidebar
