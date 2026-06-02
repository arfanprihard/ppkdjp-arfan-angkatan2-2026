import { useMemo } from 'react'
import { modulesData } from '../data/quizData'

function Dashboard({ navigateTo, quizResults, resetProgress }) {
  const stats = useMemo(() => {
    const completed = Object.keys(quizResults).length
    const total = modulesData.length
    const totalScore = Object.values(quizResults).reduce((sum, r) => sum + r.score, 0)
    const totalQuestions = Object.values(quizResults).reduce((sum, r) => sum + r.total, 0)
    const avgPercentage = completed > 0
      ? Math.round(Object.values(quizResults).reduce((sum, r) => sum + r.percentage, 0) / completed)
      : 0

    let rank = '🌱 Pemula'
    if (completed === total && avgPercentage >= 90) rank = '🏆 Hooks Master'
    else if (completed >= 6 && avgPercentage >= 80) rank = '🔥 Advanced'
    else if (completed >= 4 && avgPercentage >= 60) rank = '⚡ Intermediate'
    else if (completed >= 2) rank = '📚 Learner'

    return { completed, total, totalScore, totalQuestions, avgPercentage, rank }
  }, [quizResults])

  return (
    <div className="dashboard fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="title-icon">🎓</span>
            React Hooks Academy
          </h1>
          <p className="page-subtitle">Kuasai setiap hook dengan quiz interaktif & tantangan coding</p>
        </div>
        {stats.completed > 0 && (
          <button className="btn btn-danger btn-sm" onClick={resetProgress}>
            🔄 Reset Progress
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)' }}>📊</div>
          <div className="stat-info">
            <p className="stat-value">{stats.completed}/{stats.total}</p>
            <p className="stat-label">Modul Selesai</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #00B894, #00CEC9)' }}>✅</div>
          <div className="stat-info">
            <p className="stat-value">{stats.totalScore}/{stats.totalQuestions}</p>
            <p className="stat-label">Jawaban Benar</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #E17055, #FDCB6E)' }}>📈</div>
          <div className="stat-info">
            <p className="stat-value">{stats.avgPercentage}%</p>
            <p className="stat-label">Rata-rata Skor</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #E84393, #FD79A8)' }}>🎖️</div>
          <div className="stat-info">
            <p className="stat-value">{stats.rank}</p>
            <p className="stat-label">Rank Kamu</p>
          </div>
        </div>
      </div>

      {/* Module Cards */}
      <div className="section-header">
        <h2 className="section-title">📚 Modul Pembelajaran</h2>
        <p className="section-subtitle">Pilih hook yang ingin dipelajari</p>
      </div>

      <div className="modules-grid">
        {modulesData.map((mod, index) => {
          const result = quizResults[mod.id]
          const isCompleted = !!result
          return (
            <div
              key={mod.id}
              className={`module-card ${isCompleted ? 'completed' : ''}`}
              onClick={() => navigateTo('module', mod.id)}
              style={{
                '--module-color': mod.color,
                animationDelay: `${index * 0.08}s`
              }}
            >
              <div className="module-card-header">
                <div className="icon-circle" style={{ background: `linear-gradient(135deg, ${mod.color}, ${mod.color}88)` }}>
                  <span className="module-icon">{mod.icon}</span>
                </div>
                {isCompleted && (
                  <div className={`module-badge ${result.percentage >= 80 ? 'badge-success' : result.percentage >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                    {result.percentage}%
                  </div>
                )}
              </div>
              <h3 className="module-card-title">{mod.title}</h3>
              <p className="module-card-desc">{mod.description}</p>
              <div className="module-card-footer">
                <span className="quiz-count">{mod.quiz.length} soal</span>
                <span className="module-card-action">
                  {isCompleted ? 'Ulangi →' : 'Mulai →'}
                </span>
              </div>
              {isCompleted && (
                <div className="module-progress-bar">
                  <div
                    className="module-progress-fill"
                    style={{
                      width: `${result.percentage}%`,
                      background: `linear-gradient(90deg, ${mod.color}, ${mod.color}88)`
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Challenges CTA */}
      <div className="cta-card" onClick={() => navigateTo('challenges')}>
        <div className="cta-content">
          <h2>💻 Siap Tantangan Coding?</h2>
          <p>8 studi kasus nyata dari Todo App sampai Mini E-Commerce. Kerjakan dan dapatkan review & nilai!</p>
          <button className="btn btn-primary">
            Lihat Tantangan →
          </button>
        </div>
        <div className="cta-decoration">
          <span className="cta-emoji">🚀</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
