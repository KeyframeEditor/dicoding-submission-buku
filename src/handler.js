// Berkas Handler

const { nanoid } = require('nanoid');
const notes = require('./notes');

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

  // Check if readPage is greater than pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Check if name is empty or undefined
  if (name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // Check if the book is completed (pageCount is 100 and readPage is 100)
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

  notes.push(newBook);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

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

const getAllBooksHandler = () => {
  const responseBody = {
    status: 'success',
    data: {
      books: notes.map((note) => ({
        id: note.id,
        name: note.name,
        publisher: note.publisher,
      })),
    },
  };
  return responseBody;
};

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      messege: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    messege: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const foundBook = notes.find((book) => book.id === bookId);

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

const getNotebyIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    messege: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookbyIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Find the book with the specified ID in the "notes" array
  const foundBookIndex = notes.findIndex((book) => book.id === bookId);

  // Check if book is found or not
  if (foundBookIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const foundBook = notes[foundBookIndex];

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

  // Check if readPage is greater than pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Check if name is empty or undefined
  if (!name || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // Update the found book with the new values
  notes[foundBookIndex] = {
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

const editNotebyIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      messege: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    messege: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Find the index of the book with the specified ID in the "notes" array
  const foundBookIndex = notes.findIndex((book) => book.id === bookId);

  // Check if book is found or not
  if (foundBookIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404); // Set the response status code to 404
    return response;
  }

  // Remove the book from the "notes" array using splice
  notes.splice(foundBookIndex, 1);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200); // Set the response status code to 200
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      messege: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    messege: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNotebyIdHandler,
  editNotebyIdHandler,
  deleteNoteByIdHandler,
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookbyIdHandler,
  deleteBookByIdHandler,
};