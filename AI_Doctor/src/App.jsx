import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Nav from '../src/components/nav'
import Hero from './components/hero'
import Login_card from './components/login_card'
import Model_interface from './components/Model_interface'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from '../src/pages/Login'
import Signup from './pages/signup'
import Dashboard from './pages/dashboard'
const router = createBrowserRouter([
  {
    path: '/',
    element: (<div>
      <Nav />
      <Hero />
      <Login_card />
    </div>)
  },
  {
    path: '/demo',
    element: <div>
      <Model_interface />
    </div>

  },
  {
    path: '/login',
    element: <div>
      <Login/>
    </div>
  },
  {
    path:'/signup',
    element: <div>
      <Signup/>
    </div>
  },
  {
    path:'/dashboard',
    element: <div>
      <Dashboard/>
    </div>
  }
])
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
