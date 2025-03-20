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
import NotFoundScreen from './screen/NotFoundScreen.jsx'
import HomeScreen from './screen/HomeScreen.jsx'
import LoginScreen from './screen/LoginScreen.jsx'
import AdminQAQACRoute from "./components/AdminQAQACRoute.jsx"
import AdminOrQAManagerRoute from './components/AdminOrQAManagerRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import QAManagerRoute from './components/QAManagerRoute.jsx'
import QACRoute from './components/QACRoute.jsx'
import AdminRegisterScreen from "./screen/AdminAndQA/AdminRegisterScreen.jsx"
import QARegisterScreen from './screen/AdminAndQA/QARegisterScreen.jsx'
import QACRegisterScreen from './screen/QAC/QACRegisterScreen.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import CreateIdeaScreen from './screen/CreateIdeaScreen.jsx'
import DepartmentListScreen from './screen/AdminAndQA/DepartmentListScreen.jsx'
import CategoryListScreen from './screen/AdminAndQA/CategoryListScreen.jsx'
import AddCategory from './screen/AdminAndQA/AddCategory.jsx'
import EditCategory from './screen/AdminAndQA/EditCategory.jsx'
import AddDepartment from './screen/AdminAndQA/AddDepartment.jsx'
import EditDepartment from './screen/AdminAndQA/EditDepartment.jsx'
import GetAllUserScreen from './screen/AdminAndQA/GetAllUserScreen.jsx'
import GetAllUserForQAScreen from './screen/AdminAndQA/GetAllUserForQAScreen.jsx'
import GetAllUserForQACScreen from './screen/QAC/GetAllUserQACScreen.jsx'
import GetUserDetail from './screen/AdminAndQA/GetUserDetail.jsx'
import SingleIdeaScreen from './screen/SingleIdeaScreen.jsx'
import PopularIdeaScreen from './screen/PopularIdeaScreen.jsx'
import DislikeIdeaScreen from './screen/DislikeIdeaScreen.jsx'
import IdeaScreen from './screen/IdeaScreen.jsx'

import ProfileScreen from './screen/ProfileScreen.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}> 
        <Route path='/' index='true' element={<HomeScreen/>}/>
        <Route path='/login' element={<LoginScreen/>}/>
        <Route path="*" element={<NotFoundScreen />} />

        {/* Admin and QA Manager Routes */}
        <Route element={<AdminOrQAManagerRoute/>}> 
          <Route path='/categories' element={<CategoryListScreen/>}/>
          <Route path='/addCategory' element={<AddCategory/>}/>
          <Route path='/editCategory/:id' element={<EditCategory />} />
          <Route path='/departments' element={<DepartmentListScreen/>}/>
          <Route path='/addDepartment' element={<AddDepartment/>}/>
          <Route path='/editDepartment/:id' element={<EditDepartment />} />
          <Route path='/users' element={<GetAllUserScreen/>}/>
      </Route>

      {/* Admin , QA Manager , QA Coordinator Routes */}
      <Route element={<AdminQAQACRoute/>}>
        <Route path='/user/:id' element={<GetUserDetail/>}/>
      </Route>

       {/* Admin Routes */}
      <Route element={<AdminRoute/>}>
          <Route path='/admin/register' element={<AdminRegisterScreen/>}/>
          <Route path='/admin/users' element={<GetAllUserScreen/>}/>
      </Route>

      {/* QA Manager Routes */}
      <Route element={<QAManagerRoute/>}>
         <Route path='/QA/register' element={<QARegisterScreen/>}/>
          <Route path='/qa/users' element={<GetAllUserForQAScreen/>}/>
      </Route>
    
    {/* QA Coordinator Routes */}
      <Route element={<QACRoute/>}>
      <Route path='/QAC/register' element={<QACRegisterScreen/>}/>
        <Route path='/QAC/users' element={<GetAllUserForQACScreen/>}/>
      </Route>
     
      <Route element={<PrivateRoute/>}>
        <Route path='/profile' element={<ProfileScreen/>}/>
        <Route path='/ideas/create' element={<CreateIdeaScreen/>}/>
        <Route path='/ideas' element={<IdeaScreen/>}/>
        <Route path='/ideas/popular' element={<PopularIdeaScreen/>}/>
        <Route path='/ideas/dislike' element={<DislikeIdeaScreen/>}/>
        <Route path='/ideas/:ideaId' element={<SingleIdeaScreen/>}/>
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
