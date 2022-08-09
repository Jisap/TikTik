export const allPostsQuery = () => { // Basada en la interface IProps del home que asu vez se basa en el tipo de data Video
  const query = `*[_type == "post"] | order(_createdAt desc){
    _id,
     caption,
       video{
        asset->{
          _id,
          url
        }
      },
      userId,
      postedBy->{
        _id,
        userName,
        image
      },
    likes,
    comments[]{
      comment,
      _key,
      postedBy->{
      _id,
      userName,
      image
    },
    }
  }`;

  return query;
};

export const postDetailQuery = (postId: string | string[]) => { // Aquí pedimos el video con el id que nos pasan
  const query = `*[_type == "post" && _id == '${postId}']{
    _id,
     caption,
       video{
        asset->{
          _id,
          url
        }
      },
      userId,
    postedBy->{
      _id,
      userName,
      image
    },
     likes,
    comments[]{
      comment,
      _key,
      postedBy->{
        _ref,
      _id,
    },
    }
  }`;
  return query;
};

export const searchPostsQuery = (searchTerm: string | string[]) => { // Se buscan los documentos videos(posts) que contengan el texto que nos pasan
  // El searchTerm se buscara en el campo caption y el campo topic            
  const query = `*[_type == "post" && caption match '${searchTerm}*' || topic match '${searchTerm}*'] { 
    _id,
     caption,
       video{
        asset->{
          _id,
          url
        }
      },
      userId,
    postedBy->{
      _id,
      userName,
      image
    },
likes,
    comments[]{
      comment,
      _key,
      postedBy->{
      _id,
      userName,
      image
    },
    }
  }`;
  return query;
};

export const singleUserQuery = (userId: string | string[]) => { // Documentos con el type=user y el id que nos pasan
  const query = `*[_type == "user" && _id == '${userId}']`;     // Información de un usuario según su id

  return query;
};

export const allUsersQuery = () => {    // Obtiene todos los documentos con el type=user 
  const query = `*[_type == "user"]`;   // Información de todos los usuarios

  return query;
};

export const userCreatedPostsQuery = (userId: string | string[]) => { // Posts (videos) creados por el usuario con el id que nos pasan
  const query = `*[ _type == 'post' && userId == '${userId}'] | order(_createdAt desc){
    _id,
     caption,
       video{
        asset->{
          _id,
          url
        }
      },
      userId,
    postedBy->{
      _id,
      userName,
      image
    },
 likes,

    comments[]{
      comment,
      _key,
      postedBy->{
      _id,
      userName,
      image
    },
    }
  }`;

  return query;
};

export const userLikedPostsQuery = (userId: string | string[]) => { // Posts(videos) de un usuario dentro del [ likes ]
  const query = `*[_type == 'post' && '${userId}' in likes[]._ref ] | order(_createdAt desc) {
    _id,
     caption,
       video{
        asset->{
          _id,
          url
        }
      },
      userId,
    postedBy->{
      _id,
      userName,
      image
    },
 likes,

    comments[]{
      comment,
      _key,
      postedBy->{
      _id,
      userName,
      image
    },
    }
  }`;

  return query;
};

export const topicPostsQuery = (topic: string | string[]) => { // Post (videos) que tengan el topic que nos pasan
  const query = `*[_type == "post" && topic match '${topic}*'] { 
    _id,
     caption,
       video{
        asset->{
          _id,
          url
        }
      },
      userId,
    postedBy->{
      _id,
      userName,
      image
    },
 likes,

    comments[]{
      comment,
      _key,
      postedBy->{
      _id,
      userName,
      image
    },
    }
  }`;

  return query;
};
