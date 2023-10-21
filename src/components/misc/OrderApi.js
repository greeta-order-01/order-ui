import axios from 'axios'
import { config } from '../../Constants'

export const orderApi = {
  numberOfUsers,
  numberOfOrders,
  getUsers,
  deleteUser,
  getOrders,
  deleteOrder,
  createOrder,
  getUserMe,
  isUserMeExists,
  saveUserMe
}

function numberOfUsers() {
  return instance.get('/order/public/numberOfUsers')
}

function numberOfOrders() {
  return instance.get('/order/public/numberOfOrders')
}

function getUsers(token, user) {
  const url = user ? `/order/users/${user}` : '/order/users'
  return instance.get(url, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

function deleteUser(token, user) {
  return instance.delete(`/order/users/${user}`, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

function getOrders(token, text) {
  const url = text ? `/order/?text=${text}` : '/order/'
  return instance.get(url, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

function deleteOrder(token, orderId) {
  return instance.delete(`/order/${orderId}`, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

function createOrder(token, order) {
  return instance.post('/order/', order, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}


function getUserMe(token) {
  return instance.get(`/order/users/me`, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

function isUserMeExists(token) {
  return instance.get(`/order/users/meExists`, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

function saveUserMe(token, userExtra) {
  return instance.post(`/order/users/me`, userExtra, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

// -- Axios

const instance = axios.create({
  baseURL: config.url.API_BASE_URL
})

instance.interceptors.response.use(response => {
  return response;
}, function (error) {
  if (error.response.status === 404) {
    return { status: error.response.status };
  }
  return Promise.reject(error.response);
});

// -- Helper functions

function bearerAuth(token) {
  return `Bearer ${token}`
}