const prod = {
  url: {
    KEYCLOAK_BASE_URL: "https://keycloak.greeta.net",    
    API_BASE_URL: 'https://api.greeta.net',
  }
}

const dev = {
  url: {
    KEYCLOAK_BASE_URL: "http://localhost:8080",    
    API_BASE_URL: 'http://localhost:8080'
  }
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod