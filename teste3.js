const fs = require('fs')

const { string, z } = require('zod')

module.exports = function (req, res) {

    try {
        const deleteUserSchema = z.object({
            name: string().min(4)
        })

        const { name } = deleteUserSchema.parse(req.query)

        let data = fs.readFileSync('fakeData.json', 'utf-8')
        let users = JSON.parse(data)

        let exists = users.find(value => value.name === name)

        if (!exists) {
            return res.status(400).json({ message: 'usuário não encontrado' })
        }

        if (req.headers.sub === exists.id) {
            return res.status(403).json({ message: 'não e permitido excluir o usuário' });
        }

        users = users.filter(value => value.name !== name)

        fs.writeFileSync('fakeData.json', JSON.stringify(users, null, 2))
        res.status(200).json({ message: 'usuário deletado com sucesso' })
    } catch (error) {

        if (error instanceof z.ZodError) {
            return res.status(400).json(error)
        }

        return res.status(500).json({ message: 'Internal server error' })
    }
}