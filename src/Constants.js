const prod = {
  url: {
    KEYCLOAK_BASE_URL: "https://keycloak.greeta.net",        
    API_BASE_URL: 'https://orderapi.greeta.net'
  }
}

const dev = {
  url: {
    KEYCLOAK_BASE_URL: "http://localhost:8080",      
    API_BASE_URL: 'http://localhost:9080'
  }
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod