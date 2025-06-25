import { useRecoilValue } from "recoil";
import { Navigate } from "react-router-dom";
import { isLoggedInAtom } from "../store/atoms/Auth";

export const PrivateRoute = ({ children }) => {
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  console.log(isLoggedIn);
  

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};
