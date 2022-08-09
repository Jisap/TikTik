import axios from 'axios';
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { BASE_URL } from '../utils';

//Estado del usuario con Zustand
const authStore = ( set:any ) => ({                                  // Creamos una función que recibe un set para actualizar el estado
    userProfile: null,                                               // Inicializamos el estado de un usuario individual                          
    allUsers:[],                                                     // Inicializamos el estado de todos los usuarios como un []
    addUser: (user:any) => set({ userProfile: user }),               // Función para agregar un usuario al estado
    removeUser: () => set({ userProfile: null }),                    // Función para eliminar un usuario del estado

    fetchAllUsers: async() =>{                                       // Función para obtener todos los usuarios   
        const response = await axios.get(`${BASE_URL}/api/users`);   // mediante una petición a api/users   
        set({ allUsers: response.data });                            // Con la respuesta actualizamos el estado con los usuarios
    }
})

const useAuthStore = create(                                        // Creamos un hook con zustand para usar el estado
    persist(authStore, {                                            // Persistimos el estado en localStorage
        name: 'auth',                                               // Le ponemos un nombre
    })
)
                                                                //userProfile + allUsers     //addUser + removeUser
export default useAuthStore //useAuthStore es un hook que devuelve el estado y las funciónes para actualizarlo.