const fs = require('fs')

const { string, z } = require('zod')

module.exports = function (req, res) {

    try {
        const IdSchema = z.object({
            id: string().uuid()
        })

        const { id } = IdSchema.parse(req.query)

        let data = fs.readFileSync('fakeData.json', 'utf-8')
        let users = JSON.parse(data)

        let exists = users.findIndex(value => value.id === id)

        if (exists === -1) {
            return res.status(400).json({ message: 'id não encontrado' })
        }

        const BodySchema = z.object({
            name: string().min(4),
            job: string().min(4)
        })

        const { name, job } = BodySchema.parse(req.body)

        users[exists].name = name
        users[exists].job = job

        fs.writeFileSync('fakeData.json', JSON.stringify(users, null, 2))
        res.status(200).json({ message: 'dados do usuário alterado com sucesso' })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json(error)
        }

        return res.status(500).json({ message: 'Internal server error' })
    }
}