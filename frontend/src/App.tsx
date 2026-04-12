import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './app/DashboardPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
