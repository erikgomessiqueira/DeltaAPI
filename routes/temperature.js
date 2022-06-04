const router = require('express').Router()

router.post('/', (req, res)=>{
    const {temperature, humidity} = req.body
    const dateInstase = new Date()
    const date = `${dateInstase.getDate()}/${dateInstase.getMonth()}/${dateInstase.getFullYear()}`
    const time = `${dateInstase.getHours()}:${dateInstase.getMinutes()}:${dateInstase.getSeconds()}`
    if(!temperature){
        res.status(422).json({message: 'Temperatura não informada'})
    }
    if(!humidity){
        res.status(422).json({message: 'Umidade não informada'})
    }
    
    
    res.status(200).json({
        temperature,
        humidity,
        date,
        time
    })

})

router.get('/', (req, res)=>{
    res.status(200).json({
        temperature: '24',
        humidity: '18',
        date: '2/5/2022',
        time: '17:59:25'
    })

})

module.exports = router