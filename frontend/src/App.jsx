import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

// 懒加载组件
const Home = lazy(() => import('./views/Home'))
const Login = lazy(() => import('./views/Login'))
const Register = lazy(() => import('./views/Register'))
const BookDetail = lazy(() => import('./views/BookDetail'))
const Publish = lazy(() => import('./views/Publish'))
const Category = lazy(() => import('./views/Category'))
const Search = lazy(() => import('./views/Search'))
const Orders = lazy(() => import('./views/Orders'))
const OrderDetail = lazy(() => import('./views/OrderDetail'))
const OrderCreate = lazy(() => import('./views/OrderCreate'))
const Address = lazy(() => import('./views/Address'))
const Profile = lazy(() => import('./views/Profile'))

// 加载状态组件
const LoadingComponent = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'var(--bg-primary)'
  }}>
    <div style={{
      textAlign: 'center',
      padding: 'var(--spacing-8)',
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <div style={{
        width: 60,
        height: 60,
        margin: '0 auto var(--spacing-4)',
        border: '4px solid var(--bg-tertiary)',
        borderTop: '4px solid var(--primary-color)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <div style={{
        fontSize: 'var(--text-lg)',
        color: 'var(--text-secondary)'
      }}>
        加载中...
      </div>
    </div>
  </div>
)

function App() {
  return (
    <Suspense fallback={<LoadingComponent />}>
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
    </Suspense>
  )
}

export default App
