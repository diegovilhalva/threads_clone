import React from 'react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../src/atoms/userAtom'
import useShowToast from './useShowToast'

const useLogout = () => {
    const setUser = useSetRecoilState(userAtom)
    const showToast = useShowToast()
    const Logout = async () => {
        try {
           
            const res = await fetch("/api/users/logout",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },

                
            })
            const data = await res.json()
            if(data.error){
                showToast("Erro",data.error,"error")
                return
            }
            localStorage.removeItem('user-threads')
            setUser(null)  
        } catch (error) {
            
        }
    }

    return Logout
}

export default useLogout