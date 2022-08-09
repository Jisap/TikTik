import type { NextApiRequest, NextApiResponse } from 'next';
import { uuid } from 'uuidv4';

import { client } from '../../utils/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'PUT') {                                 // PUT /api/like/:id
        const { userId, postId, like } = req.body;              // Obtenemos el id del usuario y el id del post    

        const data =                                            // Creamos un objeto con los datos del usuario y el post

            like ? await client                                 // Si el usuario le da like, usamos el cliente de Sanity para
                .patch(postId)                                  // Patch al post (actualización del post)
                .setIfMissing({ likes: [] })                    // Si no existe el campo likes, lo creamos
                .insert('after', 'likes[-1]', [                 // Insertamos el like en el array de likes
                    {
                        _key: uuid(),                           // Creamos un id para el like                                  
                        _ref: userId,                           // Referencia al usuario que dio like
                    },
                ])
                .commit()                                       // Commit a Sanity para guardar los cambios

                : await client                                  // Si el usuario le da dislike, obtenemos los datos del post
                    .patch(postId)                              // Patch al post (actualización del post)
                    .unset([`likes[_ref=="${userId}"]`])        // Eliminamos el like del usuario
                    .commit();                                  // Commit a Sanity para guardar los cambios

        res.status(200).json(data); // Respondemos con los datos del post
    }
}