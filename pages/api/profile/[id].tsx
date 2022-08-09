import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../../utils/client'
import { singleUserQuery, userCreatedPostsQuery, userLikedPostsQuery } from '../../../utils/queries';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {                                         // Si el método es GET
        const { id } = req.query;                                       // Obtenemos el id del usuario desde api/profile/[id]

        const query = singleUserQuery(id);                              // Creamos la query para obtener información de un usuario según su id 
        const userVideosQuery = userCreatedPostsQuery(id);              // Posts creados por el usuario con el id que nos pasan 
        const userLikedVideosQuery = userLikedPostsQuery(id);           // Posts de un usuario dentro del [ likes ] 

        const user = await client.fetch( query );                           // Ejecutamos las querys con el cliente de sanity
        const userVideos = await client.fetch( userVideosQuery );           
        const userLikedVideos = await client.fetch( userLikedVideosQuery ); 

        res.status(200).json({user: user[0], userVideos, userLikedVideos });  // Devolvemos el usuario, los videos creados y los videos que le gustan al usuario
    }

}