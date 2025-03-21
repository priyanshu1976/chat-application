import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from "./MessageInput"
import MessageSkeleton from "../components/skeletons/MessageSkeleton"
import { useAuthStore } from '../store/useAuthStore';

function ChatContainer() {


  const { message, getMessages, isMessagesLoading, selectedUser, subscribeToMessage, unsubscribeToMessage } = useChatStore();
  const { authUser } = useAuthStore()
  const messageEndRef = useRef(null);


  useEffect(() => {
    getMessages(selectedUser._id)
    subscribeToMessage()

    return () => unsubscribeToMessage();
  }, [selectedUser._id, getMessages, subscribeToMessage, unsubscribeToMessage])

  useEffect(() => {
    if (messageEndRef.current && message) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  if (isMessagesLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>

      <ChatHeader />
      <div className='flex-1 overflow-y-scroll  p-4 space-y-4'>
        {
          message.map((message) => (
            <div
              key={message._id}
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} `}
              ref={messageEndRef}
            >

              <div className=' chat-image avatar'>
                <div className='size-10 rounded-full border'>
                  <img src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"} alt="" />
                </div>
              </div>


              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>

              <div className='chat-header mb-1'>
                <time className='text-xs opacity-50 ml-1'>
                  {new Date(message.createdAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </time>
              </div>


            </div>
          ))
        }
      </div>
      <MessageInput />
    </div >
  )
}

export default ChatContainer