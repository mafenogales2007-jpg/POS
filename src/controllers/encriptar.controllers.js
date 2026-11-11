import { hashPassword } from "../helpers/bcrypt.helpers.js"

export const encriptarPasswordController = async (req, res) => {
  try {
    const password = hashPassword(req.body.clave)

    res.json({
      message:'Contraseña encriptada',
      clave: password
    })
  } catch (error){
    console.error(error) 

    res.json({
      message:'No se pudo encriptar el password'
    })
  }

}
