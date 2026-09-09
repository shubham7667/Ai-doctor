import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  const [googleLoginStarted, setGoogleLoginStarted] = useState(false)

  const startGoogleLogin = (event) => {
    event.preventDefault()
    if (googleLoginStarted) return

    setGoogleLoginStarted(true)
    window.location.assign('http://localhost:8000/auth/google/login')
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-4">

      <div className="w-full max-w-[600px] min-h-[500px] bg-white rounded-3xl shadow-xl flex items-center justify-center ">

        <div className="w-full max-w-[450px] p-8 ">

          <h1 className="text-4xl font-bold text-center mb-8">
            Login
          </h1>

          <div className="mb-5">
            <label className="block text-left font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full h-[45px] px-4 border border-gray-300 rounded-lg outline-none focus:border-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-left font-semibold mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full h-[45px] px-4 border border-gray-300 rounded-lg outline-none focus:border-indigo-500"
            />
          </div>

          <button
            className="w-full h-[45px] bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Login
          </button>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <a
              href="http://localhost:8000/auth/google/login"
              onClick={startGoogleLogin}
              aria-disabled={googleLoginStarted}
              className="text-indigo-600 underline font-semibold"
            >
              {googleLoginStarted ? 'Opening Google...' : 'Login using Google'}
            </a>
          </p>

        </div>

      </div>

    </div>
  )
}

export default Login