
import Permissions from '../../models/user/permissions.models.js';
import { setSend } from '../../helpers/setSend.js';

export const createPermission = async (req, res) => {
  const { nombre, descripcion } = req.body;

  try {
    const nuevoPermiso = new Permissions({ nombre, descripcion });
    await nuevoPermiso.save();

    res.status(201).json(setSend( "Permiso creado exitosamente", nuevoPermiso));
  } catch (error) {
    console.error(error);
    res.status(500).json(setSend( "Error al crear permiso", error ));
  }
};




export const getPermissions = async (req, res) => {
  try {
    const permisos = await Permissions.find(); 
    res.status(200).json(setSend( "Permisos obtenidos", permisos ));
  } catch (error) {
    console.error(error);
    res.status(500).json(setSend( "Error al obtener permisos", error ));
  }
};

  

export const updatePermission = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  try {
    const permisoActualizado = await Permissions.findByIdAndUpdate(
      id,
      { nombre, descripcion },
      { new: true } 
    );

    if (!permisoActualizado) {
      return res.status(404).json(setSend( "Permiso no encontrado" ));
    }

    res.status(200).json(setSend( "Permiso actualizado",  permisoActualizado ));
  } catch (error) {
    console.error(error);
    res.status(500).json(setSend( "Error al actualizar permiso", error ));
  }
};

  

export const deletePermission = async (req, res) => {
  const { id } = req.params;

  try {
    const permisoEliminado = await Permissions.findByIdAndDelete(id);

    if (!permisoEliminado) {
      return res.status(404).json(setSend( "Permiso no encontrado" ));
    }

    res.status(200).json(setSend("Permiso eliminado" ));
  } catch (error) {
    console.error(error);
    res.status(500).json(setSend( "Error al eliminar permiso", error));
  }
};


  