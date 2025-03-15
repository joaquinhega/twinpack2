import Login from "./components/Login"
import Register from "./components/Register";
import {Switch,Route, HashRouter} from "react-router-dom"
import Dashboard from "./components/Dashboard";
import Recover from "./components/Recover";
import RegisterPassword from "./components/RegisterPassword";
import RegisterConfirmation from "./components/RegisterConfirmation";
import {CounterProvider} from "./contexts/CounterContext";
import {CartProvider} from "./contexts/CartContext";
import {PaginationProvider} from "./contexts/PaginationContext";
import {UserProvider} from "./contexts/UserContext";
import {ToastContainer,Zoom} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '@padawanstrainer/select-multiple'

function App() {
  return (
      <UserProvider>
          <CounterProvider>
              <CartProvider>
                  <PaginationProvider>
                      <div className="App">
                          <>
                              <ToastContainer transition={Zoom}/>
                          </>
                          <HashRouter basename="/sistema/">
                              <Switch>
                                  <Route exact path="/">
                                      <Login/>
                                  </Route>
                                  <Route path="/register">
                                      <Register/>
                                  </Route>
                                  <Route path="/password/">
                                      <RegisterPassword/>
                                  </Route>
                                  <Route path="/confirm/">
                                      <RegisterConfirmation/>
                                  </Route>
                                  <Route path="/dashboard">
                                      <Dashboard/>
                                  </Route>
                                  <Route path="/recover">
                                      <Recover/>
                                  </Route>
                              </Switch>
                          </HashRouter>
                      </div>
                  </PaginationProvider>
              </CartProvider>
          </CounterProvider>
      </UserProvider>
  );
}

export default App;
