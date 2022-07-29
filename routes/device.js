const router = require('express').Router()
const User = require('../model/User')
const unicId = require('uniqid')

router.post('/', async (req, res)=>{
    const {idProject, name, startTime, endTime,} = req.body

    if(!name){
        return res.status(422).json({message: 'Nome não informado'})
    }

    if(!idProject){
        return res.status(422).json({message: 'IdProject não informado'})
    }

    if(!startTime){
        return res.status(422).json({message: 'StartTime não informado'})
    }

    if(!endTime){
        return res.status(422).json({message: 'EndTime não informado'})
    }

    let project = await User.findById({_id:idProject})
    if(!project){
        return res.status(422).json({message:"Projeto não encontrado"})
    }

    let {devices} = project

    let existName = devices.filter((device)=> device.name === name)

    if(existName.length !== 0){
        return res.status(422).json({message: 'Dispositivo já cadastrado'})
    }
    
    const modelDevice = {
        id: unicId(`${name}-`),
        name,
        startTime,
        endTime,
        status: "pending"

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
        return res.status(500).json({message: "Erro ao adicionar o dispositivo"})
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