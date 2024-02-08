const express = require('express');
const app = express()
const fileUpload = require('express-fileupload')
const fs = require('fs')

const port = process.env.PORT || 3000;


app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(express.static('public'))
app.use(fileUpload({createParentPath: true, safeFileNames: true preserveExtension: true}))
app.use('/fotos', express.static('archivos'))

app.post('/subir', (req, res)=> {
    
    if(!req.files){
        res.send({mensaje: "No hay archivo en la petición"})
    }else{
        let file = req.files.archivo
        let md5 = file.md5
        file.mv('./archivos/' +md5+file.name)
        res.send({
            mensaje: "Archivo subido! ",
            name: md5+file.name,
            size: file.size,
            mimeType: file.mimetype
        })
    }
})


app.get('/imagenes', (req,res)=>{
    fs.readdir('./archivos/', (err, archivos)=>{
        if(err){
            res.send({mensaje:"No se ha podido leer el directorio"})
        }else{
            const urlFinal = archivos.map((archivo) =>{
                return {
                    url: `http://localhost:3000/fotos/${archivo}`
                    nombre: archivo
                }
            })
            res.send({mensaje: "Urls encontradas:", results: urlFinal})
        }
    })
})


app.get('/descarga/:archivo', (req, res)=>{
    res.download('./archivos/'+req.params.archivo)
})


app.listen(process.env.PORT || 3000, (e)=>{
    e
    ? console.error('No hay servidor xiki')
    : console.log('Servidor a la escucha en el puerto:' + (process.env.PORT || 3000))
} )