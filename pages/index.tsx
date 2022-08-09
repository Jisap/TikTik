
import VideoCard from '../components/VideoCard';
import NoResults from '../components/NoResults';

import axios from 'axios';
import { Video } from '../types';
import { BASE_URL } from '../utils';

interface IProps {
  videos: Video[];
}

const Home = ({ videos }: IProps ) => {
  
  return (
    <div className='flex flex-col gap-10 videos h-full'>
      { videos.length
        ? videos?.map((video: Video) => (
          <VideoCard post={ video } isShowingOnHome key={video._id} />
        ))
        : <NoResults text={`No Videos`} /> }
    </div>
  )
}




export const getServerSideProps = async ({ query:{topic} }:{ query:{topic:string} }) => { // Extraemos el topic del query de la url establecido en discover.tsx
  
  let response = await  axios.get(`${BASE_URL}/api/post`);            // 1º pedimos todos los videos
  if (topic) {                                                        // 2º si hay un topic, 
    response = await axios.get(`${BASE_URL}/api/discover/${topic}`);  // Establecemos la nueva respuesta con los videos que coinciden con el topic
  }

  return {
    props: {
      videos: response.data
    }
  }
}

export default Home

