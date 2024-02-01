import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,   
    Center,
  } from '@chakra-ui/react'

import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { useRef, useState } from 'react'
import usePreviewImage from '../../hooks/usePreviewImage'
import useShowToast from '../../hooks/useShowToast'

const UpdateProfilePage = () => {
  const  [user,setUser] = useRecoilState(userAtom) 
  const [inputs,setInputs] = useState({
    name:user.name,
    userName:user.userName,
    email:user.email,
    bio:user.bio,
    password:""
  })

  const fileRef = useRef(null)
  const [updating, setUpdating] = useState(false);
  const {handleImageChange,imgUrl} = usePreviewImage()
  const showToast = useShowToast()

  const handleSubmit = async (e) => {
      e.preventDefault()
      if (updating) return;
      setUpdating(true);
      try {
        const res = await fetch(`/api/users/update/${user._id}`,{
          method:"PATCH",
          headers: {
            "Content-Type":"application/json"
          },
          body:JSON.stringify({...inputs,profilePic:imgUrl})
        })  
        const data = await res.json()
        if (data.error) {
          showToast("Erro",data.error,"error")
          return
        }
        showToast("Sucesso","Perfil atualizado com sucesso","success")
        setUser(data)
        localStorage.setItem("user-threads",JSON.stringify(data))
      } catch (error) {
        showToast("Erro","não foi possivel atualizar o perfil","error")
        console.log(error)
      }finally {
        setUpdating(false);
      }
  }


  return (
    <form onSubmit={handleSubmit}>
      <Flex
        
        align={'center'}
        justify={'center'}
        my={6} >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          Editar perfil
          </Heading>
          <FormControl id="userName">
          
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="xl" boxShadow={'md'} src={imgUrl || user.profilePic}/>
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>trocar foto</Button>
                  <Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
              </Center>
            </Stack>
          </FormControl>
          <FormControl id="userName" >
            <FormLabel>Nome</FormLabel>
            <Input
              placeholder="nome"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={inputs.name}
              onChange={(e) => setInputs({...inputs,name:e.target.value})}
            />
          </FormControl>
          <FormControl id="userName" >
            <FormLabel>Nome do usuário</FormLabel>
            <Input
              placeholder="UserName"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={inputs.userName}
              onChange={(e) => setInputs({...inputs,userName:e.target.value})}
            />
          </FormControl>
          <FormControl id="email" >
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: 'gray.500' }}
              type="email"
              value={inputs.email}
              onChange={(e) => setInputs({...inputs,email:e.target.value})}

            />
          </FormControl>
          <FormControl id="bio" >
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="conte sobre você"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={inputs.bio}
              onChange={(e) => setInputs({...inputs,bio:e.target.value})}
            />
          </FormControl>
          <FormControl id="password" >
            <FormLabel>Senha</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: 'gray.500' }}
              type="password"
              onChange={(e) => setInputs({...inputs,password:e.target.value})}
            />
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'red.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'red.500',
              }}>
              Cancelar
            </Button>
            <Button
              bg={'blue.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'blue.500',
              }} type='submit'
              isLoading={updating}>
              Enviar
            </Button>
          </Stack>
        </Stack>
      </Flex>
  </form>
  )
}

export default UpdateProfilePage