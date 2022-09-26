const router = require('express').Router()
const User = require('../model/User')

router.post('/', async (req, res)=>{
    try{
        if(Object.keys(req.body).length === 0){
            return res.status(400).json({message: 'Informe os dados'})
            
        }
        const {temperature, humidity, deviceId, projectId} = req.body
        const dateInstase = new Date()
        const date = `${dateInstase.getDate()}/${dateInstase.getMonth()}/${dateInstase.getFullYear()}`
        const time = `${dateInstase.getHours()}:${dateInstase.getMinutes()}:${dateInstase.getSeconds()}`

        const hours = dateInstase.getHours()
        const minutes = dateInstase.getMinutes()

        if(!temperature){
            res.status(422).json({message: 'Temperatura não informada'})
        }
        if(!humidity){
            res.status(422).json({message: 'Umidade não informada'})
        }

        if(!projectId){
            return res.status(422).json({message: 'ProjectId não informado'})
        }    
        if(!deviceId){
            return res.status(422).json({message: 'DeviceId não informado'})
        }
        
        let project = await User.findById({_id: projectId}, {devices: 1, temperatures:1})

        if(!project){
            return res.status(404).json({message: 'Projeto não encontrado'})
        }

        let devices = project.devices

        if(devices.length === 0){
            return res.status(422).json({message: 'Dispositivo não existe'})
        }

        let deviceFiltered = devices.filter((device)=> device.id === deviceId)
        let device = deviceFiltered[0]

        if(!device || deviceFiltered.length === 0){
            return res.status(404).json({message: 'Dispositivo não encontrado'})
        }
        if(device.status === 'pending'){
            return res.status(422).json({message: 'Dispositivo pendente!', status: 'pending'})
        }
        
        const startTime = device.startTime.split(':')
        const endTime = device.endTime.split(':')

        // if((Number(startTime[0])<=hours) && (Number(endTime[0])<=hours )){
        //     return res.status(202).json({message: "Envio fora do intervalo de tempo"})
        // }

        // if((Number(startTime[0])<=hours) && (Number(endTime[0])<=hours )){
        //     if((Number(startTime[1])<=minutes) && (Number(endTime[1])<=minutes)){
        //         return res.status(202).json({message: "Envio fora do intervalo de tempo"})
        //     }
        // }
        
        
        const modelTemperature = {
            deviceId,
            temperature,
            humidity,
            date,
            time
        }

        console.log(modelTemperature)

        let temperatures = project.temperatures

        let updatedTemperatures = [...temperatures, modelTemperature]

        try {
            let updateTemperature = await User.updateOne({_id: project._id}, {$set:{temperatures: updatedTemperatures}}, {upsert: true})
            
            if(updateTemperature.matchedCount === 0){
                return res.status(400).json({message:"Temperatura não enviada"})
            }

            return res.status(200).json(
                {
                    message: "Temperatura enviada",
                    status: 'actived'
                }
            )
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: "Erro ao enviar temperatura"})
        }}
    catch(err){
        console.log(err)
        return res.status(400).json({message: "Não foi possível entender a requisição"})
        
    }

})

router.get('/', async (req, res)=>{
    const {deviceId, projectId} = req.body
    
    if(!projectId){
        return res.status(422).json({message: 'ProjectId não informado'})
    }    
    if(!deviceId){
        return res.status(422).json({message: 'DeviceId não informado'})
    }
    
    try {
        let project = await User.findById({_id: projectId}, {devices: 1, temperatures:1})

        if(!project){
            return res.status(404).json({message: 'Projeto não encontrado'})
        }

        let devices = project.devices

        if(devices.length === 0){
            return res.status(422).json({message: 'Dispositivo não existe'})
        }

        let deviceFiltered = devices.filter((device)=> device.id === deviceId)
        let device = deviceFiltered[0]

        if(!device || deviceFiltered.length === 0){
            return res.status(404).json({message: 'Dispositivo não encontrado'})
        }
        if(device.status === 'pending'){
            return res.status(422).json({message: 'Dispositivo pendente!'})
        }
        

        let temperatures = project.temperatures
        let temperaturesFiltered = temperatures.filter((temperature)=> temperature.deviceId === deviceId)

        res.status(200).json({temperaturesFiltered})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Erro na busca das temperaturas'})
    }

})

module.exports = router