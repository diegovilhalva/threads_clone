import {Button,Flex, Spinner} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useShowToast from "../../hooks/useShowToast"
import Post from "./Post"
import UserPost from "./UserPost"
import { useRecoilState } from "recoil"
import postsAtom from "../atoms/postsAtom"

const HomePage = () => {
  const [posts,setPosts] = useRecoilState(postsAtom)
  const showToast = useShowToast()
  const [loading,setLoading] = useState(true  )
  useEffect(() => {
    const getfeedPosts = async () => {
      
      try {
        const res = await fetch(`/api/posts/feed`)
        const data = await res.json()
        setPosts(data)
        if(data.error){
          showToast("Erro",data.error,"error")
          return
        }

        console.log(data)
      } catch (error) {
        showToast("Erro",error.message,"error")
      }finally{
        setLoading(false)
      }

    }
    getfeedPosts()
  },[showToast,setPosts])
  return (
   <>
    {loading && (
      <Flex justify={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    )}
    {!loading && posts.length === 0 && <h1>Você ainda não segue ninguém</h1>}
    {posts.map((post) => (
      <Post key={post._id} post={post} postedBy={post.postedBy} />      
    ))}
   </>
  )
}

export default HomePage