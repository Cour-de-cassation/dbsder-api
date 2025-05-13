import { Router } from 'express'
import { parseId } from '../service/codeNac/models'
import { fetchCodeNacById } from '../service/codeNac/handler'

const app = Router()

app.get('/codenacs/:id', async (req, res, next) => {
  try {
    const codeNacId = parseId(req.params.id)
    const codeNac = await fetchCodeNacById(codeNacId)
    res.send(codeNac)
  } catch (err: unknown) {
    req.log.error(err)
    next(err)
  }
})

export default app
