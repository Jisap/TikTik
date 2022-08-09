import axios from 'axios';
import jwt_decode from 'jwt-decode';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

 export const createOrGetUser = async ( response: any, addUser:any ) => { // Recibe desde el navbar el login del usuario de google y la función para agregarlo al estado
  
  const decoded:{ name:string, picture:string, sub:string } = jwt_decode(response.credential);  // Decodificamos las credenciales del usuario
  const { name, picture, sub } = decoded;                                                       // Extraemos los datos del usuario
  const user = {                                                                                // Creamos un objeto con los datos del usuario según sistema de sanity
    _id: sub,
    _type: 'user',
    userName: name,
    image: picture,
  }

  addUser( user );                                                  // Agregamos el usuario al estado que esta guardado por zustand en localStorage

  await axios.post( `${BASE_URL}/api/auth`, user );       // Enviamos el usuario al al api de next para crearlo en el sistema de sanity

 };