import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter ,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './store.js'
import './assets/styles/bootstrap.custom.css'
import './assets/styles/index.css'
import App from './App.jsx'
import HomeScreen from './screen/HomeScreen.jsx'
import LoginScreen from './screen/LoginScreen.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import RegisterScreen from './screen/RegisterScreen.jsx'
import GetAllUser from './screen/GetAllUser.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}> 
        <Route path='/' index='true' element={<HomeScreen/>}/>
        <Route path='/login' element={<LoginScreen/>}/>
        <Route path='/register' element={<RegisterScreen/>}/>

        <Route element={<PrivateRoute/>}> 
          <Route path='/getalluser' element={<GetAllUser/>}/>
      </Route>

    </Route>

  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
