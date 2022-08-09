import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../utils/client'
import { allUsersQuery } from '../../utils/queries'

type Data = {
    name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {                                    // Si el método es GET para api/users
        const data = await client.fetch(allUsersQuery());          // Obtenemos todos los usuarios
        if(data){
            res.status(200).json(data)                             // Si hay datos los enviamos como respuesta
        }else{
            res.json([]);                                          // Si no hay datos enviamos un array vacío
        }
    }

}