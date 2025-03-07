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
import RegisterScreen from './screen/RegisterScreen.jsx'
import AdminRegisterScreen from "./screen/AdminRegisterScreen.jsx"
import QARegisterScreen from './screen/QARegisterScreen.jsx'
import QACRegisterScreen from './screen/QACRegisterScreen.jsx'
import GetAllUserScreen from './screen/GetAllUserScreen.jsx'
import AdminOrQAManagerRoute from './components/AdminOrQAManagerRoute.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import IdeasScreen from './screen/IdeasScreen.jsx'
import DepartmentIdeaScreen from './screen/DepartmentIdeaScreen.jsx'
import CategoryListScreen from './screen/CategoryListScreen.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}> 
        <Route path='/' index='true' element={<HomeScreen/>}/>
        <Route path='/login' element={<LoginScreen/>}/>
        <Route path='/register' element={<RegisterScreen/>}/>
        <Route path='/admin/register' element={<AdminRegisterScreen/>}/>
        <Route path='/QA/register' element={<QARegisterScreen/>}/>
        <Route path='/QAC/register' element={<QACRegisterScreen/>}/>

        <Route element={<AdminOrQAManagerRoute/>}> 
          <Route path='/getalluser' element={<GetAllUserScreen/>}/>
          <Route path='/categories' element={<CategoryListScreen/>}/>
      </Route>
      
      <Route element={<PrivateRoute/>}>
        <Route path='/ideas' element={<IdeasScreen/>}/>
        <Route path="/department/:id/ideas" element={<DepartmentIdeaScreen />} />
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
