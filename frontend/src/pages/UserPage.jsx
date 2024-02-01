import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import { useParams } from 'react-router-dom'
import useShowToast from '../../hooks/useShowToast'
import { Flex, Spinner } from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'
import useGetUserProfile from '../../hooks/useGetUserProfile'
import Post from '../components/Post'

const UserPage = () => {
  const {user,loading} = useGetUserProfile()
  const {username} = useParams()
  const showToast = useShowToast()
  const [posts,setPosts] = useRecoilState(postsAtom)
  const [fetchingPosts,setFetchingPosts] = useState(true)
  useEffect(() => {     
      const getPosts = async () => {
        if(!user) return;
         setFetchingPosts(true)
          try {
            const res = await fetch(`/api/posts/user/${username}`)
            const data = await res.json()
            console.log(data)
            setPosts(data)
          } catch (error) {
            showToast("Erro",error.message,"error")
            setPosts([])
          }finally{
            setFetchingPosts(false)
          }
      }    
      getPosts()
  },[username,showToast,setPosts,user])
  if(!user && loading){
    return (<Flex alignItems={'center'} justifyContent={'center'}>
      <Spinner  size={'xl'} />
    </Flex>)
  }

  if (!user && !loading) return <h1>Usuário não encontrado</h1>
  
  return (
    <>
      <UserHeader user={user}/>
        {!fetchingPosts && posts.length === 0 && <h1>Usuário ainda não postou nada</h1>}
        {fetchingPosts && (
          <Flex justifyContent={'center'} my={12}>
            <Spinner size={'xl'} />
          </Flex>
        )}
        {posts.map((post) => (
          <UserPost key={post._id} post={post} postedBy={post.postedBy} />
        ))}
    </>
  ) 
}

export default UserPage