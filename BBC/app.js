const express = require('express');
const sequelize = require('./src/config/database');
const app = express();

app.use(express.json());

const userRoutes = require('./src/routes/user.routes');
const postRoutes = require('./src/routes/post.routes');
const commentRoutes = require('./src/routes/comment.routes');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

sequelize.sync({ alter: true })
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

module.exports = app;