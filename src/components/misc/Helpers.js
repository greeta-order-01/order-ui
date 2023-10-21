export const getKeycloak = () => {
  return JSON.parse(localStorage.getItem('keycloak'))
}

export function parseJwt(token) {
  if (!token) { return }
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(window.atob(base64))
}

export const isAdminFunc = (keycloak) => {
  return keycloak && 
         keycloak.tokenParsed &&
         keycloak.tokenParsed.resource_access['order-app'] &&
         keycloak.tokenParsed.resource_access['order-app'].roles.includes('ORDER_MANAGER')
}

export const getUsernameFunc = (keycloak) => {
  return keycloak.tokenParsed.preferred_username
}

export const isUserFunc = (keycloak) => {
  return keycloak && 
         keycloak.tokenParsed &&
         keycloak.tokenParsed.resource_access['order-app'] &&
         keycloak.tokenParsed.resource_access['order-app'].roles.includes('ORDER_USER')
}

export const handleLogError = (error) => {
  if (error.response) {
    console.log(error.response.data);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log(error.message);
  }
}