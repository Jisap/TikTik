import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../utils/client'


type Data = {
    name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {                                    // Si el método es POST
        const user = req.body;                                      // Extraemos el usuario del body
        client.createIfNotExists( user )                            // Creamos el usuario en el sistema de sanity si no existe          
            .then(() => res.status(200).json('Login Success'))
        
    }

}