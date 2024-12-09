import React, {createContext, useState, useContext, useEffect} from 'react'

  const AuthContext = createContext();

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
      const storedUser = localStorage.getItem('user');
      return storedUser ? storedUser : null;
    })
    const [data, setData] = useState([])
    const [del, setDel] = useState(false)

    const login = () => {
      const items = JSON.parse(localStorage.getItem('user'))
      if(items){
        setUser(items.username)
        setData(items)
      }
    }

    useEffect(() => {
      login()
    }, [])

    const logout = () => {
      localStorage.removeItem('user')
      setUser(null)
    }

    // const isAuthenticated = user
    return(
      <AuthContext.Provider value={{login, user, data, logout, del, setDel}}>
        {children}
      </AuthContext.Provider>
    )
  } 

  export const useAuth = () => {
    return useContext(AuthContext)
  }
  
  export const changePass = createContext(false)
