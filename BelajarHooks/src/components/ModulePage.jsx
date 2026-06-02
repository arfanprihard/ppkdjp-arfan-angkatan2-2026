import { useState } from 'react'

function ModulePage({ module, navigateTo, quizResults }) {
  const [activeTab, setActiveTab] = useState('theory')

  if (!module) {
    navigateTo('dashboard')
    return null
  }

  const result = quizResults[module.id]

  const renderTheory = () => {
    // Parse the theory text and render with code blocks
    const parts = module.theory.split(/(```[\s\S]*?```)/g)

    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const code = part.replace(/```\w*\n?/g, '').replace(/```$/g, '')
        return (
          <pre key={i} className="code-block">
            <code>{code}</code>
          </pre>
        )
      }

      // Parse bold, inline code, and numbered lists
      const lines = part.split('\n').filter(l => l.trim())
      return lines.map((line, j) => {
        // Bold headers
        if (line.startsWith('**') && line.endsWith('**')) {
          return <h3 key={`${i}-${j}`} className="theory-heading">{line.replace(/\*\*/g, '')}</h3>
        }

        // Process inline formatting
        let processed = line
        const elements = []
        let lastIndex = 0
        const regex = /(\*\*.*?\*\*|`[^`]+`)/g
        let match

        while ((match = regex.exec(processed)) !== null) {
          if (match.index > lastIndex) {
            elements.push(processed.slice(lastIndex, match.index))
          }
          if (match[0].startsWith('**')) {
            elements.push(<strong key={`${i}-${j}-${match.index}`}>{match[0].replace(/\*\*/g, '')}</strong>)
          } else if (match[0].startsWith('`')) {
            elements.push(<code key={`${i}-${j}-${match.index}`} className="inline-code">{match[0].replace(/`/g, '')}</code>)
          }
          lastIndex = match.index + match[0].length
        }
        if (lastIndex < processed.length) {
          elements.push(processed.slice(lastIndex))
        }

        // Numbered items
        if (/^\d+\./.test(line.trim())) {
          return <p key={`${i}-${j}`} className="theory-list-item">{elements.length ? elements : line}</p>
        }

        // Regular line
        if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
          return <p key={`${i}-${j}`} className="theory-bullet">{elements.length ? elements : line}</p>
        }

        return <p key={`${i}-${j}`} className="theory-text">{elements.length ? elements : line}</p>
      })
    })
  }

  return (
    <div className="module-page fade-in">
      {/* Header */}
      <div className="module-header" style={{ '--module-color': module.color }}>
        <button className="btn-back" onClick={() => navigateTo('dashboard')}>
          ← Kembali
        </button>
        <div className="module-header-content">
          <div className="icon-circle large" style={{ background: `linear-gradient(135deg, ${module.color}, ${module.color}88)` }}>
            <span className="module-icon large">{module.icon}</span>
          </div>
          <div>
            <h1 className="module-title">{module.title}</h1>
            <p className="module-desc">{module.description}</p>
          </div>
        </div>
        {result && (
          <div className="module-result-banner">
            <span>Skor terakhir: </span>
            <strong className={result.percentage >= 80 ? 'text-success' : result.percentage >= 50 ? 'text-warning' : 'text-danger'}>
              {result.score}/{result.total} ({result.percentage}%)
            </strong>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <button
          className={`tab ${activeTab === 'theory' ? 'active' : ''}`}
          onClick={() => setActiveTab('theory')}
          style={{ '--tab-color': module.color }}
        >
          📖 Materi
        </button>
        <button
          className={`tab ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
          style={{ '--tab-color': module.color }}
        >
          🧪 Quiz ({module.quiz.length} soal)
        </button>
      </div>

      {/* Content */}
      {activeTab === 'theory' ? (
        <div className="theory-content slide-up">
          <div className="theory-card">
            {renderTheory()}
          </div>
          <div className="theory-cta">
            <p>Sudah paham materinya?</p>
            <button
              className="btn btn-primary"
              onClick={() => navigateTo('quiz', module.id)}
              style={{ background: `linear-gradient(135deg, ${module.color}, ${module.color}cc)` }}
            >
              🧪 Mulai Quiz →
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-preview slide-up">
          <div className="quiz-info-card">
            <h3>🧪 Quiz: {module.title}</h3>
            <div className="quiz-info-details">
              <div className="quiz-info-item">
                <span className="info-icon">📝</span>
                <span>{module.quiz.length} pertanyaan</span>
              </div>
              <div className="quiz-info-item">
                <span className="info-icon">🎯</span>
                <span>Pilihan ganda, kode, & bug hunt</span>
              </div>
              <div className="quiz-info-item">
                <span className="info-icon">⏱️</span>
                <span>Tidak ada batas waktu</span>
              </div>
              <div className="quiz-info-item">
                <span className="info-icon">📊</span>
                <span>Penjelasan di setiap jawaban</span>
              </div>
            </div>
            {result && (
              <div className="quiz-last-result">
                <p>Hasil terakhir: <strong>{result.score}/{result.total}</strong> ({result.percentage}%)</p>
              </div>
            )}
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigateTo('quiz', module.id)}
              style={{ background: `linear-gradient(135deg, ${module.color}, ${module.color}cc)` }}
            >
              {result ? '🔄 Ulangi Quiz' : '🚀 Mulai Quiz'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModulePage
