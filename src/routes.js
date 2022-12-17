const { addBooksHandler, listAllBooksHandler, getBookbyIdHandler, editBookHandler, deleteBookHandler } = require('./handler.js')

const routes = [
  {
    method: 'GET',
    path: '/books',
    handler: listAllBooksHandler
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookbyIdHandler
  },
  {
    method: 'POST',
    path: '/books',
    handler: addBooksHandler
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookHandler
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookHandler
  }
]

module.exports = routes
