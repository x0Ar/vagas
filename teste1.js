const fs = require('fs')

const { z, string } = require('zod')

const getUser = (req, res) => {

    try {
        const getUserSchema = z.object({
            name: string().min(4)
        })

        const { name } = getUserSchema.parse(req.query)

        let data = fs.readFileSync('fakeData.json', 'utf-8')
        data = JSON.parse(data)

        if (data.length === 0) return res.status(400).json({ message: 'Nenhum usuário encontrado' })

        let users = data.filter(value => value.name === name)
        if (users.length > 0) {
            return res.json(users)
        } else {
            return res.status(400).json({ message: 'Nenhum usuário encontrado' })
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json(error)
        }

        return res.status(500).json({ message: 'Internal server error' })
    }
}

const getUsers = (req, res, next) => {
    let data = fs.readFileSync('fakeData.json', 'utf-8')
    data = JSON.parse(data)

    if (data.length === 0) return res.status(400).json({ message: 'Nenhum usuário encontrado' })
    return res.json(data)
}

module.exports = {
    getUser,
    getUsers
};