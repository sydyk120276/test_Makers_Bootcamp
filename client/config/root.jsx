import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import { Provider } from 'react-redux'

import store from '../redux'
import Startup from './startup'
import Main from '../components/main'
import Login from '../components/login'
import News from '../components/news'
import Profile from '../components/profile'

const Root = () => {
  return (
    <Provider store={store}>
      <Startup>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/news" element={<News />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </Startup>
    </Provider>
  )
}

export default Root
