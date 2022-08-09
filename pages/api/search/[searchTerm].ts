import type { NextApiRequest, NextApiResponse } from 'next';

import { searchPostsQuery } from '../../../utils/queries';
import { client } from '../../../utils/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    if (req.method === 'GET') {                             // Si la petición a esta ruta es GET
        
        const { searchTerm } = req.query;                   // Obtenemos el searchTerm que nos pasan por la url

        const videosQuery = searchPostsQuery(searchTerm);   // Creamos la query para buscar los videos con el searchTerm

        const videos = await client.fetch(videosQuery);     // Buscamos los videos con la query

        res.status(200).json(videos);                       // Respondemos con los videos encontrados
    }
}