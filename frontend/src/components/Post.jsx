import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import Actions from "./Actions"
import { useEffect, useState } from "react"
import useShowToast from "../../hooks/useShowToast"

import {formatDistanceToNow} from "date-fns"
import {ptBR} from "date-fns/locale"
const Post = ({post,postedBy}) => {
    const [user,setUser] = useState(null)
    const showToast = useShowToast()

    const  navigate = useNavigate()
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch("/api/users/profile/"+postedBy)
                const data = await res.json()
                if(data.error){
                    showToast("Erro",data.error,"error")
                }
                setUser(data)
            } catch (error) {
                showToast("Error",error.message,"error")
                setUser(null)
            }
        }
        getUser()
    },[postedBy,showToast])
    if(!user) return null
  return (
    <Link to={`/${user.userName}/post/${post._id}`}>

        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={'column'} alignItems={'center'}>
                <Avatar size={'md'} name={user?.name} src={user.profilePic}
                onClick={(e) => {
                    e.preventDefault()
                    navigate(`/${user.userName}`)
                }}/>
                <Box w={'1px'} h={'full'} bg={'gray.light'} my={2}></Box>
                <Box position={'relative'} w={'full'}>

                {post.replies.length === 0 && <Text textAlign={"center"}>&#x1F971;</Text>}
                    {post.replies[0] && (
                        <Avatar size={'xs'}  name="laura" src={post.replies[0].userProfilePic} position={'absolute'}
                        top={"0px"} left={'15px'} padding={'2px'}/>
                    )}
                    
                     {post.replies[1] && (
                        <Avatar size={'xs'}  name="laura" src={post.replies[1].userProfilePic} position={'absolute'}
                        bottom={'0px'} right={'-5px'} padding={'2px'}/>
                     )}
                     {post.replies[2] && (
                        <Avatar size={'xs'}  name="laura" src={post.replies[2].userProfilePic} position={'absolute'}
                        bottom={"0px"} left={'4px'} padding={'2px'}/>
                     )

                     }
                </Box>
            </Flex>
            <Flex flex={1} flexDirection={'column'} gap={2}>
                <Flex justifyContent={'space-between'} w={'full'}>
                    <Flex w={'full'} alignItems={'center'}>
                        <Text fontSize={'sm'} fontWeight={'bold'} onClick={(e) => {
                            e.preventDefault()
                            navigate(`/${user.userName}`)
                        }}>{user?.userName}</Text>
                        <Image src="/verified.png" w={4} h={4} ml={1}/>
                    </Flex>
                    <Flex gap={4} alignItems={'center'}>
                        <Text  fontSize={'xs'} width={20} color={'gray.light'}> há {formatDistanceToNow(new Date(post.createdAt),{locale:ptBR})}</Text>

                    </Flex>
                </Flex>
                <Text fontSize={'sm'}>{post.text}</Text>
                { post.img && (
                <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                    <Image src={post.img} w={'full'} />
                </Box>
                )
                }
                <Flex gap={3} my={1}>
                    <Actions post={post}/>
                </Flex>
                
            </Flex>
        </Flex>
    </Link>
  )
}

export default Post