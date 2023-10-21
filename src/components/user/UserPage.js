import React, { Component } from 'react'
import { isUserFunc } from '../misc/Helpers'
import { Navigate } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import OrderTable from './OrderTable'
import { orderApi } from '../misc/OrderApi'
import { handleLogError } from '../misc/Helpers'
import { getKeycloak } from '../misc/Helpers'

class UserPage extends Component {

  state = {
    token: null,
    userMe: null,
    isUser: true,
    isLoading: false,
    orderDescription: ''
  }

  componentDidMount() {
    const  keycloak = getKeycloak()
    const isUser = isUserFunc(keycloak)
    const token = keycloak.token
    this.state.token = token
    this.state.isUser = isUser

    this.handleGetUserMe()
  }

  handleInputChange = (e, {name, value}) => {
    this.setState({ [name]: value })
  }

  handleGetUserMe = () => {
    const token = this.state.token
    this.setState({ isLoading: true })
    orderApi.getUserMe(token)
      .then(response => {
        this.setState({ userMe: response.data })
      })
      .catch(error => {
        handleLogError(error)
      })
      .finally(() => {
        this.setState({ isLoading: false })
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
        this.handleGetUserMe()
        this.setState({ orderDescription: '' })
      })
      .catch(error => {
        handleLogError(error)
      })
  }

  render() {
    if (!this.state.isUser) {
      return <Navigate to='/' />
    } else {
      const { userMe, isLoading, orderDescription } = this.state
      return (
        <Container>
          <OrderTable
            orders={userMe && userMe.orders}
            isLoading={isLoading}
            orderDescription={orderDescription}
            handleCreateOrder={this.handleCreateOrder}
            handleInputChange={this.handleInputChange}
          />
        </Container>
      )
    }
  }
}

export default UserPage