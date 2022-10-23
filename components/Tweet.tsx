import React, { useEffect, useState } from 'react'
import { Comment, CommentBody, Tweet } from '../typings'
import TimeAgo from 'react-timeago'
import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon
} from '@heroicons/react/outline'
import { fetchComments } from '../utils/fetchComments'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface Props {
  tweet: Tweet
}

const Tweet = ({ tweet }: Props) => {

  const [comments, setComments] = useState<Comment[]>([])
  const [commentBosVisible, setCommentBoxVisible] = useState<boolean>(false)
  const [input, setInput] = useState<string>('');
  const { data: session } = useSession();

  const refereshComments = async () => {
    const cmts: Comment[] = await fetchComments(tweet._id)
    setComments(cmts);
  }

  useEffect(() => {
    refereshComments();
  }, [])

  const addCommentHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const commentToast = toast.loading('Posting Comment...')

    //Comment Logic
    const comment: CommentBody = {
      comment: input,
      tweetId: tweet._id,
      username: session?.user?.name || 'Unknown user',
      profileImg: session?.user?.image || 'https://links.papareact.com/gll',
    }
    const result = await fetch(`/api/addComment`, {
      body: JSON.stringify(comment),
      method: 'POST',
    })
    toast.success("Comment Posted!", {
      id: commentToast
    })
    setInput("")
    setCommentBoxVisible(false)
    refereshComments()
  }

  return (
    <div className='flex flex-col space-x-3 border-y p-5 border-gray-100' >

      <div className='flex space-x-3' >
        <img className='h-10 w-10 rounded-full object-cover' src={tweet.profileImg} alt="" />
        <div>
          <div className='flex items-center space-x-1' >
            <p className='mr-1 font-bold' > {tweet.username}</p>
            <p className='hidden text-sm text-gray-500 sm:inline' >@{tweet.username.replace(/\s+/g, '').toLowerCase()}</p>

            <TimeAgo date={tweet._createdAt} className='text-sm text-gray-500' />
          </div>

          <p className='pt-2' >{tweet.text}</p>
          {tweet.image && <img className=' shadow-sm object-cover m-5 ml-0 mb-1 max-h-60 rounded-lg' src={tweet.image} alt="" />}
        </div>
      </div>

      <div className='flex mt-5 justify-between'>
        <div onClick={() => session && setCommentBoxVisible(!commentBosVisible)} className='flex cursor-pointer items-center text-gray-400 space-x-3 ' >
          <ChatAlt2Icon className='h-5 w-5' />
          <p>{comments.length}</p>
        </div>
        <div className='flex cursor-pointer items-center text-gray-400 space-x-3 ' ><SwitchHorizontalIcon className='h-5 w-5' /></div>
        <div className='flex cursor-pointer items-center text-gray-400 space-x-3 ' ><HeartIcon className='h-5 w-5' /></div>
        <div className='flex cursor-pointer items-center text-gray-400 space-x-3 ' ><UploadIcon className='h-5 w-5' /></div>
      </div>


      {/* Comment Box logic */}

      {commentBosVisible && (
        <form onSubmit={addCommentHandler} className='mt-3 flex space-x-3' >
          <input value={input} onChange={e => setInput(e.target.value)}
            className='flex-1 rounded-lg outline-none bg-gray-100 p-2'
            type="text"
            placeholder='Write a comment...' />
          <button type="submit" disabled={!input} className='text-twitter disabled:text-gray-200 ' >Post</button>
        </form>
      )}

      {comments?.length > 0 && (
        <div className=' scrollbar-hide my-2 mt-5  space-y-5 max-h-44 overflow-y-scroll border-t border-gray-100 p-5'  >
          {comments.map((comment) => (
            <div key={comment._id} className="relative flex space-x-2" >
              <hr className='absolute left-5 top-10 h-8 border-x border-twitter/30' />
              <img className=' mt-2 h-7 w-7 object-cover rounded-full' src={comment.profileImg} alt="" />
              <div>
                <div className='flex items-center space-x-1' >
                  <p className='mr-1 font-bold' >{comment.username}</p>
                  <p className='hidden text-sm text-gray-500 lg:inline' >@{comment.username.replace(/\s+/g, '').toLowerCase()}</p>
                  <TimeAgo date={comment._createdAt} className='text-sm text-gray-500' />
                </div>
                <p>{comment.comment}</p>
              </div>
            </div>

          ))}
        </div>
      )}

    </div>
  )
}

export default Tweet;
