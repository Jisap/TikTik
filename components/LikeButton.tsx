import React, { useEffect, useState } from 'react';
import { MdFavorite } from 'react-icons/md';
import { NextPage } from 'next';

import useAuthStore from '../store/authStore';

interface IProps {
    likes: any;
    flex: string;
    handleLike: () => void;
    handleDislike: () => void;
}

const LikeButton: NextPage<IProps> = ({ likes, flex, handleLike, handleDislike }) => {
  
  const [alreadyLiked, setAlreadyLiked] = useState( false );
  const { userProfile }: any = useAuthStore();
  let filterLikes = likes?.filter((item: any) => item._ref === userProfile?._id); // Filtra los likes del usuario logueado

  useEffect(() => {
    if (filterLikes?.length > 0) {                                // Si el usuario ya le dio like al post
      setAlreadyLiked(true);                                      // Setea que ya le dio like                 
    } else {                                                      // Si el usuario no le dio like al post                 
      setAlreadyLiked(false);                                     // Setea que no le dio like
    }
  }, [filterLikes, likes]); // Cada vez que cambia el likes
  
  return (
    <div className={`${flex} gap-6`}>
      <div className='mt-4 flex flex-col justify-center items-center cursor-pointer'>
        { alreadyLiked ? (
          <div className='bg-primary rounded-full p-2 md:p-4 text-[#F51997]'>
            <MdFavorite className='text-lg md:text-2xl' onClick={ handleDislike } />
          </div>
        ):(
          <div className='bg-primary rounded-full p-2 md:p-4 '>
            <MdFavorite className='text-lg md:text-2xl' onClick={ handleLike } />
          </div>
        )}
        <p className='text-md font-semibold '>{ likes?.length || 0 }</p>
      </div>
    </div>
  )
}

export default LikeButton