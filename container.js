const fs = require('fs');
  

class Container {
    constructor(){
    }
    /**save(Object): Number - Recibe un objeto, lo guarda en el archivo, 
    * devuelve el id asignado. 
    * */
    saveProduct(product , file){
        // Recibo un objeto del array productos
        console.log('Guardando...', product);
        // Consulto a la función getNextId para obtener proximo id disponible
        let nextId = this.getNextId(file);
        // Agrego la propiedad id al objeto
        product.id = nextId;
        // console.log(product)
         // leo todos los archivos del file
        const allProductsArray = this.read(file);
         // console.log('allProductsArray', allProductsArray);
         // le agrego el nuevo producto al array
        allProductsArray.push(product);
        // console.log('allProductsArray', allProductsArray);
        // Guardo el archivo
        this.write(allProductsArray, file);
        // console.log('allProductsArray saved', allProductsArray);
    }
    
    updateProduct(id, product, file){
        console.log('Actualizando...', product);
        // busco el producto por id
       const allProductsArray = this.read(file);
         let index = allProductsArray.findIndex(product => product.id == id);
            if(index >= 0){
                allProductsArray[index] = product;
                this.write(allProductsArray, file);
                console.log('Actualizado');
            }else{
                console.log('No se encontro el producto');
            }
    }
      


    getNextId(file){
        let lastId = 0;
        let allProductsArray = this.read(file);
        if(allProductsArray.length > 0){
            lastId = allProductsArray[allProductsArray.length - 1].id;
        }
        return lastId + 1;
    }

    read(file){
        let allProductsArray = [];
        try{
            allProductsArray = fs.readFileSync(file, 'utf8');
            //console.log('read allProductsArray', allProductsArray);
            allProductsArray.length > 0 ? allProductsArray = JSON.parse(allProductsArray): allProductsArray = [];
        }catch(err){
            console.log('Error en la lectura del archivo', err);
        }
        return allProductsArray;
    }

     write(allProductsArray, file){
        // vuelvo a convertir el array en string para guardarlo en el archivo
        let json = JSON.stringify(allProductsArray);
        try{
            fs.writeFileSync(file, json);
        }catch(err){
            console.log('Error en la escritura', err);
        }
    }


    /**getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está. */
    getById(id, file){
        let allProductsArray = this.read(file);
        let product = allProductsArray.find(product => product.id == id);
        return product ? product : null;
    }

    /**getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo. */
    getAll(file){
        let allProductsArray = this.read(file);
        return allProductsArray;
    }

    /**deleteById(Number): void - Elimina del archivo el objeto con el id buscado. */
    deleteById(id, file){
        let allProductsArray = this.read(file);
        let index = allProductsArray.findIndex(product => product.id == id);
        if(index >= 0){
            allProductsArray.splice(index, 1);
            let json = JSON.stringify(allProductsArray);
            try{
                fs.writeFileSync(file, json);
                return id
            }
            catch(err){
                console.log('Error en la escritura', err);
            }
        }
    }
    /**deleteAll(): void - Elimina todos los objetos presentes en el archivo. */
    deleteAll(file){
        let allProductsArray = [];
        let json = JSON.stringify(allProductsArray);
        try{
            fs.writeFileSync(file, json);
        }
        catch(err){
            console.log('Error en la escritura', err);
        }
    }

    

}



module.exports = Container;