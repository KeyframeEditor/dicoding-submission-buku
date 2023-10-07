const { nanoid } = require('nanoid');
const books = require('./books');

// eslint-disable-next-line consistent-return
const addBookHandler = (request, h) => {
  const {
    name, 
    year, 
    author, 
    summary, 
    publisher, 
    pageCount, 
    readPage, 
    reading,
  } = request.payload;

  // pageCount check
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // book name isEmpty check
  if (name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // book is completed checker
  const finished = pageCount === 100 && readPage === 100;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id, 
    name, 
    year, 
    author, 
    summary, 
    publisher, 
    pageCount, 
    readPage, 
    finished, 
    reading, 
    insertedAt, 
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
};

const getAllBooksHandler = (request, h) => {
  const { name, finished, reading } = request.query;

  let filteredBooks = [...books];

  // name filter
  if (name) {
    const lowercaseName = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(lowercaseName));
  }
  // book finished filter
  if (reading === '0' || reading === '1') {
    filteredBooks = filteredBooks.filter((book) => book.reading === (reading === '1'));
  }

  // book read filter
  if (finished === '0' || finished === '1') {
    filteredBooks = filteredBooks.filter((book) => book.finished === (finished === '1'));
  }

  // show id, name, publisher
  // eslint-disable-next-line no-shadow
  const simplifiedBooks = filteredBooks.map(({ id, name, publisher }) => ({
    id,
    name,
    publisher,
  }));

  return {
    status: 'success',
    data: {
      books: simplifiedBooks,
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const foundBook = books.find((book) => book.id === bookId);

  if (!foundBook) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book: foundBook,
    },
  });
  response.code(200);
  return response;
};

const editBookbyIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Find book
  const foundBookIndex = books.findIndex((book) => book.id === bookId);

  // Check found book ID
  if (foundBookIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const foundBook = books[foundBookIndex];

  const {
    name, 
    year, 
    author, 
    summary, 
    publisher, 
    pageCount, 
    readPage, 
    reading,
  } = request.payload;

  // pageCount check
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // book name isEmpty check
  if (!name || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // update book
  books[foundBookIndex] = {
    ...foundBook,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt: new Date().toISOString(),
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Find book
  const foundBookIndex = books.findIndex((book) => book.id === bookId);

  // Check found book ID
  if (foundBookIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // rm book
  books.splice(foundBookIndex, 1);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookbyIdHandler,
  deleteBookByIdHandler,
};