import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupForm from './Pages/SignupForm';
import AdminPage from './Pages/AdminPage';
import PaymentPage from './Pages/PaymentPage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/payment" element={<PaymentPage />} />
    </Routes>
  </Router>
);

export default App;
