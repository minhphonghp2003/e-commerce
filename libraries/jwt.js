import jwt from 'jsonwebtoken'
import fs from 'fs'

let privateKey = fs.readFileSync('private.key')

const keygen =async (id, role) => {
    let token = jwt.sign({'id' : id, 'role' : role},privateKey,{ algorithm: 'RS256' },{ expiresIn: '1h' })
    return token
}

export  {keygen}