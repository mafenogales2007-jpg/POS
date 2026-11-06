import UserModel from "../models/user.model.js";

const dbCreateUser = async ( newUser ) => {
    return await UserModel.create( newUser );  // Registrar en la BD
}

// Obtener la lista de usuarios con paginación y filtro de estado (activos, inactivos o todos)
const dbGetUsers = async ( page = 1, limit = 10, status = 'true' ) => {
    // Paso 1: Sanitizar los valores de paginación (números enteros >= 1)
    const pageNumber = Math.max( 1, Number( page ) || 1 );
    const limitNumber = Math.max( 1, Number( limit ) || 10 );

    // Paso 2: Calcular el desplazamiento o salto de registros (skip)
    // Fórmula: (página - 1) * límite
    const skip = ( pageNumber - 1 ) * limitNumber;

    // Paso 3: Construir el filtro dinámico según el query param 'status'
    //   - status === 'true'  -> solo usuarios activos ({ status: true })
    //   - status === 'false' -> solo usuarios inactivos ({ status: false })
    //   - status === 'all'   -> todos sin distingo de status ({})
    //   - por defecto        -> solo usuarios activos ({ status: true })
    let filter = {};

    if ( status === 'true' || status === true ) {
        filter.status = true;
    } else if ( status === 'false' || status === false ) {
        filter.status = false;
    } else if ( status === 'all' ) {
        filter = {}; // Objeto vacío: no filtra por status (trae todos)
    } else {
        filter.status = true; // Valor por defecto
    }

    // Paso 4: Ejecutar en paralelo la consulta paginada y el conteo total con el mismo filtro
    const [ users, total ] = await Promise.all([
        // 4.1: Consulta los documentos aplicando el filtro, skip (saltar) y limit (cantidad máxima)
        UserModel.find( filter )
            .skip( skip )
            .limit( limitNumber )
            .populate('createdBy'),

        // 4.2: Cuenta el total de documentos que coinciden exactamente con el filtro aplicado
        UserModel.countDocuments( filter )
    ]);

    // Paso 5: Retornar los datos obtenidos junto con la metadata de paginación y filtro
    return {
        users,                                        // Lista de usuarios correspondientes a la página actual
        total,                                        // Total de usuarios que coinciden con el filtro
        page: pageNumber,                             // Número de página consultada
        limit: limitNumber,                           // Cantidad de registros devueltos por página
        totalPages: Math.ceil( total / limitNumber ) // Total de páginas disponibles
    };
}

const dbDeleteUser = async ( id ) => {
    // return await UserModel.findByIdAndDelete( id );
    return await UserModel.findOneAndDelete({ _id: id });
}

const dbUpdateUser = async ( id, userUpdated ) => {
    return await UserModel.findOneAndUpdate(
        { _id: id },            // Objeto de consulta para buscar el documento que deseamos actualizar
        userUpdated,            // El objeto con los datos del Documento que deseamos actualizar
        {
            new: true,          // Retorna el documento ya actualizado
            runValidators: true // Ejecuta las validaciones definidas en el Schema de Mongoose al actualizar
        }
    );
}

const dbGetUser = async ( id ) => {
    // return await UserModel.findById( id );       // Obtiene un usuario por su ID
    return await UserModel.findOne({ _id: id });
}

// email: jcarlosj@correo.co
const dbGetUserByEmail = async ( email, status = true ) => {
    return await UserModel.findOne({ email: email, status: status });
}


export {
    dbCreateUser,
    dbGetUsers,
    dbDeleteUser,
    dbUpdateUser,
    dbGetUser,
    dbGetUserByEmail
}