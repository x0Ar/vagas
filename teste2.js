const fs = require('fs')

const { v4 } = require('uuid')
const { string, z } = require('zod')

module.exports = function (req, res) {

    try {
        const postUserSchema = z.object({
            name: string().min(4),
            job: string().min(4)
        })

        const { name, job } = postUserSchema.parse(req.body)

        let data = fs.readFileSync('fakeData.json', 'utf-8')
        let newUsers = JSON.parse(data)

        let exists = newUsers.find(value => value.name === name)

        if (exists) {
            return res.status(400).json({ message: 'O usuário já existe' })
        }

        newUsers.push({
            id: v4(),
            name: name,
            job: job,
            role: 'MEMBER'
        })

        fs.writeFileSync('fakeData.json', JSON.stringify(newUsers, null, 2))
        res.status(201).json()
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json(error)
        }

        return res.status(500).json({ message: 'Internal server error' })
    }
};