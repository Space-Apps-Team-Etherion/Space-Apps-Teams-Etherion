import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Test from './test';
import Home from './Home';
Home


function MainRoutes({ mode }) {
    return (
        <Routes>
            <Route path='/' element={<Home mode ={mode}/>} />
            <Route path='/test' element={<Test mode ={mode}/>} />
        </Routes>
    )
}

export default MainRoutes
