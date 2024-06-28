import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import App  from './App';
import { ContextProvider } from './contexts/ContextProvider';
// import { BrowserRouter, Route } from 'react-router-dom';
// import Login from './pages/Login';

ReactDOM.render(
    
    <ContextProvider>
        
        <App />
    </ContextProvider>,


document.getElementById('root'));