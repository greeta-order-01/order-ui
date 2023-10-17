import React from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { NavLink } from 'react-router-dom'
import { Container, Dropdown, Menu } from 'semantic-ui-react'
import { isAdminFunc } from '../misc/Helpers'
import { getUsernameFunc } from '../misc/Helpers'

function Navbar(props) {
  const { keycloak } = useKeycloak()

  const handleLogInOut = () => {
    if (keycloak.authenticated) {
      props.history.push('/')
      keycloak.logout()
    } else {
      keycloak.login()
    }
  }

  const getLogInOutText = () => {
    return keycloak.authenticated ? "Logout" : "Login"
  } 
  
  const getAdminMenuStyle = () => {
    return keycloak.authenticated && isAdminFunc(keycloak) ? { "display": "block" } : { "display": "none" }
  }  

  const userPageStyle = () => {
    return keycloak.authenticated ? { "display": "block" } : { "display": "none" }
  }

  const getUsername = () => {
    return getUsernameFunc(keycloak)
  }  

  return (
    <Menu inverted color='violet' stackable size='massive' style={{borderRadius: 0}}>
      <Container>
        <Menu.Item header>Order-UI</Menu.Item>    
        <Menu.Item as={NavLink} exact='true' to="/">Home</Menu.Item>
        <Menu.Item as={NavLink} to="/adminpage" style={getAdminMenuStyle()}>AdminPage</Menu.Item>
        <Menu.Item as={NavLink} to="/userpage" style={userPageStyle()}>UserPage</Menu.Item>

        <Menu.Menu position='right'>
          {keycloak.authenticated &&
            <Dropdown text={`Hi ${getUsername()}`} pointing className='link item'>
              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/settings">Settings</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          }
          <Menu.Item as={NavLink} exact to="/login" onClick={handleLogInOut}>{getLogInOutText()}</Menu.Item>
        </Menu.Menu>        
      </Container>
    </Menu>
  )
}

export default NavLink(Navbar)
