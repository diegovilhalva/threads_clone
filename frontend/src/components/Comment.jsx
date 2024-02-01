import { Avatar, Divider, Flex, Text } from "@chakra-ui/react"
import { useState } from "react"
import {BsThreeDots} from "react-icons/bs"
import Actions from "./Actions"

const Comment = ({reply,lastReply}) => {
console.log(reply)

  return (
    <>
        <Flex gap={4} py={2} my={2} w={'full'}>
            <Avatar src={reply.userProfilePic} size={'sm'}/>
            <Flex gap={1} w={'full'} flexDirection={'column'}>
                <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                    <Text fontSize={'sm'} fontWeight={'bold'} >{reply.username}</Text>
                    <Flex gap={2} alignItems={'center'}>
                        <Text fontSize={'sm'} color={'gray.light'}>1d</Text>
                        <BsThreeDots/>
                    </Flex>
                </Flex>
                <Text>{reply.text}</Text>
                <Text fontSize={'sm'} color={'gray.light'}>
                    {/*likes + ? 1 1 : 0 */} likes
                </Text>
            </Flex>
        </Flex>
       {!lastReply ? <Divider /> : null}
    </>
  )
}

export default Comment