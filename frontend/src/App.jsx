import { useState, useEffect } from "react";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import Notifications from "./components/Notifications";

function App() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("lefpayroll_user");

    if (storedUser) {
      setAuthUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (user) => {
    setAuthUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("lefpayroll_token");
    localStorage.removeItem("lefpayroll_user");
    setAuthUser(null);
  };

  if (!authUser) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Notifications />
      </>
    );
  }

  return (
    <>
      <MainLayout authUser={authUser} onLogout={handleLogout} />
      <Notifications />
    </>
  );
}

export default App;