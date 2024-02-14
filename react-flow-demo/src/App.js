// import ProtectedRoute from './components/protectedRoute'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewApp from './New-App';
import NoPage from "./NoPage";
import FirstPage from './FirstPage'
import ReactDOM from "react-dom/client";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="graph" element={<NewApp />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);