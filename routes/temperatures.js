const router = require('express').Router()
const User = require('../model/User')

router.get('/', async (req, res)=>{
    const {projectId} = req.body

    if(!projectId){
        return res.status(422).json({message: 'ProjectId não informado'})
    }    
    
    try {
        let project = await User.findById({_id: projectId}, {temperatures:1})

        if(!project){
            return res.status(404).json({message: 'Projeto não encontrado'})
        }

        let temperatures = project.temperatures

        res.status(200).json({temperatures})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Erro na busca das temperaturas'})
    }

})

module.exports = router