import { NextFunction, Request, Response } from "express"

interface IError {
  status?: number
  message?: string
}

class Err extends Error {
  status: number

  constructor(status: number, message?: string) {
    super(message)
    this.status = status
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Err)
    }
  }
}

const errorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!(err instanceof Err)) err = new Err(500, "Ошибка на стороне сервера")
  const status = err.status || 500
  const response = err.message || "Ошибка на стороне сервера"
  res.status(status).json({ response })
}

const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.stack)
  next(err)
}

const asyncWrapper = (
  interceptor: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void> | void,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await interceptor(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

export { Err, errorHandler, errorLogger, asyncWrapper }
