const router = require('express').Router()
const xlsx = require('json-as-xlsx')
const User = require('../model/User')

router.get('/:id', async (req, res)=>{
    const projectId = req.params.id

    if(!projectId){
        return res.status(422).json({message: 'ProjectId não informado'})
    }    
    
    try {
        let project = await User.findById({_id: projectId}, {temperatures:1, devices: 1})
        if(!project){
            return res.status(404).json({message: 'Projeto não encontrado'})
        }

        let temperatures = project.temperatures
        let devices = project.devices

        let data = []

        data = devices.map((value, index)=>{

            let contentTable = []
            temperatures.map((temp, index)=>{
                
                if (value.id === temp.deviceId) {
                    if(temp){
                        let {temperature, humidity, date, time} = temp
                        let dataComponets = date.split('/')
                        let event = new Date(dataComponets[2],dataComponets[1],dataComponets[0],0,0,0,0)
                        let dateFormat = event.toLocaleDateString('en-GB')
                        contentTable = [...contentTable, 
                            {temperature: Number(temperature), 
                                humidity: Number(humidity), 
                                date: dateFormat, 
                                time
                        }]
                    }
                    
                    return;
                }
                })
            
            let table= {
                    sheet: value.name,
                    columns: [
                    { label: "Temperatura", value: "temperature" },
                    { label: "Umidade", value: "humidity" },
                    { label: "Data", value: "date"},
                    { label: "Hora", value: "time", format: "h:mm" },
                    ],
                    content: 
                        contentTable
                    ,
                }
            return table;
        })

        let settings = {
            fileName: "DeltaData", // Name of the resulting spreadsheet
            extraLength: 3, // A bigger number means that columns will be wider
            writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
            }

        res.status(200).json({settings,table:[data]})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Erro na busca das temperaturas'})
    }

})

module.exports = router