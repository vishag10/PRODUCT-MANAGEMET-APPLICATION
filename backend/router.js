import { Router } from "express";
import * as rh from "./RequestHandler/user.requesthandler.js"
import Auth from "./middleware/auth.js";

const router = Router();
router.route("/adduser").post(rh.addUser);
router.route("/login").post(rh.loginUser);
router.route("/home").get(Auth,rh.Home);
router.route("/forgot").post(rh.passwordRequest);


export default router;