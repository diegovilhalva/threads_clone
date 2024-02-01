import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
  } 
  from '@chakra-ui/react'
  import { useState } from 'react'
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import useShowToast from '../../hooks/useShowToast'
import userAtom from '../atoms/userAtom'


const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const setauthScreen =   useSetRecoilState(authScreenAtom)
    const setUser = useSetRecoilState(userAtom)
    const showToast = useShowToast()
    const [loading,setLoading] = useState(false)
    const [inputs,setInputs] = useState({
      userName:"",
      password:""
    })
    const handleLogin = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/users/login",{
          method:'POST',
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify(inputs),
        })
        const data = await res.json()
        if (data.error) {
          showToast("Erro",data.error,"error")
          return
        }
        localStorage.setItem("user-threads",JSON.stringify(data))
        setUser(data)


      } catch (error) {
        showToast("Erro",error,"error")
      }finally{
        setLoading(false)
      }
    }
  return (
    <Flex
    align={'center'}
    justify={'center'}
    >
    <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
      <Stack align={'center'}>
        <Heading fontSize={'4xl'} textAlign={'center'}>
        Fazer login
        </Heading>
        <Text fontSize={'lg'} color={'gray.600'}>
          bem vindo   ✌️
        </Text>
      </Stack>
      <Box
        rounded={'lg'}
        bg={useColorModeValue('gray.050', 'gray.700')}
        boxShadow={'lg'}
        p={8} 
        w={{
            base:"full",
            sm:"400px"
        }}>
        <Stack spacing={4}>
          <HStack>
            
            
              <FormControl isRequired>
                <FormLabel>Nome de usuário</FormLabel>
                <Input type="text" placeholder="ex: Batman100" onChange={(e) => setInputs({...inputs,userName:e.target.value})} value={inputs.userName} />
              </FormControl>
        
          </HStack>
          
          <FormControl isRequired>
            <FormLabel>Senha</FormLabel>
            <InputGroup>
              <Input type={showPassword ? 'text' : 'password'} onChange={(e) => setInputs({...inputs,password:e.target.value})} value={inputs.password} />
              <InputRightElement h={'full'}>
                <Button
                  variant={'ghost'}
                  onClick={() => setShowPassword((showPassword) => !showPassword)}>
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Stack spacing={10} pt={2}>
            <Button
              onClick={handleLogin}
              loadingText="Fazendo login..."
              size="lg"
              bg={useColorModeValue("gray.600","gray.900")}
              color={'white'}
              _hover={{
                bg: useColorModeValue("gray.700","gray.800"),
              }} isLoading={loading}>
              Entrar
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text align={'center'}>
              ainda não possui uma conta? <Link color={'blue.400'} onClick={() => setauthScreen("signup")}>Criar conta</Link>
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  </Flex>
  )
}

export default Login