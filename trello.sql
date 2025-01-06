-- Create Columns Table
CREATE TABLE columns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Insert dummy data into Columns
INSERT INTO columns (name) VALUES
('Backlog'),
('To do'),
('Done');

-- Create Tags Table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bg_color VARCHAR(255),
    font_color VARCHAR(255)
);

-- Insert dummy data into Tags
INSERT INTO tags (name, bg_color, font_color) VALUES
('Study', '#35b035', '#FFFF'),
('Work', '#ddbcf0', '#FFFF'),
('Sport', '#ec0e0e', '#FFFF');

-- Create Cards Table
CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tag_id INT REFERENCES tags(id),
    column_id INT REFERENCES columns(id),
    position INT
);

-- Insert dummy data into Cards
INSERT INTO cards (title, description, tag_id, column_id, position) VALUES
('Study Math', 'Study for Math Exam', 1, 1, 1),
('Do Freelance', 'Do Freelance Assignment', 2, 1, 2),
('Go Walk', 'Walk for 20 minutes', 3, 2, 1);

-- Create Logs Table
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy data into Logs table
INSERT INTO logs (description, timestamp) VALUES
('''Go Walk'' is newly added to ''Backlog''', '2025-01-06T15:26:47.802Z'),
('''Do Freelance'' was moved down within the column ''Backlog''', '2025-01-05T15:26:47.802Z');
