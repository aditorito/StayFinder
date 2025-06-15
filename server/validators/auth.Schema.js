const z = require('zod')

const signupBody = z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string().min(6),
    role:z.string().optional()
})

module.exports = {
    signupBody:signupBody
}