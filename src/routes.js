// Berkas Routes

const {
  addNoteHandler,
  getAllNotesHandler,
  getNotebyIdHandler,
  editNotebyIdHandler,
  deleteNoteByIdHandler,
  addBookHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'POST',
    path: '/notes',
    handler: addNoteHandler,
  },
  {
    method: 'GET',
    path: '/notes',
    handler: getAllNotesHandler,
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: getNotebyIdHandler,
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    handler: editNotebyIdHandler,
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: deleteNoteByIdHandler,
  },
];

module.exports = routes;