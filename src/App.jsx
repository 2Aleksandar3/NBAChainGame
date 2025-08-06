import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Multiplayer from "./pages/MultiPlayer";
import SinglePlayer from "./pages/SinglePlayer";
import TestTurns from "./pages/TestTurns";
import "./App.css";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Router basename="/NBAChainGame">
        <Routes>
          <Route path="/" element={<SinglePlayer />} />
          <Route path="/multiplayer" element={<Multiplayer />} />
          <Route path="/test" element={<TestTurns />} />
        </Routes>
      </Router>
      <ToastContainer
        limit={2}
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        pauseOnHover={true}
        draggable={true}
        theme="colored"
        transition={Bounce}
      />
    </>
  );
};

export default App;
