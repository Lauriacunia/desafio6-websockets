const {Router} = require('express');
const router = Router();
const Container = require('../container')
const file = './products.txt';
const containerProducts = new Container();
const multer = require('multer');
const path = require('path');
const myScript = 'public/main.js';

// Multer config (para subir archivos).
// 'photo' es el nombre del campo en el formulario.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
   
  })
router.use(multer({storage}).single('thumbnail'));

router.get('/', (req, res) => {
   const products = containerProducts.getAll(file)
   res.render('index.ejs', { products ,  myScript});
}
);

// router.get('/:id', (req, res) => {  
//     const { id } = req.params;
//     const product = containerProducts.getById(parseInt(id), file);
//     product ? res.json({product_id: id, producto: product}) 
//             : res.json({message: 'Producto no encontrado. Id: '+ id});
// });

router.post('/', (req, res) => {
   console.log('req.body', req.body);
   const  body  = req.body;
   const photo = req.file;
   console.log(photo);
  //  antes de guardar el objeto le añado la propiedad para que se pueda acceder a la foto.
   body.thumbnail =  '/uploads/'+photo.filename;
   containerProducts.saveProduct(body, file);
   res.redirect('/api/products');
}
);

// router.put('/:id', (req, res) => {
//     const { id } = req.params;
//     const { body } = req;
//     const product = containerProducts.getById(parseInt(id), file);
//     product ? containerProducts.updateProduct(id,body, file) : res.json({message: 'Producto no encontrado. Id: '+ id});
//     res.json({message: 'Producto actualizado', producto: body});
// }
// );

// router.delete('/:id', (req, res) => {
//     const { id } = req.params;
//     const product = containerProducts.deleteById(parseInt(id), file);
//     product ? res.json({message: 'Producto eliminado', id: id}) : res.json({message: 'Producto no encontrado. Id: '+ id});
// }
// );


module.exports = router;