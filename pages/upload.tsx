import React, { useEffect, useState } from 'react';
import { SanityAssetDocument } from '@sanity/client';
import { useRouter } from 'next/router';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';

import useAuthStore from '../store/authStore';
//import { BASE_URL } from '../utils';
import { client } from '../utils/client';
import { topics } from '../utils/constants';
import { BASE_URL } from '../utils';

const Upload = () => {
 
  const [isLoading, setIsLoading] = useState(false);
  const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | undefined>();
  const [wrongFileType, setWrongFileType] = useState<Boolean>(false);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<String>(topics[0].name);  
  const [savingPost, setSavingPost] = useState(false);
  const userProfile: any = useAuthStore((state) => state.userProfile); // obtenemos el userProfile del store
  const router = useRouter();

  const uploadVideo = async (e: any) => {
    const selectedFile = e.target.files[0];                     // Obtenemos el video del evento
    const fileTypes = ['video/mp4', 'video/webm', 'video/ogg']; // Tipos de archivos permitidos para subir videos

        // uploading asset to sanity
        if (fileTypes.includes(selectedFile.type)) {            // Si el archivo selecionado es un video con el tipo permitido
            setWrongFileType(false);                            // Bandera de tipo fallido = false
            setIsLoading(true);                                 // Bandera de cargando = true        

            client.assets                                       // Configuramos en el cliente los assets a subir (assets es una collección en Sanity)
                .upload('file', selectedFile, {                 
                    contentType: selectedFile.type,             // Tipo de archivo
                    filename: selectedFile.name,                // Nombre del archivo
                })
                .then((data) => {                               // Si el video se configura correctamente en el cliente
                    setVideoAsset(data);                        // Guardamos el video en el state
                    setIsLoading(false);                        // Bandera de cargando = false
                });
        } else {                                                // Si el archivo selecionado no es un video con el tipo permitido
            setIsLoading(false);                                // Bandera de cargando = false
            setWrongFileType(true);                             // Bandera de tipo fallido = true
        }
    };
    
    const handlePost = async () => {
        if( caption && videoAsset?._id && category ){
            setSavingPost(true);

            const document = {                               // Creamos el documento a subir
                _type: 'post',                               // Tipo de documento POST   
                caption,                                     // Titulo del video                         
                video: {                                     // Video        
                    _type: 'file',                           // Tipo de documento FILE
                    asset: {                                 // Contiene un activo (asset)
                        _type: 'reference',                  // que hace referencia a
                        _ref: videoAsset?._id,               // el id del video a subir
                    },
                },
                userId: userProfile?._id,                    // ID del usuario logueado
                postedBy: {                                  // Usuario que postea el video
                    _type: 'postedBy',                       // Tipo de documento POSTEDBY
                    _ref: userProfile?._id,                  // ID del usuario
                },
                topic: category,
            }

            await axios.post(`${BASE_URL}/api/post`, document); // Subimos el documento al servidor de Sanity
        
            router.push('/');                                // Redirigimos a la pagina principal
        }
    }

  return (
    <div className='flex w-full h-full absolute left-0 top-[60px] lg:top-[70px] mb-10 pt-10 lg:pt-20 bg-[#F8F8F8] justify-center'>
        <div className=' bg-white rounded-lg xl:h-[80vh] w-[80%] flex gap-6 flex-wrap justify-between items-center p-14 pt-6'>
            <div>
                <div>
                    <p className='text-2xl font-bold'>Upload Video</p>
                    <p className='text-md text-gray-400 mt-1'>Post a video to your account</p>
                </div>
                <div className=' border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center  outline-none mt-10 w-[260px] h-[458px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100'>
                    { isLoading ? (                 // Si esta cargando
                        <p>Uploading....</p>        // mensaje de espera    
                    ) : (                           // Si no esta cargando
                        <div>                           
                            { videoAsset ? (        // Si hay un video en el state se muestra
                                <div>
                                    <video
                                        className='rounded-xl h-[462px] mt-16 bg-black'
                                        controls
                                        loop
                                        src={videoAsset.url}
                                    >

                                    </video>
                                </div>
                            ) : (               // Si no hay un video en el state se muestra un icono de subir video
                                <label className='cursor-pointer'>
                                    <div className='flex flex-col item-center justify-center h-full'>
                                        <div className='flex flex-col items-center justify-center'>
                                            <p className='font-bold text-xl'>
                                                <FaCloudUploadAlt className='text-gray-300 text-6xl'/>
                                            </p>
                                            <p className='text-xl font-semibold'>
                                                Upload video
                                            </p>
                                        </div>
                                        <p className='text-gray-400 text-center mt-10 text-sm leading-10'>
                                            MP4 or WebM or ogg <br />
                                            720x1280 resolution or higher <br />
                                            Up to 10 minutes <br />
                                            Less than 2 GB
                                        </p>
                                        <p className='bg-[#F51997] text-center mt-8 rounded text-white text-md font-medium p-2 w-52 outline-none'>
                                            Select file
                                        </p>
                                    </div>
                                    <input                              // Input para subir el video
                                        type='file'
                                        name='upload-video'
                                        onChange={(e) => uploadVideo(e)} // Evento para subir el video
                                        className='w-0 h-0'
                                    />
                                </label>
                            )}
                        </div>
                    )}
                    { wrongFileType && (
                        <p className='text-center text-xl text-red-400 font-semibold mt-4 w-[260px]'>
                            Please select a video file
                        </p>
                    )}
                </div>
            </div>

            <div className='flex flex-col gap-3 pb-10'>
                <label className='text-md font-medium'>
                    Caption
                </label>
                <input
                    type='text'
                    value={ caption }
                    onChange={(e) => setCaption( e.target.value )}
                    className='rounded lg:after:w-650 outline-none text-md border-2 border-gray-200 p-2'
                />
                <label className='text-md font-medium '>Choose a Category</label>
                <select
                    className='outline-none lg:w-650 border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer'
                    onChange={(e) => setCategory(e.target.value)}
                >
                    { topics.map((topic) => (
                        <option
                            key={topic.name}
                            className=' outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300'
                            value={topic.name}
                        >
                            { topic.name }
                        </option>
                    ))}
                </select>

                <div className='flex gap-6 mt-10'>
                    <button
                        onClick={() => {}}
                        type='button'
                        className='border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
                    >
                        Discard
                    </button>
                    <button
                        disabled={ videoAsset?.url ? false : true }
                        onClick={ handlePost }
                        type='button'
                        className='bg-[#F51997] text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
                    >
                        Post
                    </button>
                </div>

            </div>

        </div>
    </div>
  )
}

export default Upload