import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client"

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {withCredentials: true})

    newSocket.on("connect", () => console.log("Socket conectado:", newSocket.id))
    setSocket(newSocket)

    return () => {
      newSocket.disconnect();
      console.log("Socket desconectado")
    }
  }, [])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}