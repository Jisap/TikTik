
import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../../utils/client'
import { allPostsQuery } from '../../../utils/queries'

type Data = {
    name: string
}

export default async function handler(req: NextApiRequest,res: NextApiResponse) {

    if( req.method === 'GET' ){                     // Si el método es GET
        const query = allPostsQuery()               // Obtenemos la query (tipo de petición -> Todos los post) 
        const data = await client.fetch(query)      // Usando el cliente Sanity, obtenemos los datos
        res.status(200).json(data)                  // Respondemos con los datos
    
    }else if( req.method === 'POST' ){              // Si el método es POST

        const document = req.body;                              // Obtenemos el documento que se envía desde handlePost de la página upload
        client.create(document)                                 // Usando el cliente Sanity, creamos el documento y lo enviamos al sistema de sanity
            .then(() => res.status(201).json('Video Created'))  // Si se creó correctamente, respondemos con un status 201 y un mensaje
    }    
}