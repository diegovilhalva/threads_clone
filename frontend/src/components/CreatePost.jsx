import { AddIcon } from '@chakra-ui/icons'
import { Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import usePreviewImg from "../../hooks/usePreviewImage"
import { BsFillImageFill } from "react-icons/bs"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import useShowToast from '../../hooks/useShowToast'
import postsAtom from '../atoms/postsAtom'
import { useParams } from 'react-router-dom'
const MAX_CHAR = 500

const CreatePost = () => {
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [postText,setPostText] = useState("")
    const {handleImageChange,imgUrl,setImgUrl} = usePreviewImg()
    const fileRef = useRef(null)
    const [remainingChar,setRemainingChar] = useState(MAX_CHAR)
    const user = useRecoilValue(userAtom)
    const showToast = useShowToast()
    const [loading,setLoading] =useState(false)
    const [post,setPost] = useRecoilState(postsAtom)
    const {username} = useParams()
    const handleTextChange = (e) => {
      const inputText = e.target.value
      if (inputText.length > MAX_CHAR) {
        const truncateText = inputText.slice(0,MAX_CHAR)
        setPostText(truncateText)
        setRemainingChar(0)
      }else{
        setPostText(inputText)
        setRemainingChar(MAX_CHAR - inputText.length)
      }

    }
    const handleCreatePost = async () => {
     try {
      setLoading(true)
      const res = await fetch(`/api/posts/create`,{
        method:'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({postedBy:user._id,text:postText,img:imgUrl})
      })
      const data = await res.json()
      if(data.error){
        showToast("Erro",data.error,"error")
        return
      }
      showToast("","Post criado com sucesso!","success")
      if(username === user.userName) {
        setPost([data,...post])
      }
      
      onClose()
      setPostText("");
			setImgUrl("");
      setRemainingChar(MAX_CHAR)
     } catch (error) {
      showToast("Erro",error.data.error,"error")
     }finally{
      setLoading(false)
     }
    }
  return (
   <>
<Button  position={"fixed"} onClick={onOpen} bottom={10} right={10} leftIcon={<AddIcon />} bg={useColorModeValue("gray.300","gray.dark")}>
    Post
   </Button>
   <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Criar post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea placeholder='Escreva sua thread' onChange={handleTextChange} value={postText}></Textarea>
              <Text fontSize={"xs"}
              fontWeight={"bold"} textAlign={"right"} m={1} color={"gray.400"}>{remainingChar}/{MAX_CHAR}</Text>
              <Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
              <BsFillImageFill style={{marginLeft:"5px",cursor:"pointer"}} size={16} onClick={() => fileRef.current.click()}/>
            </FormControl>
            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt='imagem selecionada'/>
                <CloseButton onClick={() => {
                  setImgUrl("")
                }}
                bg={"gray.400"}
                position={"absolute"}
                top={2}
                right={2}
                />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button variant='ghost' onClick={handleCreatePost}
            isLoading={loading}
            >Postar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
   </>
  )
}

export default CreatePost