import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './Css/SignupForm.css';
import { toast } from 'react-toastify';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
  });
  const [value, setValue] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const linkId = params.get('linkId');

    if (linkId) {
      // Busca o valor associado ao linkId do backend
      axios.get(`https://backend-delivery-mt.vercel.app/api/get-value?linkId=${linkId}`)
        .then(response => {
          setValue(response.data.value);
        })
        .catch(error => {
          console.error('Error fetching value', error);
        });
    }
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://backend-delivery-mt.vercel.app/api/signup', { ...formData, value });
      toast.success(response.data.message);
      navigate(`/payment?value=${encodeURIComponent(value)}`);
    } catch (error) {
      toast.error('Erro ao enviar e-mail.');
      console.error('Error submitting form', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nome:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <label>
        E-mail:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>
      <label>
        Endereço:
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
      </label>
      <label>
        Telefone:
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
      </label>
      <p>Valor: {value}</p>
      <button type="submit">Enviar</button>
    </form>
  );
};

export default SignupForm;
