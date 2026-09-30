import express from "express";
import { register, login, refresh, getCurrentUser, adminTest,logout } from "../controllers/auth.controller.js";
import validate from "../middleware/validation.middleware.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import  authenticate  from "../middleware/auth.middleware.js";
import  authorizeRoles  from "../middleware/role.middleware.js";
import { USER_ROLES } from "../constants/roles.js";


const router = express.Router();

router.post(
    "/register", 
    registerValidator, 
    validate, 
    register
);

router.post(
    "/login",
    loginValidator,
    validate,
    login
);


router.post(
    "/refresh",
    refresh
);


router.get(
    "/me",
    authenticate,
    getCurrentUser
);

// TEMPORARY ROUTS
router.get(
    "/admin-test",
    authenticate,
    authorizeRoles(USER_ROLES.ADMIN),
    adminTest
);

router.post(
    "/logout",
    logout
);


export default router;