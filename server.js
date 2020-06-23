const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
// db.json를 조작하기 위해 lowdb를 사용
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
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
server.post('/users', (req, res) => {
  // const { token } = req.params;
  // const { id, from, to, title, memo, length, fkTable } = req.body;
  // const { data } = req.body;
  db.get('users')
    // .find({ token })
    // .value()
    // .value()
    .push(req.params.name)
    .write();
  res.send(db.get('users').value());
});
// Use default router
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
