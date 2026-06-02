// ResultPage is handled inside QuizPage — this is a redirect component
function ResultPage({ module, quizResults, navigateTo }) {
  if (module) {
    navigateTo('module', module.id)
  } else {
    navigateTo('dashboard')
  }
  return null
}

export default ResultPage
