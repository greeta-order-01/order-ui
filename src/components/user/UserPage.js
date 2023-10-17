import React, { Component } from 'react'
import { isUserFunc } from '../misc/Helpers'
import { Navigate } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import OrderTable from './OrderTable'
import { orderApi } from '../misc/OrderApi'
import { handleLogError } from '../misc/Helpers'

class UserPage extends Component {

  state = {
    user: null,
    userMe: null,
    isUser: true,
    isLoading: false,
    orderDescription: ''
  }

  async componentDidMount() {
    const { keycloak } = this.props
    const isUser = isUserFunc(keycloak)
    try {
      const response = await orderApi.getUserExtrasMe(keycloak.token)
      const { user } = response.data
      this.setState({ user, isUser })
    } catch (error) {
      handleLogError(error)
    }

    this.handleGetUserMe()
  }

  handleInputChange = (e, {name, value}) => {
    this.setState({ [name]: value })
  }

  handleGetUserMe = () => {
    const user = this.state.user

    this.setState({ isLoading: true })
    orderApi.getUserMe(user)
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
    const user = this.state.user

    let { orderDescription } = this.state
    orderDescription = orderDescription.trim()
    if (!orderDescription) {
      return
    }

    const order = { description: orderDescription }
    orderApi.createOrder(user, order)
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