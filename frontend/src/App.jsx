import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Container } from "react-bootstrap"
import { Outlet } from "react-router-dom"
import Header from "./components/Header"

const App = () => {
  return (
    <>
    <Header/>
      <main className="py-3" >
        <Container>
        <Outlet/>
     </Container>

    </main>
    <ToastContainer/>
  </>
  )
}

export default App