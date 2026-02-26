import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "./redux/userSlice";
import Dashboard from "./components/Dashboard";

export const ServerUrl = "http://localhost:8000";

function App() {
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch()

  console.log(user);
  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/user/current-user", {
          withCredentials: true,
        });
        // console.log(result.data);
        dispatch(setUserData(result.data.user))
       
      } catch (error) {
        console.log("getUser Error ", error);
        dispatch(setUserData(null))
      }
    };

    getUser();
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/home" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}

export default App;
