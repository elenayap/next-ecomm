import { verifyAccessToken } from '../utils/jwt.js'

//Define the middleware function auth that takes three parameters: req, res, and next
export default async function auth(req, res, next) {
//Check if the incoming request has an Authorization header 
    if (!req.headers.authorization) {   
    return res.status(401).send({'error': 'Unauthorized'})
  }
//Split the Authorization header value to extract the token
  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    return res.status(401).send({ 'error': 'Unauthorized' })
  }
//Verify the access token using the verifyAccessToken function
  await verifyAccessToken(token).then(user => {
//If the token is valid, store the user object in the req object
    req.user = user // store the user in the `req` object. our next route now has access to the user via `req.user`
    next() //Call the next() function to pass control to the next middleware or route handler
  }).catch(e => {
    return res.status(401).send({ 'error': e.message })
  })
}

//this middleware ensures that incoming requests have a valid access token in the Authorization header. 
//If the token is valid, it extracts the user information from the token and stores it in the req object, 
//allowing subsequent middleware or route handlers to access the authenticated user. 
//If the token is invalid or missing, it returns a 401 Unauthorized error