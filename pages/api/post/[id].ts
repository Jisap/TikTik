import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../../utils/client';
import { postDetailQuery } from '../../../utils/queries';
import { uuid } from 'uuidv4';



type Data = {
    name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {                                    // Si el método es POST
        const { id } = req.query;                                  // Obtenemos el id del post contenido en el query de la petición desde /details/[id]
        const query = postDetailQuery( id );                       // Creamos la query para obtener el post
        const data = await client.fetch( query );                  // Obtenemos los datos del post através del cliente de sanity
    
        res.status(200).json(data[0]);                             // Respondemos con el post que será la respuesta de la API en details/[id]
    
    }else if ( req.method === 'PUT'){                               // Si el método es PUT

        const { comment, userId } = req.body;                       // Obtenemos el comentario y el id del usuario que lo ha escrito del body de la petición
        const { id }:any = req.query;                               // Obtenemos el id del post contenido en el query de la petición desde api/post/[id]                          
        
        const data = await client                                   // Construimos el objeto con los datos del comentario                            
            .patch(id)                                              // Patch al post (actualización del post)                                 
            .setIfMissing({ comments: [] })                         // Si no existe el campo comments, lo creamos
            .insert('after', 'comments[-1]', [                      // Insertamos el comentario en el array de comments
                {
                    comment,                                                // Comentario
                    _key: uuid(),                                           // Creamos un id para el comentario
                    postedBy: { _type: 'postedBy', _ref: userId },          // Referencia al usuario que ha escrito el comentario
                },
            ])
            .commit();                                              // Commit a Sanity para guardar los cambios

        res.status(200).json(data);                                // Respondemos con los datos del post actualizados
    }

    
}