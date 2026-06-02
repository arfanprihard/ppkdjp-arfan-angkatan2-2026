import { useState, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ModulePage from './components/ModulePage'
import QuizPage from './components/QuizPage'
import ChallengesPage from './components/ChallengesPage'
import ResultPage from './components/ResultPage'
import { modulesData } from './data/quizData'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedModule, setSelectedModule] = useState(null)
  const [quizResults, setQuizResults] = useState(() => {
    const saved = localStorage.getItem('hooksAcademy_results')
    return saved ? JSON.parse(saved) : {}
  })

  const navigateTo = useCallback((page, moduleId = null) => {
    setCurrentPage(page)
    if (moduleId) {
      setSelectedModule(modulesData.find(m => m.id === moduleId))
    }
  }, [])

  const saveQuizResult = useCallback((moduleId, score, total) => {
    setQuizResults(prev => {
      const updated = {
        ...prev,
        [moduleId]: {
          score,
          total,
          percentage: Math.round((score / total) * 100),
          completedAt: new Date().toISOString()
        }
      }
      localStorage.setItem('hooksAcademy_results', JSON.stringify(updated))
      return updated
    })
  }, [])

  const resetProgress = useCallback(() => {
    setQuizResults({})
    localStorage.removeItem('hooksAcademy_results')
    setCurrentPage('dashboard')
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard navigateTo={navigateTo} quizResults={quizResults} resetProgress={resetProgress} />
      case 'module':
        return <ModulePage module={selectedModule} navigateTo={navigateTo} quizResults={quizResults} />
      case 'quiz':
        return <QuizPage module={selectedModule} navigateTo={navigateTo} saveQuizResult={saveQuizResult} />
      case 'challenges':
        return <ChallengesPage navigateTo={navigateTo} />
      case 'result':
        return <ResultPage module={selectedModule} quizResults={quizResults} navigateTo={navigateTo} />
      default:
        return <Dashboard navigateTo={navigateTo} quizResults={quizResults} />
    }
  }

  return (
    <div className="app">
      <Sidebar
        currentPage={currentPage}
        navigateTo={navigateTo}
        quizResults={quizResults}
        selectedModuleId={selectedModule?.id}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
