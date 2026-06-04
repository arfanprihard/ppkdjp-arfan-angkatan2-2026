import { useState } from 'react'
import { codingChallenges } from '../data/quizData'
import Challenge1_useState from '../challenges/Challenge1_useState'
import Challenge2_useEffect from '../challenges/Challenge2_useEffect'
import Challenge3_useContext from '../challenges/Challenge3_useContext'
import Challenge4_useReducer from '../challenges/Challenge4_useReducer'
import Challenge5_useMemo_useCallback from '../challenges/Challenge5_useMemo_useCallback'
import Challenge6_useRef from '../challenges/Challenge6_useRef'
import Challenge7_customHooks from '../challenges/Challenge7_customHooks'
import Challenge8_finalBoss from '../challenges/Challenge8_finalBoss'

// Map challenge ID → component
const CHALLENGE_COMPONENTS = {
  1: Challenge1_useState,
  2: Challenge2_useEffect,
  3: Challenge3_useContext,
  4: Challenge4_useReducer,
  5: Challenge5_useMemo_useCallback,
  6: Challenge6_useRef,
  7: Challenge7_customHooks,
  8: Challenge8_finalBoss,
}

function ChallengesPage({ navigateTo }) {
  const [activeTab, setActiveTab] = useState('list') // 'list' or 'preview'
  const [selectedChallengeId, setSelectedChallengeId] = useState(null)

  const handleOpenPreview = (id) => {
    setSelectedChallengeId(id)
    setActiveTab('preview')
  }

  const renderActiveChallenge = () => {
    const Component = CHALLENGE_COMPONENTS[selectedChallengeId]
    if (Component) return <Component />
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#aaa' }}>
        <p>Live preview untuk Tantangan #{selectedChallengeId} belum tersedia.</p>
        <button className="btn btn-secondary" onClick={() => setActiveTab('list')}>
          Kembali ke Daftar
        </button>
      </div>
    )
  }

  const selectedChallenge = codingChallenges.find(c => c.id === selectedChallengeId)

  if (activeTab === 'preview') {
    return (
      <div className="challenges-page fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <span className="title-icon">👁️</span>
              Live Preview #{selectedChallengeId}
            </h1>
            <p className="page-subtitle">
              {selectedChallenge?.title} —{' '}
              <code>src/challenges/Challenge{selectedChallengeId}_*.jsx</code>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => {
              const prev = selectedChallengeId - 1
              if (prev >= 1) setSelectedChallengeId(prev)
            }} disabled={selectedChallengeId <= 1}>
              ← Prev
            </button>
            <span style={{ color: '#a0a0c0', fontSize: '13px', fontWeight: 600 }}>
              {selectedChallengeId} / {codingChallenges.length}
            </span>
            <button className="btn btn-secondary" onClick={() => {
              const next = selectedChallengeId + 1
              if (next <= codingChallenges.length) setSelectedChallengeId(next)
            }} disabled={selectedChallengeId >= codingChallenges.length}>
              Next →
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('list')}>
              ☰ Daftar Tantangan
            </button>
          </div>
        </div>

        {/* Challenge selector tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {codingChallenges.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedChallengeId(c.id)}
              style={{
                padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
                fontWeight: 600, cursor: 'pointer',
                background: selectedChallengeId === c.id ? '#6C5CE7' : 'transparent',
                border: `1px solid ${selectedChallengeId === c.id ? '#6C5CE7' : '#30306a'}`,
                color: selectedChallengeId === c.id ? '#fff' : '#a0a0c0',
                transition: 'all 0.2s'
              }}
            >
              #{c.id} {c.hook}
            </button>
          ))}
        </div>

        {/* Preview sandbox */}
        <div style={{
          background: '#0a0a1a',
          borderRadius: '16px',
          border: '1px solid #20204a',
          overflow: 'hidden',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
        }}>
          {/* Sandbox top bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 16px',
            background: '#111128', borderBottom: '1px solid #20204a'
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#E17055' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FDCB6E' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00B894' }} />
            </div>
            <div style={{
              flex: 1, textAlign: 'center', fontSize: '12px', color: '#555',
              fontFamily: 'monospace'
            }}>
              ⚛️ React Hooks Academy — Tantangan #{selectedChallengeId}: {selectedChallenge?.title}
            </div>
            <div style={{ fontSize: '11px', color: '#555' }}>
              Hook: <span style={{ color: '#A29BFE', fontWeight: 700 }}>{selectedChallenge?.hook}</span>
            </div>
          </div>

          {/* Component output */}
          <div style={{ padding: '0', minHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }}>
            {renderActiveChallenge()}
          </div>
        </div>

        {/* Info footer */}
        <div style={{
          marginTop: '16px', padding: '12px 16px', borderRadius: '12px',
          background: '#6C5CE710', border: '1px solid #6C5CE730',
          fontSize: '12px', color: '#a0a0c0', display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <span style={{ fontSize: '16px' }}>💡</span>
          <span>Ini adalah <strong style={{ color: '#f0f0f8' }}>contoh jawaban</strong> dari tantangan ini. Kamu bisa modifikasi dan kembangkan kode di file <code style={{ color: '#6C5CE7' }}>src/challenges/</code> sesuai kreativitas kamu!</span>
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
            Kerjakan studi kasus nyata, lalu kirimkan kode kamu untuk di-review &amp; dinilai!
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
                👁️ Lihat Contoh Jawaban
              </button>
            </div>
          )
        })}
      </div>


      {/* How to Submit */}
      <div className="submit-info-card">
        <h3>📤 Cara Mengerjakan &amp; Submit</h3>
        <div className="submit-steps">
          <div className="submit-step">
            <div className="step-number">1</div>
            <div>
              <strong>Lihat Contoh Jawaban</strong>
              <p>Klik tombol "Lihat Contoh Jawaban" untuk melihat gambaran hasil akhir yang diharapkan</p>
            </div>
          </div>
          <div className="submit-step">
            <div className="step-number">2</div>
            <div>
              <strong>Kerjakan di file challenge</strong>
              <p>Buat sendiri di file <code>src/challenges/Challenge#_*.jsx</code> sesuai kreativitas kamu</p>
            </div>
          </div>
          <div className="submit-step">
            <div className="step-number">3</div>
            <div>
              <strong>Kirimkan kode ke saya</strong>
              <p>Copy-paste kode kamu ke chat, dan saya akan review &amp; beri nilai! 🎯</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChallengesPage
