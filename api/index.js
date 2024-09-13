const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');

const app = express();

const linkDatabase = {};

app.use(cors({
  origin: process.env.NEXT_PUBLIC_BASE_URL, // URL do frontend no Vercel
}));

app.use(bodyParser.json());

// Configura o transporte de e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.EMAIL_PASSWORD,  
  },
});

// Endpoint para receber os dados do formulário e enviar o e-mail
app.post('/api/signup', async (req, res) => {
  const { name, email, address, phone, value } = req.body;
  const serviceCode = Math.random().toString(36).substring(2, 15);

  try {
    await transporter.sendMail({
      from: email,
      to: 'nathannssilva12@gmail.com',
      subject: 'Novo Cadastro',
      text: `Nome: ${name}\nE-mail: ${email}\nEndereço: ${address}\nTelefone: ${phone}\nCódigo de Serviço: ${serviceCode}\nValor: ${value}`,
    });

    res.json({ message: 'Cadastro efetuado com sucesso!' });
  } catch (error) {
    console.error('Error sending email', error);
    res.status(500).json({ message: 'Erro ao enviar e-mail.' });
  }
});

// Endpoint para gerar um link sem expor o valor diretamente
app.post('/api/generate-link', (req, res) => {
  const { value } = req.body;
  if (!value) {
    return res.status(400).json({ message: 'Valor não fornecido.' });
  }

  const linkId = uuidv4(); 
  linkDatabase[linkId] = value; 

  const link = `url/signup?linkId=${linkId}`;
  res.json({ link });
});

// Endpoint para buscar o valor associado ao linkId
app.get('/api/get-value', (req, res) => {
  const { linkId } = req.query;
  const value = linkDatabase[linkId];

  if (!value) {
    return res.status(404).json({ message: 'Link inválido ou expirado.' });
  }

  res.json({ value });
});

// Endpoint para criar uma sessão de checkout do Stripe
app.post('/api/create-checkout-session', async (req, res) => {
  const { value } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: {
            name: 'Serviço de Cadastro',
          },
          unit_amount: value * 100, 
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session', error);
    res.status(500).json({ message: 'Erro ao criar sessão de checkout.' });
  }
});

app.listen(4000, () => {
  console.log('Servidor iniciado na porta 4000');
});
