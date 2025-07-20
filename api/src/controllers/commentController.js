const prisma = require('../../config/db');

// GET /api/comments - Return all comments
exports.getAllComments = async (req, res) => {
  try {
    const userBooks = await prisma.book.findMany({
      where: { user_id: req.user.userId },
      select: { id: true },
    })

    const userBookIds = userBooks.map(b => b.id)

    const comments = await prisma.comment.findMany({
      where: { book_id: { in: userBookIds } },
      orderBy: { created_at: 'desc' },
    })

    res.json({ message: 'Comments fetched successfully.', data: comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}


// GET /api/comments/:id - Return a comment by ID if its chapter's book belongs to the user
exports.getCommentById = async (req, res) => {
  const commentId = parseInt(req.params.id, 10)
  if (isNaN(commentId)) {
    return res.status(400).json({ message: 'Invalid comment ID.' })
  }

  try {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } })
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' })
    }

    const book = await prisma.book.findUnique({ where: { id: comment.book_id } })
    if (!book || book.user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access to comment.' })
    }

    res.json({ message: 'Comment fetched successfully.', data: comment })
  } catch (error) {
    console.error('Error fetching comment:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}


// GET /api/chapters/:id/comments - Return all comments for a chapter
exports.getCommentsByBookId = async (req, res) => {
  const bookId = parseInt(req.params.id, 10)
  if (isNaN(bookId)) {
    return res.status(400).json({ message: 'Invalid book ID.' })
  }

  try {
    const book = await prisma.book.findUnique({ where: { id: bookId } })
    if (!book || book.user_id !== req.user.userId) {
      return res.status(404).json({ message: 'Book not found or not owned by user.' })
    }

    const comments = await prisma.comment.findMany({
      where: { book_id: bookId },
      orderBy: { created_at: 'desc' },
    })

    res.json({ message: 'Comments fetched successfully.', data: comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}


// POST /api/comments - Create a comment
exports.createComment = async (req, res) => {
  const { book_id, content } = req.body;

  if (!book_id || isNaN(parseInt(book_id, 10))) {
    return res.status(400).json({ message: 'book_id is required and must be an integer.' });
  }

  if (!content || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ message: 'Content is required.' });
  }

  try {
    const book = await prisma.book.findUnique({ where: { id: parseInt(book_id, 10) } });
    if (!book || book.user_id !== req.user.userId) {
      return res.status(404).json({ message: 'Book not found or not owned by user.' });
    }

    const newComment = await prisma.comment.create({
      data: {
        book_id: parseInt(book_id, 10),
        content: content.trim(),
      },
    });

    res.status(201).json({ message: 'Comment created successfully.', data: newComment });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


// PUT /api/comments/:id - Update a comment's content
exports.updateComment = async (req, res) => {
  const commentId = parseInt(req.params.id, 10);

  if (isNaN(commentId)) {
    return res.status(400).json({ message: 'Invalid comment ID.' });
  }

  const { content } = req.body;
  if (content !== undefined && (typeof content !== 'string' || !content.trim())) {
    return res.status(400).json({ message: 'Content must be a non-empty string.' });
  }

  try {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    const book = await prisma.book.findUnique({ where: { id: comment.book_id } });
    if (!book || book.user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access to comment.' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: content?.trim() ?? comment.content,
      },
    });

    res.json({ message: 'Comment updated successfully.', data: updatedComment });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


// DELETE /api/comments/:id - Delete a comment
exports.deleteComment = async (req, res) => {
  const commentId = parseInt(req.params.id, 10);

  if (isNaN(commentId)) {
    return res.status(400).json({ message: 'Invalid comment ID.' });
  }

  try {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    const book = await prisma.book.findUnique({ where: { id: comment.book_id } });
    if (!book || book.user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access to comment.' });
    }

    await prisma.comment.delete({ where: { id: commentId } });
    res.json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

