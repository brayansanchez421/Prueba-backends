import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import Role from "../models/user/role.models.js"; 
import Permission from "../models/user/permissions.models.js"
import {setSend} from "../helpers/setSend.js"


export const checkPermissions = (requiredPermissions) => {
  return async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json(setSend( "No Autorizado" ));
    }

    jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json(setSend( "No Autorizado" ));
      }

      console.log("Decoded token:", decoded);

      try {
        const role = await Role.findById(decoded.role);
        if (!role) {
          return res.status(401).json(setSend( "No Autorizado" ));
        }

        console.log("User role:", role);

        const permissionIds = await Promise.all(requiredPermissions.map(async (permissionName) => {
          const permission = await Permission.findOne({ nombre: permissionName });
          return permission ? permission._id.toString() : null;
        }));

        const validPermissionIds = permissionIds.filter((permissionId) => permissionId !== null);

        const hasPermission = role.permisos.some(permission =>
          validPermissionIds.includes(permission.toString())
        );

        console.log("Required permissions:", requiredPermissions);
        console.log("Role permissions:", role.permisos);
        console.log("Has permission:", hasPermission);

        if (hasPermission) {
          next();
        } else {
          res.status(403).json(setSend( "No tienes permisos para estar aqui :o" ));
        }
      } catch (error) {
        console.error(error);
        res.status(500).json(setSend( "Internal Server Error" ));
      }
    });
  };
};
