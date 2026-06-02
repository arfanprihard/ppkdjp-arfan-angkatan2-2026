import { useState } from 'react'
import { codingChallenges } from '../data/quizData'
import Challenge1_useState from '../challenges/Challenge1_useState'

function ChallengesPage({ navigateTo }) {
  const [activeTab, setActiveTab] = useState('list') // 'list' or 'preview'
  const [selectedChallengeId, setSelectedChallengeId] = useState(null)

  const handleOpenPreview = (id) => {
    setSelectedChallengeId(id)
    setActiveTab('preview')
  }

  const renderActiveChallenge = () => {
    if (selectedChallengeId === 1) {
      return <Challenge1_useState />
    }
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#aaa' }}>
        <p>Live preview untuk Tantangan #{selectedChallengeId} belum dihubungkan atau belum dikerjakan.</p>
        <p>Kamu saat ini bisa mengerjakan Tantangan #1 terlebih dahulu.</p>
        <button className="btn btn-secondary" onClick={() => setActiveTab('list')}>
          Kembali ke Daftar
        </button>
      </div>
    )
  }

  if (activeTab === 'preview') {
    return (
      <div className="challenges-page fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <span className="title-icon">👁️</span>
              Live Preview: Tantangan #{selectedChallengeId}
            </h1>
            <p className="page-subtitle">
              Melihat hasil kerja yang ada di file <code>src/challenges/Challenge{selectedChallengeId}_useState.jsx</code>
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => setActiveTab('list')}>
            ← Kembali ke Daftar
          </button>
        </div>

        <div className="preview-container-box" style={{ 
          background: '#111122', 
          borderRadius: '16px', 
          padding: '20px', 
          border: '1px solid #30363d',
          marginTop: '20px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}>
          {renderActiveChallenge()}
        </div>
      </div>
    )
  }

  return (
    <div className="challenges-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="title-icon">💻</span>
            Tantangan Coding
          </h1>
          <p className="page-subtitle">
            Kerjakan studi kasus nyata, lalu kirimkan kode kamu untuk di-review & dinilai!
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigateTo('dashboard')}>
          ← Dashboard
        </button>
      </div>

      {/* Scoring Info */}
      <div className="scoring-info-card">
        <h3>📊 Sistem Penilaian</h3>
        <div className="scoring-grid">
          <div className="scoring-item">
            <span className="scoring-emoji">✅</span>
            <div>
              <strong>Fungsionalitas (40%)</strong>
              <p>Apakah fitur berjalan sesuai requirement?</p>
            </div>
          </div>
          <div className="scoring-item">
            <span className="scoring-emoji">🎨</span>
            <div>
              <strong>Code Quality (30%)</strong>
              <p>Clean code, best practices, naming</p>
            </div>
          </div>
          <div className="scoring-item">
            <span className="scoring-emoji">🧠</span>
            <div>
              <strong>Penggunaan Hook (20%)</strong>
              <p>Apakah hook digunakan dengan tepat?</p>
            </div>
          </div>
          <div className="scoring-item">
            <span className="scoring-emoji">💡</span>
            <div>
              <strong>Kreativitas (10%)</strong>
              <p>Bonus points untuk fitur tambahan!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Cards */}
      <div className="challenges-grid">
        {codingChallenges.map((challenge, index) => {
          const colors = ['#6C5CE7', '#00B894', '#E17055', '#0984E3', '#FDCB6E', '#E84393', '#00CEC9', '#FF6B6B']
          const color = colors[index % colors.length]

          return (
            <div
              key={challenge.id}
              className="challenge-card"
              style={{
                '--challenge-color': color,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="challenge-header">
                <span className="challenge-number">#{challenge.id}</span>
                <span className="challenge-difficulty">{challenge.difficulty}</span>
              </div>

              <h3 className="challenge-title">{challenge.title}</h3>
              <p className="challenge-hook-badge" style={{ color: color, background: `${color}15` }}>
                {challenge.hook}
              </p>
              <p className="challenge-desc">{challenge.description}</p>

              <div className="challenge-requirements">
                <h4>Requirements:</h4>
                <ul>
                  {challenge.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              <details className="challenge-hints">
                <summary>💡 Hints (klik untuk melihat)</summary>
                <ul>
                  {challenge.hints.map((hint, i) => (
                    <li key={i}>{hint}</li>
                  ))}
                </ul>
              </details>

              {challenge.bonusPoints && (
                <div className="challenge-bonus">
                  <span>⭐ Bonus:</span> {challenge.bonusPoints}
                </div>
              )}

              <button 
                className="btn btn-primary" 
                style={{ 
                  marginTop: '15px', 
                  width: '100%',
                  background: `linear-gradient(135deg, ${color}, ${color}88)`
                }}
                onClick={() => handleOpenPreview(challenge.id)}
              >
                👁️ Lihat Live Preview Pekerjaan
              </button>
            </div>
          )
        })}
      </div>


      {/* How to Submit */}
      <div className="submit-info-card">
        <h3>📤 Cara Mengerjakan & Submit</h3>
        <div className="submit-steps">
          <div className="submit-step">
            <div className="step-number">1</div>
            <div>
              <strong>Buat file komponen</strong>
              <p>Buat file React baru untuk setiap challenge di folder project kamu</p>
            </div>
          </div>
          <div className="submit-step">
            <div className="step-number">2</div>
            <div>
              <strong>Kerjakan sesuai requirements</strong>
              <p>Pastikan semua fitur yang diminta sudah diimplementasi</p>
            </div>
          </div>
          <div className="submit-step">
            <div className="step-number">3</div>
            <div>
              <strong>Kirimkan kode ke saya</strong>
              <p>Copy-paste kode kamu ke chat, dan saya akan review & beri nilai! 🎯</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChallengesPage
