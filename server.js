const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const cors = require("cors");
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
// db.json를 조작하기 위해 lowdb를 사용
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cors());
/* get 요청 */
// server.get('/users', (req, res) => {
//   res.send(db.get('users').value());
// });
// token get
server.get('/users/:token', (req, res) => {
  const { token } = req.params;
  res.send(db.get('users').find({ token }).value());
});
// token -> schedules get
server.get('/users/:token/schedules', (req, res) => {
  const { token } = req.params;
  res.send(db.get('users').find({ token }).value().schedules);
});
// token -> tables get
server.get('/users/:token/tables', (req, res) => {
  const { token } = req.params;
  res.send(db.get('users').find({ token }).value().tables);
});
/* post 요청 */
// token -> schedules post
server.post('/users/:token/schedules', (req, res) => {
  const { token } = req.params;
  db.get('users')
    .find({ token })
    .value().schedules
    .push(req.body);
  db.write();
  res.send(db.get('users').find({ token }).value().schedules);
});
// token -> tables post
server.post('/users/:token/tables', (req, res) => {
  const { token } = req.params;
  db.get('users')
    .find({ token })
    .value().tables
    .push(req.body);
  db.write();
  res.send(db.get('users').find({ token }).value().tables);
});

/* patch 요청 */
// token -> tables/order patch
server.patch('/users/:token/tables/:order', (req, res) => {
  const { token, order } = req.params;
  const { tables } = db.get('users').find({ token }).value();
  const index = tables.findIndex(table => table.order === +order);
  const newTable = { ...tables[index], ...req.body };
  tables.splice(index, 1, newTable);
  db.write();
  res.send(db.get('users').find({ token }).value().tables);
});
/* patch 요청 */
// token -> tables/id patch
server.patch('/users/:token/tables/:id', (req, res) => {
  const { token, id } = req.params;
  const tables = db.get('users').find({ token }).value().tables
  const table = tables.find(table => table.id === +id)
  const index = tables.indexOf(table);
  const newTable = { ...tables[index], ...req.body }
  tables.splice(index, 1, newTable);
  db.write();
  res.send(db.get('users').find({ token }).value().tables);
})
/* delete 요청 */
// token -> tables/order delete
server.delete('/users/:token/tables/:order', (req, res) => {
  const { token, order } = req.params;
  const { tables } = db.get('users').find({ token }).value();
  const index = tables.findIndex(table => table.order === +order);
  if (index !== -1) {
    tables.splice(index, 1);
    db.write();
  }
  res.send(db.get('users').find({ token }).value().tables);
});

// token -> schedules/id delete
server.delete('/users/:token/schedules/:id', (req, res) => {
  const { token, id } = req.params;
  const { schedules } = db.get('users').find({ token }).value();
  const index = schedules.findIndex(table => table.id === +id);
  if (index !== -1) {
    schedules.splice(index, 1);
    db.write();
  }
  res.send(db.get('users').find({ token }).value().schedules);
});
// Use default router
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running')
});