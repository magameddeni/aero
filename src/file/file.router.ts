import { Router } from "express"
import { authMiddleware } from "../middleware/auth.middleware"
import { asyncWrapper } from "../lib/error.interceptor"
import fileController from "./file.controller"
import { upload } from "../lib"

const router = Router()

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  asyncWrapper(fileController.upload),
)
router.get("/list", authMiddleware, asyncWrapper(fileController.files))
router.delete(
  "/delete/:id",
  authMiddleware,
  asyncWrapper(fileController.deleteFile),
)
router.get("/:id", authMiddleware, asyncWrapper(fileController.file))
router.get(
  "/download/:id",
  authMiddleware,
  asyncWrapper(fileController.download),
)
router.put(
  "/update/:id",
  authMiddleware,
  upload.single("file"),
  asyncWrapper(fileController.update),
)

export default router
