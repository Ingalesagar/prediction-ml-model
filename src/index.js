import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import MainApp from './components/MainApp'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
  </React.StrictMode>,
)
