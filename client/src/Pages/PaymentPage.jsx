import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const value = params.get('value');

  useEffect(() => {
    const createCheckoutSession = async () => {
      try {
        const response = await axios.post('https://backend-delivery-mt.vercel.app/api/create-checkout-session', { value });
        window.location.href = response.data.url; 
      } catch (error) {
        console.error('Error creating checkout session', error);
      }
    };

    createCheckoutSession();
  }, [value]);

  return (
    <div>
      <h1>Página de Pagamento</h1>
      <p>Você está sendo redirecionado para a página de pagamento...</p>
    </div>
  );
};

export default PaymentPage;
