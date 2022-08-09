import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { GoVerified } from 'react-icons/go';
import axios from 'axios';

import VideoCard from '../../components/VideoCard';
import NoResults from '../../components/NoResults';
import { IUser, Video } from '../../types';
import { BASE_URL } from '../../utils';

interface IProps {
  data: {
    user: IUser;
    userVideos: Video[];
    userLikedVideos: Video[];
  };
}

const Profile = ( { data }:IProps ) => {

  const [showUserVideos, setShowUserVideos] = useState<Boolean>(true);            // Este estado cambia con el click sobre videos/liked
  const [videosList, setVideosList] = useState<Video[]>([]);                      // Este estado cambia en el useEffect según showUserVideos sea true o false.          

  const videos = showUserVideos ? 'border-b-2 border-black' : 'text-gray-400';    // Se crea una clase para resaltar la sección de videos
  const liked = !showUserVideos ? 'border-b-2 border-black' : 'text-gray-400';    // Se crea una clase para resaltar la sección de videos

  const { user, userVideos, userLikedVideos } = data;

  useEffect(() => {
    const fetchVideos = async () => {
      if (showUserVideos) {               // Si estamos mostrando los videos creados por el usuario showUserVideos=true
        setVideosList(userVideos);        // Seteamos la lista de videos creados por el usuario
      } else {                            // Si estamos mostrando los videos que le gustan al usuario showUserVideos=false
        setVideosList(userLikedVideos);   // Seteamos la lista de videos que le gustan al usuario
      }
    };

    fetchVideos();
  }, [showUserVideos, userLikedVideos, userVideos]);

  return (
    <div className="w-full">
      <div className='flex gap-6 md:gap-10 mb-4 bg-white w-full'>
        
        {/* Logo del usuario */}
        <div className='w-16 h-16 md:w-32 md:h-32'>
          <Image
            width={120}
            height={120}
            className='rounded-full'
            src={user.image}
            alt='user-profile'
            layout='responsive'
          />
        </div>

        {/* Nombre del usuario */}
        <div className='flex flex-col justify-center'>
          <p className='md:text-2xl traking-wider flex gap-1 items-center justify-center text-md font-bold text-primary lowercase'>
            {user.userName.replace(/\s+/g, '')}{' '}
            <GoVerified className='text-blue-400' />
          </p>
          <p className='capitalize md:text-xl text-gray-400 text-xs'>
            {user.userName}
          </p>
        </div>

      </div>

    {/* Linea con selección de video/likes */}
      <div>
        <div className='flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full'>
          <p className={`text-xl font-semibold cursor-pointer ${videos} mt-2`} onClick={() => setShowUserVideos(true)}>
            Videos
          </p>
          <p className={`text-xl font-semibold cursor-pointer ${liked} mt-2`} onClick={() => setShowUserVideos(false)}>
            Liked
          </p>
        </div>

        <div className='flex gap-6 flex-wrap md:justify-start'>
          { videosList.length > 0 ? (
              videosList.map(( post:Video, idx: number ) => ( <VideoCard post={ post } key={ idx }/>))
              ) : (
                <NoResults 
                  text={`No ${showUserVideos ? '' : 'Liked'} Videos Yet`}
                />
              )
          }
        </div>
      </div>

    </div>
  )
}

export const getServerSideProps = async ({ params: { id }}: { params: { id: string }}) => {
  
  const res = await axios.get(`${BASE_URL}/api/profile/${id}`);

  return {
    props: { data: res.data },
  };
};

export default Profile