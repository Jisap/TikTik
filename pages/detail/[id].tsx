import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { GoVerified } from 'react-icons/go';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineCancel } from 'react-icons/md';
import { BsFillPlayFill } from 'react-icons/bs';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import axios from 'axios';
import { BASE_URL } from '../../utils';
import { Video } from '../../types';
import useAuthStore from '../../store/authStore';
import LikeButton from '../../components/LikeButton';
import Comments from '../../components/Comments';

interface IProps {
  postDetails: Video;
}

const Detail = ( { postDetails }:IProps ) => {

  console.log({postDetails});

  const [post, setPost] = useState(postDetails);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const [comment, setComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const { userProfile }: any = useAuthStore();

  const onVideoClick = () => {
    if (isPlaying) {
      videoRef?.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef?.current?.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (post && videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [post, isVideoMuted]);

  const handleLike = async (like: boolean ) => {
    if (userProfile) {                                        // Si el usuario esta logueado
      const res = await axios.put(`${BASE_URL}/api/like`, {   // Hace un put a la API para actualizar el like con el
        userId: userProfile._id,                              // Id del usuario logueado
        postId: post._id,                                     // Id del post  
        like                                                  // Si el usuario le dio like o no
      });
      setPost({ ...post, likes: res.data.likes });            // Actualiza el post con el nuevo like
    }
  }

  const addComment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if( userProfile && comment ) {
      setIsPostingComment(true);
      const { data } = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
        userId: userProfile._id,
        comment
      });
      setPost({ ...post, comments: data.comments });
      setComment('');
      setIsPostingComment(false);  
    }
  }
  
  if(!post) return null;

  return (
    <div className='flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap'>
      <div className='relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-blurred-img bg-no-repeat bg-cover bg-center'>
        
        {/* Icono X para cerra el video */}
        <div className='opacity-90 absolute top-6 left-2 lg:left-6 flex gap-6 z-50'>
          <p className='cursor-pointer ' onClick={() => router.back()}>
            <MdOutlineCancel className='text-white text-[35px] hover:opacity-90' />
          </p>
        </div>

        {/* Video */}
        <div className='relative'>
          <div className='lg:h-[100vh] h-[60vh]'>
            <video
              ref={ videoRef }
              onClick={ onVideoClick }
              loop
              src={ post?.video?.asset.url }
              className=' h-full cursor-pointer'
            ></video>
          </div>

          {/* Icono de reproducir/pausa */}
          <div className='absolute top-[45%] left-[40%]  cursor-pointer'>
            { !isPlaying && (
              <button onClick={ onVideoClick }>
                <BsFillPlayFill className='text-white text-6xl lg:text-8xl' />
              </button>
            )}
          </div>
        </div>

        {/* Icono de volumen */}
        <div className='absolute bottom-5 lg:bottom-10 right-5 lg:right-10  cursor-pointer'>
          {isVideoMuted ? (
            <button onClick={() => setIsVideoMuted(false)}>
              <HiVolumeOff className='text-white text-3xl lg:text-4xl' />
            </button>
          ) : (
            <button onClick={() => setIsVideoMuted(true)}>
              <HiVolumeUp className='text-white text-3xl lg:text-4xl' />
            </button>
          )}
        </div>
      </div>

      {/* Detalles del video a la derecha del video*/}
      <div className='relative w-[1000px] md:w-[900px] lg:w-[700px]'>
        <div className='lg:mt-20 mt-10'>
          
          <Link href={`/profile/${ post.postedBy._id }`}>
            <div className='flex gap-4 mb-4 bg-white w-full pl-10 cursor-pointer'>
              <Image
                width={60}
                height={60}
                alt='user-profile'
                className='rounded-full'
                src={ post.postedBy.image }
              />
              <div>
                <div className='text-xl font-bold lowercase tracking-wider flex gap-2 items-center justify-center'>
                  { post.postedBy.userName.replace(/\s+/g, '')}{' '}
                  <GoVerified className='text-blue-400 text-xl' />
                </div>
                <p className='text-md'> { post.postedBy.userName }</p>
              </div>
            </div>
          </Link>

          <div className='px-10'>
            <p className=' text-md text-gray-600'>{ post.caption }</p>
          </div>

          <div className='mt-10 px-10'>
            { userProfile && <LikeButton
              likes={ post.likes }
              flex='flex'
              handleLike={() => handleLike(true)}
              handleDislike={() => handleLike(false)}
            />}
          </div>
          <Comments                               // Componente que gestiona los comentarios del video
            comment={ comment }                   // Comentario que se esta escribiendo, por defecto esta vacio               
            setComment={ setComment }             // Funcion que actualiza el comentario
            addComment={ addComment }             // Funcion que agrega el comentario  
            comments={ post.comments }            // Comentarios del video existentes en la base de datos
            isPostingComment={ isPostingComment } // Si esta posteando el comentario 
          />
        </div>
      </div>


    </div>
  )
}



export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const res = await axios.get(`${BASE_URL}/api/post/${id}`);

  return {
    props: { postDetails: res.data },
  };
};

export default Detail