const router = require('express').Router()

router.get('/', (req, res)=>{
    return res.status(200).json(
        [
            {
                message:"ALL"
            },
            {
                temperature: '24',
                humidity: '18',
                date: '2/5/2022',
                time: '17:59:25'
            },
            {
                temperature: '25',
                humidity: '16',
                date: '2/5/2022',
                time: '20:15:02'
            }
        ]
    )

    

})

router.get('/user/:id', (req, res)=>{

    let idDevice = req.params.id

    let idDeviceExist = idDevice == 1234

    if(!idDeviceExist){
        return res.status(404).json({message: 'Id do disposisivo não encontrado'})
    }
    return res.status(200).json(
        [
            {
                temperature: '24',
                humidity: '18',
                date: '2/5/2022',
                time: '17:59:25'
            },
            {
                temperature: '25',
                humidity: '16',
                date: '2/5/2022',
                time: '20:15:02'
            }
        ]
    )

    

})

module.exports = router