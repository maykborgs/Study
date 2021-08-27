const express = require('express');
// exportamos o express usando o require na variavel express.

const server = express();
//a variavel server recebe a variavel express que e uma funcao
server.use(express.json());//adiciona plugin/modulo para entender json

// 3 tipos de parametros:
//query params = ?teste=1
//route params = /user/1
//request body = {"name": "maykon","email": "maaykon51@gmail.com"}
//CRUD - CREATE, READ, UPDATE, DELETE

const users = ['Diego', 'Ines', 'Mosina'];

//middleware global, usamos o next para poder prosseguir e executar os outros middlewares pois o global trava
//criei um log dos middlewares
server.use((req, res, next) => {
  console.time('Request');
  
  console.log(`Metodo: ${req.method}; URL: ${req.url}`);
  
  console.timeEnd('Request')
  return next();
});

//middleware local para checkar se o usuario existe
function checkUserExists(req,res,next){
  if (!req.body.name){
    return res.status(400).json({error: 'User name is required'});
  }
  return next();
}

//middleware local para checkar se o usuario esta armazenado no array
function checkUserInArray(req, res, next){
  const user = users[req.params.index];
  if (!user){
    return res.status(400).json({error:"User doesn't exist"});
  }
  req.user = user //cria nova variavel dentro do metodo req

  return next();
}

server.get('/users', (req,res) => {
  return res.json(users);
});

server.get('/users/:index',checkUserInArray , (req,res) => {
  return res.json(req.user); //uso o req.user definido no middleware checkUserInArray
});

//rota para criar usuario server.post
server.post('/users', checkUserExists, (req,res) =>{
  const { name } = req.body;
  
  users.push(name);

  return res.json(users);
});

//rota para editar usuario server.put
server.put('/users/:index',checkUserInArray, checkUserExists, (req,res) => {
  const { index } = req.params;
  const { name } = req.body;
  
  users[index] = name;

  return res.json(users);
});

server.delete('/users/:index',checkUserInArray, (req,res) => {
  const { index } = req.params;
  
  users.splice(index,1);//vai ate a posicao index do vetor e exclui a partir dali o numero de casas passada no segundo parametro

  return res.send()
});


//toda funcao passada como segundo parametro do metodo server.get (como a rota e manipulada) ela recebe sempre um parametro chamado req(todos os dados da requisicao) e res(todas as informacoes para retornar a resposta para o front)
// (req,res) sao middlewares
//res.send(envia texto para o front) res.json(envia um json)



server.listen(3000);
//ouve a porta 3000, localhost:3000
