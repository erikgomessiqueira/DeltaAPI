const router = require('express').Router()
const User = require('../model/User')
const unicId = require('uniqid')

router.post('/', async (req, res)=>{
    const {idProject, name} = req.body

    if(!name){
        return res.status(422).json({message: 'Nome não informado'})
    }



    let project = await User.findById({_id:idProject})

    let {devices} = project

    let existName = devices.filter((device)=> device.name === name)

    if(existName.length !== 0){
        return res.status(422).json({message: 'Dispositivo já cadastrado'})
    }
    
    const modelDevice = {
        id: unicId(`${name}-`),
        name,

    }

    let newDevices = [...devices, modelDevice]


    try {
        let updateProject = await User.updateOne({_id: project._id}, {$set:{devices: newDevices}}, {upsert: true})
        
        if(updateProject.matchedCount === 0){
            return res.status(422).json({message:"Projeto não encontrado"})
        }

        return res.status(200).json(
            {
                message: "Dispositivo adicionado!",
                data: {idProject: idProject, ...modelDevice}
            }
        )
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Erro adicionar o dispositivo"})
    }

})

router.get('/', async (req, res)=>{

    let {idDevice, idProject} = req.body

    if(!idDevice){
        return res.status(404).json({message: 'Id do disposisivo não encontrado'})
    }
    if(!idProject){
        return res.status(404).json({message: 'Id do projeto não encontrado'})
    }

    try {
        let {devices} = await User.findOne({_id:idProject},{devices:1})

        let existDevice = devices.filter((device)=> device.id === idDevice)

        if(existDevice.length === 0){
            return res.status(404).json({message: 'Id do disposisivo não encontrado'})
        }
        return res.status(200).json(existDevice)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Id do projeto não encontrado"})
    }

    

    

})

module.exports = router