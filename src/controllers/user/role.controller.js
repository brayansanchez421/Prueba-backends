import Role from "../../models/user/role.models.js";
import Permissions from "../../models/user/permissions.models.js";

export const createRole = async (req, res) => {
  const { nombre, permisos } = req.body;

  try {
    const permisosIds = await Permissions.find({ nombre: { $in: permisos } }, "_id");

    const nuevoRol = await Role.create({ nombre, permisos: permisosIds.map(permiso => permiso._id) });

    res.status(201).json({ message: "Rol creado exitosamente", rol: nuevoRol });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear rol", error: error.message });
  }
};


export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    const rolesWithPermissions = await Promise.all(roles.map(async (role) => {
      const permissions = await Permissions.find({ _id: { $in: role.permisos } });
      const permissionsNames = permissions.map(permission => permission.nombre);
      return { ...role.toObject(), permisos: permissionsNames };
    }));
    res.status(200).json(rolesWithPermissions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);
    if (!role) throw new Error('Rol no encontrado');
    const permissions = await Permissions.find({ _id: { $in: role.permisos } });
    const permissionsNames = permissions.map(permission => permission.nombre);
    const roleWithPermissions = { ...role.toObject(), permisos: permissionsNames };
    res.status(200).json(roleWithPermissions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};




  export const updateRole = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedRole = await Role.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedRole) throw new Error('Rol no encontrado');
      res.status(200).json(updatedRole);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  export const deleteRole = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedRole = await Role.findByIdAndDelete(id);
      if (!deletedRole) throw new Error('Rol no encontrado');
      res.status(200).json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  
      