import { useState, useCallback } from 'react'
import './App.css'
import Header from './components/Header'
import Swap from './components/Swap'
import Tokens from './components/Tokens'
import {Routes, Route} from 'react-router-dom'
import { injected } from 'wagmi/connectors'
import {  useConnect, useAccount } from 'wagmi'

function App() {
  const { connect } = useConnect()
  const { address, isConnected } = useAccount()

  const connectToMetaMask = useCallback(() => {
    connect({ connector: injected({ target: 'metaMask' }) })
  }, [connect])

  return (
    <div className="App">
      <Header connect={connectToMetaMask} address={address} isConnected={isConnected} />
      <div className='mainWindow'>
        <Routes>
          <Route path="/" element={<Swap address={address} isConnected={isConnected} />} />
          <Route path="/tokens" element={<Tokens/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App