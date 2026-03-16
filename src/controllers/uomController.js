const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM uom', (err, uoms) => {
            if (err) {
                return res.json(err);
            }

            res.json({
                success: true,
                data: uoms
            });
        });
    });
};

controller.save = (req, res) => {
    const uoms = req.body.uoms;
    const uomDML = uoms.map((uom) => {
        if (uom.id > 0 && uom.name !== 'delete') {
            return { ...uom, action: 'UPDATE' };
        }
        if (uom.id == 0) {
            return { ...uom, action: 'INSERT' };
        }
        if (uom.name === 'delete') {
            return { ...uom, action: 'DELETE' };
        }
    });

    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).json({
                isSuccess: false,
                message: 'Database connection failed',
                error: err.message
            });
        }

        conn.query('CALL sp_uom_bulk(?)', [JSON.stringify(uomDML)], (err, result) => {
            if (err) {
                return res.status(500).json({
                    isSuccess: false,
                    message: 'Failed to save uom',
                    error: err.message
                });
            }

            res.json({
                isSuccess: true,
                message: 'UOM saved successfully',
                data: {
                }
            });
        });
    });
};

module.exports = controller;