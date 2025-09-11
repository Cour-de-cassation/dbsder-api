import { Router } from 'express'
import { fetchCodeNacByCodeNac } from '../service/codeNac/handler'

const app = Router()

app.get('/codenacs/:codenac', async (req, res, next) => {
  try {
    const codeNac = req.params.codenac
    const codeNacDetails = await fetchCodeNacByCodeNac(codeNac)
    res.send(codeNacDetails)
    next()
  } catch (err: unknown) {
    next(err)
  }
})

export default app
