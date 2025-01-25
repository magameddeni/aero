import { Request, Response } from "express"
import userService from "./user.service"
import { setJwtCookie } from "../lib/cookie"
import { IRequest } from "../interface"

class UserController {
  async signin(req: Request, res: Response) {
    const { id, password } = req.body
    const { accessToken, refreshToken } = await userService.signin({
      id,
      password,
    })
    setJwtCookie({ accessToken, refreshToken, res })
    res.status(200).json({ accessToken, refreshToken })
  }

  async refresh(req: Request, res: Response) {
    const { refresh } = req.cookies
    const { refreshToken, accessToken } = await userService.refresh(refresh)
    setJwtCookie({ accessToken, refreshToken, res })
    res.status(200).json({ accessToken, refreshToken })
  }

  async signup(req: Request, res: Response) {
    const { id, password } = req.body
    const { accessToken, refreshToken } = await userService.signup({
      id,
      password,
    })
    setJwtCookie({ accessToken, refreshToken, res })
    res.status(200).json({ accessToken, refreshToken })
  }

  async info(req: IRequest, res: Response) {
    res.status(200).json({ id: req.user?.id })
  }

  async logout(req: IRequest, res: Response) {
    const { id, exp } = req.user ?? { id: undefined, exp: undefined }
    const { refresh, access } = req.cookies
    await userService.logout(refresh, access, id, exp)
    res.clearCookie("access")
    res.clearCookie("refresh")
    res.sendStatus(200)
  }
}

export default new UserController()
