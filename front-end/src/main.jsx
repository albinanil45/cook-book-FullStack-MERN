import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter } from 'react-router-dom'
import { RecipeProvider } from './context/RecipeContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { FavouriteProvider } from './context/FavouriteContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <RecipeProvider>
          <FavouriteProvider>
            <App />
          </FavouriteProvider>
        </RecipeProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
