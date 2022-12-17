const { nanoid } = require('nanoid')
const books = require('./books.js')

const addBooksHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = pageCount === readPage
  const newBooks = {
    id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt
  }
  const noNameBook = name === undefined
  const invalidRead = readPage > pageCount

  if (!noNameBook && !invalidRead && id.length > 0) {
    books.push(newBooks)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    }).code(201)
    return response
  } else if (noNameBook) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400)
    return response
  } else if (invalidRead) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
    return response
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  }).code(500)
  return response
}

const listAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query
  let searchBook = books

  if (name !== undefined) {
    searchBook = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase()))
  } else if (reading !== undefined) {
    searchBook = books.filter((book) =>
      Number(book.reading) === Number(reading))
  } else if (finished !== undefined) {
    searchBook = books.filter((book) =>
      Number(book.finished) === Number(finished))
  }

  const response = h.response({
    status: 'success',
    data: {
      books: searchBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  }).code(200)
  return response
}

const getBookbyIdHandler = (request, h) => {
  const { bookId } = request.params
  const book = books.filter((n) => n.id === bookId)[0]

  if (book) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }).code(404)
  return response
}

const editBookHandler = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      }).code(400)
      return response
    }
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      }).code(400)
      return response
    }

    const finished = pageCount === readPage
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
      finished
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    }).code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  }).code(404)
  return response
}

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params
  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    }).code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  }).code(404)
  return response
}

module.exports = { addBooksHandler, listAllBooksHandler, getBookbyIdHandler, editBookHandler, deleteBookHandler }
