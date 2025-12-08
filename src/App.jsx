import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { AppHeader } from './cmps/AppHeader.jsx'
import { ToyIndex } from './pages/ToyIndex.jsx'
import { ToyEdit } from './pages/ToyEdit.jsx'
import { ToyDetails } from './pages/ToyDetails.jsx'
import { HomePage } from './pages/Home.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <section className="app">
      <AppHeader />
      <main className="main-layout">

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/toy" element={<ToyIndex />} />
          <Route path="/toy/edit/:toyId" element={<ToyEdit />} />
          <Route path="/toy/:toyId" element={<ToyDetails />} />
        </Routes>

      </main>
    </section>
  )
}

export default App
