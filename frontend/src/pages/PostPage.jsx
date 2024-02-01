import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from '@chakra-ui/react'
import { BsThreeDots } from "react-icons/bs"
import React, { useEffect, useState } from 'react'
import Actions from '../components/Actions'
import Comment from '../components/Comment'
import useGetUserProfile from '../../hooks/useGetUserProfile'
import useShowToast from '../../hooks/useShowToast'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import postsAtom from '../atoms/postsAtom'
import userAtom from '../atoms/userAtom'

const PostPage = () => {
  const {user,loading} = useGetUserProfile()
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast()
  const currentUser = useRecoilValue(userAtom)
  const {pid} = useParams()
  const navigate = useNavigate()

  
  const currentPost = posts[0]
  useEffect(() =>{
    const getPost = async () => {
        setPosts([])
        try {
          const res = await fetch(`/api/posts/${pid}`)
          const data = await res.json()
          if(data.error){
            showToast("Erro",data.error,"error")
            return
          }
          setPosts([data])
          console.log([data])
        } catch (error) {
          showToast("Erro", error.message, "error");
        }
    }
    getPost()

  },[showToast,pid,setPosts])
  
  const handleDeletePost = async () => {
		try {
			if (!window.confirm("Você quer mesmo deletar este post?")) return;

			const res = await fetch(`/api/posts/${currentPost._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("", "Post deletedo com sucesso", "success");
			navigate(`/${user.username}`);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};
 
  if(!user && loading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    )
  }
  if(!currentPost) return null;
  return (
    <>
      <Flex>
        <Flex w={'full'} alignItems={'center'} gap={3}>
          <Avatar src={user.profilePic} size={'md'} name={user.name} />
          <Flex>
            <Text fontSize={'sm'} fontWeight={'bold'}>{user.userName}</Text>
            <Image src='/verified.png' w={'4'} h={'4'} ml={1} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={'center'}>
          <Text fontSize={'sm'} color={'gray.light'}>1d</Text>
          {currentUser?._id === user._id && (
						<DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />
					)}
        </Flex>
      </Flex>
      <Text my={3}>
        {currentPost.text}
      </Text>
      {currentPost.img && (
				<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
					<Image src={currentPost.img} w={"full"} />
				</Box>
			)}
      <Flex gap={3} my={3}>
        <Actions post={currentPost}/>
      </Flex>
      
      <Divider my={4} />
      <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text fontSize={'2xl'}>&#x1F44B; </Text>
          <Text color={'gray.light'}>Baixe o app para obter uma experiência melhor</Text>
        </Flex>
        <Button >
            Baixar
        </Button>
      </Flex>
      <Divider my={4}/>
      {currentPost.replies.map((reply) => (
				<Comment
					key={reply._id}
					reply={reply}
					lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
				/>
			))}
    </>
  )
}

export default PostPage