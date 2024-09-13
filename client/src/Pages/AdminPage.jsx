import React, { useState } from 'react';
import axios from 'axios';
import './Css/AdminPage.css';

const AdminPage = () => {
  const [value, setValue] = useState('');
  const [link, setLink] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const correctPassword = ''; 

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setAuthenticated(true);
    } else {
      alert('Senha incorreta');
    }
  };

  const generateLink = async () => {
    try {
      const response = await axios.post('https://backend-delivery-mt.vercel.app/api/generate-link', { value });
      setLink(response.data.link);
    } catch (error) {
      console.error('Error generating link', error);
    }
  };

  return (
    <div className="admin-page">
      {!authenticated ? (
        <form onSubmit={handlePasswordSubmit}>
          <h1>Autenticação</h1>
          <label>
            Senha:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Entrar</button>
        </form>
      ) : (
        <>
          <h1>Página de Admin</h1>
          <label>
            Valor:
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </label>
          <button onClick={generateLink}>Gerar Link</button>
          {link && (
            <div>
              <p>Link gerado:</p>
              <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPage;
