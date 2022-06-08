const router = require('express').Router()
const User = require('../model/User')

router.get('/', async (req, res)=>{
    const {projectId} = req.body

    if (!projectId) {
        return res.status(422).json({message: "Id do Projeto não informado"})
    }
    
    try {
        let devices = await User.findById({_id: projectId}, {devices: 1})
        return res.status(200).json(devices)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Erro ao buscar o projeto!"})
    }

    

})


module.exports = router