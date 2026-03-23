// import './App.css'
import './styles/variables.css'
import './styles/base.css'
import './styles/background-elements.css'
import './styles/components.css'
import './styles/reset.css'
import { Route, Routes } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Survey from './pages/Survey'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import Settings from './pages/Settings'
import SurveySuccess from './pages/SurveySuccess'
import Results from './pages/Results'
function App() {

  return (
    <div className='App'>
      <Navigation />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/survey' element={<Survey />} />
        <Route path='/survey/success' element={<SurveySuccess />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/account' element={<Account />} />
        <Route path='/account/settings' element={<Settings />} />
        <Route path='/results' element={<Results />} />
      </Routes>
    </div>
  )
}

export default App
