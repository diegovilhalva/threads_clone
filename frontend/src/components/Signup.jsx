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

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false)
    const setauthScreen =   useSetRecoilState(authScreenAtom)
    const [inputs,setInputs] = useState({
        name:"",
        userName:"",
        email:"",
        password:""
    })
    const showToast = useShowToast()
   const setUser = useSetRecoilState(userAtom)
    const handleSignup =  async () => {
        try {
            const res = await fetch("/api/users/signup",{
                method:'POST',
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify(inputs)

            })
            const data = await res.json()
            if(data.error){
               showToast("Erro",data.error,"error")
               return;
            }
            localStorage.setItem("user-threads",JSON.stringify(data))
            setUser(data)
        } catch (error) {
          showToast("Erro",error,"error")
            console.log(error)
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
          Criar conta
        </Heading>
        <Text fontSize={'lg'} color={'gray.600'}>
          fique antenado em tudo em que se passa  ✌️
        </Text>
      </Stack>
      <Box
        rounded={'lg'}
        bg={useColorModeValue('gray.050', 'gray.700')}
        boxShadow={'lg'}
        p={8}>
        <Stack spacing={4}>
          <HStack>
            <Box>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input type="text" onChange={(e) => setInputs({...inputs,name:e.target.value})} value={inputs.name} />
              </FormControl>
            </Box>
            <Box>
              <FormControl isRequired>
                <FormLabel>Nome de usuário</FormLabel>
                <Input type="text" placeholder="ex: Batman100" onChange={(e) => setInputs({...inputs,userName:e.target.value})} value={inputs.userName} />
              </FormControl>
            </Box>
          </HStack>
          <FormControl isRequired>
            <FormLabel>Email </FormLabel>
            <Input type="email" onChange={(e) => setInputs({...inputs,email:e.target.value})} value={inputs.email} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Senha</FormLabel>
            <InputGroup>
              <Input type={showPassword ? 'text' : 'password'} onChange={(e) => setInputs({...inputs,password:e.target.value})} />
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
              loadingText="Submitting"
              size="lg"
              bg={useColorModeValue("gray.600","gray.900")}
              color={'white'}
              _hover={{
                bg: useColorModeValue("gray.700","gray.800"),
              }} onClick={handleSignup}>
              Entrar
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text align={'center'}>
              Já possui uma conta? <Link color={'blue.400'} onClick={() => setauthScreen("login")}>Fazer Login</Link>
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  </Flex>
  )
}

export default Signup