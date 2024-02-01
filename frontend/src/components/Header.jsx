import { Button, Flex, Image, Link, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { AiFillHome } from "react-icons/ai"
import { RxAvatar } from "react-icons/rx"
import {Link as RouterLink} from "react-router-dom"
import { FiLogOut } from 'react-icons/fi'
import useLogout from '../../hooks/useLogout'
import authScreenAtom from '../atoms/authAtom'
const Header = () => {
 const {colorMode,toggleColorMode} =  useColorMode()
 const user = useRecoilValue(userAtom)
 const logout = useLogout()
 const setauthScreen = useSetRecoilState(authScreenAtom)
  return (
    <Flex justifyContent={'space-between'} mt={6} mb={12}>
      {user && (
        <Link as={RouterLink} to={'/'}>
          <AiFillHome size={24}/>
        </Link>
      )}
      {!user && (
        <Link as={RouterLink} onClick={() => setauthScreen('login')}>
          Login
        </Link>
      )}
       <Image  cursor={'pointer'} alt='logo' src={colorMode === 'dark' ? '/light-logo.svg' :  '/dark-logo.svg'} w={6} onClick={toggleColorMode}/>
      {user &&  (
        <Flex alignItems={'center'} gap={4}>
            <Link as={RouterLink} to={`/${user.userName}`}>
          <RxAvatar size={24} />
        </Link>
        <Button size={'xs'} onClick={logout} ><FiLogOut size={20}/></Button>
        </Flex>)}

        {!user && (
        <Link as={RouterLink} onClick={() => setauthScreen('signup')}>
          Criar conta
        </Link>
      )}
    </Flex>
  )
}

export default Header