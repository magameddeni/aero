import { Response } from "express"
import {
  ACCCESS_TOKEN_COOKIE_OPTION,
  REFRESH_TOKEN_COOKIE_OPTION,
} from "../config"

export const setJwtCookie = ({
  refreshToken,
  accessToken,
  res,
}: {
  refreshToken: string
  accessToken: string
  res: Response
}) => {
  res.cookie("refresh", refreshToken, REFRESH_TOKEN_COOKIE_OPTION)
  res.cookie("access", accessToken, ACCCESS_TOKEN_COOKIE_OPTION)
}
