const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM category', (err, categories) => {
            if (err) {
                return res.json(err);
            }
            res.json({
                success: true,
                data: categories
            });
        });
    });
};

controller.save = (req, res) => {
    // Expect either a single category or an array of categories
    let categories = req.body.categories;

    if (!categories) {
        // try single
        categories = [
            {
                code: req.body.code,
                name: req.body.name
            }
        ];
    }

    const values = categories.map(c => [c.code, c.name]);

    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).json({
                isSuccess: false,
                message: "Database connection failed",
                error: err.message
            });
        }

        conn.query('INSERT INTO category(code,name) VALUES ?', [values], (err, result) => {
            if (err) {
                return res.status(500).json({
                    isSuccess: false,
                    message: "Failed to insert category",
                    error: err.message
                });
            }

            res.json({
                isSuccess: true,
                message: "Category saved successfully",
                data: {
                    id: result.insertId,
                    inserted: values
                }
            });
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM category WHERE id = ?', [id], (err, rows) => {
            if (err) {
                return res.json(err);
            }
            res.redirect('/');
        });
    });
};

controller.edit = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM category WHERE id = ?', [id], (err, category) => {
            if (err) {
                return res.json(err);
            }
            res.render('category_edit', {
                data: category[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newCategory = req.body;

    req.getConnection((err, conn) => {
        conn.query('UPDATE category SET ? WHERE id = ?', [newCategory, id], (err, rows) => {
            if (err) {
                return res.json(err);
            }
            res.redirect('/');
        });
    });
};

module.exports = controller;
