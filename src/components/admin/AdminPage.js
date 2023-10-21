import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import { isAdminFunc } from '../misc/Helpers'
import { orderApi } from '../misc/OrderApi'
import AdminTab from './AdminTab'
import { handleLogError } from '../misc/Helpers'
import { getKeycloak } from '../misc/Helpers'


class AdminPage extends Component {

  state = {
    token: null,
    users: [],
    orders: [],
    orderDescription: '',
    orderTextSearch: '',
    userUsernameSearch: '',
    isAdmin: true,
    isUsersLoading: false,
    isOrdersLoading: false,
  }

 componentDidMount() {
    const  keycloak = getKeycloak()
    const isAdmin = isAdminFunc(keycloak)
    this.state.token = keycloak.token
    this.state.isAdmin = isAdmin

    this.handleGetUsers()
    this.handleGetOrders()
  }

  handleInputChange = (e, {name, value}) => {
    this.setState({ [name]: value })
  }

  handleGetUsers = () => {
    const token = this.state.token
    this.setState({ isUsersLoading: true })
    orderApi.getUsers(token)
      .then(response => {
        this.setState({ users: response.data })
      })
      .catch(error => {
        handleLogError(error)
      })
      .finally(() => {
        this.setState({ isUsersLoading: false })
      })
  }

  handleDeleteUser = (username) => {
    const token = this.state.token

    orderApi.deleteUser(token, username)
      .then(() => {
        this.handleGetUsers()
      })
      .catch(error => {
        handleLogError(error)
      })
  }

  handleSearchUser = () => {
    const token = this.state.token

    const username = this.state.userUsernameSearch
    orderApi.getUsers(token, username)
      .then(response => {
        const data = response.data
        const users = data ? (data instanceof Array ? data : [data]) : [];
        this.setState({ users })
      })
      .catch(error => {
        handleLogError(error)
        this.setState({ users: [] })
      })
  }

  handleGetOrders = () => {
    const token = this.state.token

    this.setState({ isOrdersLoading: true })
    orderApi.getOrders(token)
      .then(response => {
        this.setState({ orders: response.data })
      })
      .catch(error => {
        handleLogError(error)
      })
      .finally(() => {
        this.setState({ isOrdersLoading: false })
      })
  }

  handleDeleteOrder = (isbn) => {
    const token = this.state.token

    orderApi.deleteOrder(token, isbn)
      .then(() => {
        this.handleGetOrders()
      })
      .catch(error => {
        handleLogError(error)
      })
  }

  handleCreateOrder = () => {
    const token = this.state.token

    let { orderDescription } = this.state
    orderDescription = orderDescription.trim()
    if (!orderDescription) {
      return
    }

    const order = { description: orderDescription }
    orderApi.createOrder(token, order)
      .then(() => {
        this.handleGetOrders()
        this.setState({ orderDescription: '' })
      })
      .catch(error => {
        handleLogError(error)
      })
  }

  handleSearchOrder = () => {
    const token = this.state.token

    const text = this.state.orderTextSearch
    orderApi.getOrders(token, text)
      .then(response => {
        const orders = response.data
        this.setState({ orders })
      })
      .catch(error => {
        handleLogError(error)
        this.setState({ orders: [] })
      })
  }

  render() {
    if (!this.state.isAdmin) {
      return <Navigate to='/' />
    } else {
      const { isUsersLoading, users, userUsernameSearch, isOrdersLoading, orders, orderDescription, orderTextSearch } = this.state
      return (
        <Container>
          <AdminTab
            isUsersLoading={isUsersLoading}
            users={users}
            userUsernameSearch={userUsernameSearch}
            handleDeleteUser={this.handleDeleteUser}
            handleSearchUser={this.handleSearchUser}
            isOrdersLoading={isOrdersLoading}
            orders={orders}
            orderDescription={orderDescription}
            orderTextSearch={orderTextSearch}
            handleCreateOrder={this.handleCreateOrder}
            handleDeleteOrder={this.handleDeleteOrder}
            handleSearchOrder={this.handleSearchOrder}
            handleInputChange={this.handleInputChange}
          />
        </Container>
      )
    }
  }
}

export default AdminPage