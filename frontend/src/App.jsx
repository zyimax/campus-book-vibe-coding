import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './views/Home'
import Login from './views/Login'
import Register from './views/Register'
import BookDetail from './views/BookDetail'
import Publish from './views/Publish'
import Category from './views/Category'
import Search from './views/Search'
import Orders from './views/Orders'
import OrderDetail from './views/OrderDetail'
import OrderCreate from './views/OrderCreate'
import Address from './views/Address'
import Profile from './views/Profile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="book/:id" element={<BookDetail />} />
        <Route path="publish" element={<Publish />} />
        <Route path="category/:type" element={<Category />} />
        <Route path="search" element={<Search />} />
        <Route path="orders" element={<Orders />} />
        <Route path="order/create" element={<OrderCreate />} />
        <Route path="order/:id" element={<OrderDetail />} />
        <Route path="address" element={<Address />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
