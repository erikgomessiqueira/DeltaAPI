const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../model/User')

router.post('/login', async(req, res)=>{
    const {name, password} = req.body

    if(!name){
        return res.status(422).json({message: 'Nome não informado'})
    }
    if(!password){
        return res.status(422).json({message: 'Senha não informada'})
    }    
    
    const project = await User.findOne({name})

    if(!project){
        return res.status(422).json({message: 'Projeto não cadastrado!'})
    }

    const checkPassword = await bcrypt.compare(password, project.password)

    if(!checkPassword){
        return res.status(422).json({message: "Senha incorreta!"})
    }

    try {

        res.status(200).json(
            {
                message: "Usuário autenticado", 
                id: project._id,
                name: project.name,
                token: "hfkjhdskfjhsdkfjhsk"
            }
        )

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Ocorreu no servidor, tente novamente mais tarde!"})
    }

    

})

router.post('/register/project', async (req, res)=>{
    const {name, password, confirmPassword} = req.body
    if(!name){
        return res.status(422).json({message: 'Nome não informado'})
    }
    if(!password){
        return res.status(422).json({message: 'Senha não informada'})
    }    
    if(password !== confirmPassword){
        return res.status(422).json({message: 'Senhas não conferem'})
    }

    const existProject = await User.findOne({name})

    if(existProject){
        return res.status(422).json({message: 'Nome já cadastrado'})
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password,salt)

    const project  = new User({
        name,
        password: passwordHash,
        devices: [],
        temperatures: []
    })
    
    try {
        await project.save()
        return res.status(201).json({ message: "Projeto cadastrado!"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Ocorreu no servidor, tente novamente mais tarde!"})
    }

})

router.post('/register/device', (req, res)=>{
    const {userId, unicId} = req.body
    if(!userId){
        return res.status(422).json({message: 'userId não informado'})
    }    
    if(!unicId){
        return res.status(422).json({message: 'unicId não informado'})
    }
    
    let unicIdExist = true

    if(!unicIdExist){
        return res.status(404).json({message: 'Dispositivo não encontrado'})
    }


    return res.status(200).json({
        message: "Dispositivo cadastrado!"
    })

})


module.exports = router