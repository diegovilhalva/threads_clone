import { useRecoilValue } from "recoil"
import Login from "../components/Login"
import Signup from "../components/Signup"

import authScreenAtom from "../atoms/authAtom"

const AuthPage = () => {
   const authScreenState = useRecoilValue(authScreenAtom)
  return (
    <>
      {authScreenState === 'login' ? <Login/> : <Signup/>}
    </>
  )
  }

export default AuthPage