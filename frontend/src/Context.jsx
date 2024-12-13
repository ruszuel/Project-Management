import axios from 'axios';
import React, {createContext, useState, useContext, useEffect} from 'react'

  const AuthContext = createContext();
  const TaskContext = createContext({
    newTask: false,
    setNewTask: () => {},
  });

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
      const storedUser = JSON.parse(localStorage.getItem('user'))
      return storedUser ? storedUser.username : null;
    })

    const [data, setData] = useState({});
    const [del, setDel] = useState(false)
    
    const login = async () => {
      const items = JSON.parse(localStorage.getItem('user'));
      
      if (items) {
        setUser(items.username);
        
        try {
          const res = await axios.post('http://127.0.0.1:8000/api/profile', {
            username: items.username,
          });
          setData(res.data);
          console.log(res.data)
        } catch (error) {
          console.error(error);
        }
      }
    };
    

    useEffect(() => {
      login()
    }, [])

    const logout = () => {
      localStorage.removeItem('user')
      setUser(null)
    }

    return(
      <AuthContext.Provider value={{login, user, data, logout, del, setDel}}>
        {children}
      </AuthContext.Provider>
    )
  } 

  export const useAuth = () => {
    return useContext(AuthContext)
  }
  
export const TaskProvider = ({children}) => {
  
  const [project, setProject] = useState('')

  return (
    <TaskContext.Provider value={{project, setProject}}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTask = () => {
  return useContext(TaskContext)
}
