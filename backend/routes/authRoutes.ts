import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";
import upload  from "../middlewares/uploadMiddleware";

const router = express.Router();

router.post("/registro", registerUser);
router.post("/login", loginUser);
router.get("/perfil", protect, getUserProfile);
router.put("/perfil", protect, updateUserProfile);

router.post("/upload-image", upload.single("image"), (req, res) =>{
    if(!req.file) {
        return res.status(400).json({ message: "Nenhum arquivo foi carregado"});
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file?.filename}`;
    res.status(200).json({ imageUrl });
});

export default router;  