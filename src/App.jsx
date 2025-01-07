import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateMove from './pages/CreateMoves';
import ShowMove from './pages/ShowMove';
import EditMove from './pages/EditMove';
import DeleteMove from './pages/DeleteMove';
import 'flowbite-react';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/moves/create' element={<CreateMove />} />
      <Route path='/moves/details/:id' element={<ShowMove />} />
      <Route path='/moves/edit/:id' element={<EditMove />} />
      <Route path='/moves/delete/:id' element={<DeleteMove />} />
    </Routes>
    // <div className='bg-red text-white'>app</div>
  );
};

export default App;