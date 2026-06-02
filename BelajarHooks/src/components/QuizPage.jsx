import { useState, useCallback } from 'react'

function QuizPage({ module, navigateTo, saveQuizResult }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answers, setAnswers] = useState([])
  const [isFinished, setIsFinished] = useState(false)

  if (!module) {
    navigateTo('dashboard')
    return null
  }

  const quiz = module.quiz
  const question = quiz[currentQuestion]
  const totalQuestions = quiz.length
  const progress = ((currentQuestion + (showExplanation ? 1 : 0)) / totalQuestions) * 100

  const handleSelect = useCallback((index) => {
    if (showExplanation) return
    setSelectedAnswer(index)
  }, [showExplanation])

  const handleConfirm = useCallback(() => {
    if (selectedAnswer === null) return
    setShowExplanation(true)

    const isCorrect = question.type === 'true-false'
      ? (selectedAnswer === 0) === question.correct
      : selectedAnswer === question.correct

    setAnswers(prev => [...prev, {
      questionId: question.id,
      selected: selectedAnswer,
      isCorrect
    }])
  }, [selectedAnswer, question])

  const handleNext = useCallback(() => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      // Quiz finished
      const finalAnswers = answers
      const score = finalAnswers.filter(a => a.isCorrect).length
      saveQuizResult(module.id, score, totalQuestions)
      setIsFinished(true)
    }
  }, [currentQuestion, totalQuestions, answers, saveQuizResult, module.id])

  const getOptionClass = (index) => {
    let cls = 'quiz-option'
    if (selectedAnswer === index) cls += ' selected'
    if (showExplanation) {
      const correctIndex = question.type === 'true-false'
        ? (question.correct ? 0 : 1)
        : question.correct
      if (index === correctIndex) cls += ' correct'
      else if (index === selectedAnswer && selectedAnswer !== correctIndex) cls += ' incorrect'
    }
    return cls
  }

  // Result screen
  if (isFinished) {
    const score = answers.filter(a => a.isCorrect).length
    const percentage = Math.round((score / totalQuestions) * 100)

    let emoji, message
    if (percentage >= 90) { emoji = '🏆'; message = 'Luar biasa! Kamu sudah menguasai hook ini!' }
    else if (percentage >= 70) { emoji = '🎉'; message = 'Bagus! Sedikit lagi kamu master!' }
    else if (percentage >= 50) { emoji = '💪'; message = 'Lumayan! Pelajari lagi materi yang sulit.' }
    else { emoji = '📚'; message = 'Perlu belajar lebih. Review materi dan coba lagi!' }

    return (
      <div className="result-screen fade-in">
        <div className="result-card" style={{ '--module-color': module.color }}>
          <div className="result-emoji">{emoji}</div>
          <h2 className="result-title">Quiz Selesai!</h2>
          <h3 className="result-module">{module.icon} {module.title}</h3>

          <div className="result-score-ring">
            <svg viewBox="0 0 120 120" className="score-ring-svg">
              <circle cx="60" cy="60" r="52" className="score-ring-bg" />
              <circle
                cx="60" cy="60" r="52"
                className="score-ring-fill"
                style={{
                  strokeDasharray: `${2 * Math.PI * 52}`,
                  strokeDashoffset: `${2 * Math.PI * 52 * (1 - percentage / 100)}`,
                  stroke: module.color
                }}
              />
            </svg>
            <div className="score-ring-text">
              <span className="score-ring-value">{percentage}%</span>
              <span className="score-ring-label">{score}/{totalQuestions}</span>
            </div>
          </div>

          <p className="result-message">{message}</p>

          {/* Answer Review */}
          <div className="result-review">
            <h4>Review Jawaban:</h4>
            {quiz.map((q, i) => {
              const answer = answers[i]
              return (
                <div key={q.id} className={`review-item ${answer?.isCorrect ? 'correct' : 'incorrect'}`}>
                  <span className="review-icon">{answer?.isCorrect ? '✅' : '❌'}</span>
                  <span className="review-text">Soal {i + 1}: {q.type === 'true-false' ? 'True/False' : q.type}</span>
                </div>
              )
            })}
          </div>

          <div className="result-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigateTo('module', module.id)}
              style={{ background: `linear-gradient(135deg, ${module.color}, ${module.color}cc)` }}
            >
              📖 Review Materi
            </button>
            <button className="btn btn-secondary" onClick={() => {
              setCurrentQuestion(0)
              setSelectedAnswer(null)
              setShowExplanation(false)
              setAnswers([])
              setIsFinished(false)
            }}>
              🔄 Ulangi Quiz
            </button>
            <button className="btn btn-secondary" onClick={() => navigateTo('dashboard')}>
              🏠 Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Build options based on question type
  let options
  if (question.type === 'true-false') {
    options = ['True (Benar)', 'False (Salah)']
  } else {
    options = question.options
  }

  return (
    <div className="quiz-container fade-in">
      {/* Quiz Header */}
      <div className="quiz-header" style={{ '--module-color': module.color }}>
        <button className="btn-back" onClick={() => navigateTo('module', module.id)}>
          ← Kembali
        </button>
        <div className="quiz-header-info">
          <span className="quiz-module-name">{module.icon} {module.title}</span>
          <span className="quiz-counter">Soal {currentQuestion + 1} / {totalQuestions}</span>
        </div>
        <div className="progress-bar quiz-progress">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${module.color}, ${module.color}88)`
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="quiz-question slide-up">
        <div className="question-type-badge" style={{ background: `${module.color}22`, color: module.color }}>
          {question.type === 'multiple-choice' && '🎯 Pilihan Ganda'}
          {question.type === 'true-false' && '✅ True / False'}
          {question.type === 'bug-hunt' && '🐛 Bug Hunt'}
          {question.type === 'code-completion' && '💻 Code Completion'}
        </div>

        <div className="question-text">
          {question.question.split(/(```[\s\S]*?```)/g).map((part, i) => {
            if (part.startsWith('```')) {
              const code = part.replace(/```\w*\n?/g, '').replace(/```$/g, '')
              return <pre key={i} className="code-block question-code"><code>{code}</code></pre>
            }
            return <p key={i}>{part}</p>
          })}
        </div>

        {/* Options */}
        <div className="quiz-options">
          {options.map((opt, index) => (
            <button
              key={index}
              className={getOptionClass(index)}
              onClick={() => handleSelect(index)}
              style={{ '--option-color': module.color }}
              disabled={showExplanation}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">
                {opt.split(/(```[\s\S]*?```|`[^`]+`)/g).map((part, i) => {
                  if (part.startsWith('```')) {
                    return <code key={i} className="option-code-block">{part.replace(/```\w*\n?/g, '').replace(/```$/g, '')}</code>
                  }
                  if (part.startsWith('`') && part.endsWith('`')) {
                    return <code key={i} className="inline-code">{part.slice(1, -1)}</code>
                  }
                  return <span key={i}>{part}</span>
                })}
              </span>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="explanation-box fade-in">
            <div className="explanation-header">
              {answers[answers.length - 1]?.isCorrect
                ? <span className="explanation-status correct">✅ Benar!</span>
                : <span className="explanation-status incorrect">❌ Salah!</span>
              }
            </div>
            <p className="explanation-text">{question.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="quiz-actions">
          {!showExplanation ? (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleConfirm}
              disabled={selectedAnswer === null}
              style={{
                background: selectedAnswer !== null
                  ? `linear-gradient(135deg, ${module.color}, ${module.color}cc)`
                  : undefined
              }}
            >
              Cek Jawaban
            </button>
          ) : (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleNext}
              style={{ background: `linear-gradient(135deg, ${module.color}, ${module.color}cc)` }}
            >
              {currentQuestion < totalQuestions - 1 ? 'Soal Berikutnya →' : '🏁 Lihat Hasil'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizPage
