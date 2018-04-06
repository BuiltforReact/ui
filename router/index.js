const routes = module.exports = require('next-routes')()

routes.add('home', '/', 'index').add('about').add('detail', '/:author/:repo', 'detail')
