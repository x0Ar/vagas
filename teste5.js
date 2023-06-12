const fs = require('fs')

const { string, z } = require('zod')
const jwt = require('jsonwebtoken')

var count = {}

module.exports = function (req, res) {

    try {
        const UserSchema = z.object({
            name: string().min(4)
        })

        const { name } = UserSchema.parse(req.query)

        let data = fs.readFileSync('fakeData.json', 'utf-8')
        let users = JSON.parse(data)

        let exists = users.find(value => value.name === name)

        if (!exists) {
            return res.status(400).json({ message: 'usuário não encontrado' })
        }

        if (!count[name]) {
            count[name] = 0
        }

        //console.log(exists)
        count[name]++
        var token = jwt.sign({ role: exists.role }, 'shhhhh', {
            subject: exists.id,
            expiresIn: '1h'
        })

        res.json({ token: token, message: `Usuário ${name} foi lido ${count[name]} vezes.` })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json(error)
        }

        return res.status(500).json({ message: 'Internal server error' })
    }
}