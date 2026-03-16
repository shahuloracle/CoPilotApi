CREATE DEFINER=`a2c2cd_ship`@`%` PROCEDURE `sp_uom_bulk`(
	IN `p_json` JSON
)
LANGUAGE SQL
NOT DETERMINISTIC
CONTAINS SQL
SQL SECURITY DEFINER
COMMENT ''
BEGIN
DECLARE i INT DEFAULT 0;
DECLARE total INT;

CREATE TEMPORARY TABLE temp_uom(
    id INT,
    code VARCHAR(50),
    name VARCHAR(500),
    actionType VARCHAR(10)
);

SET total = JSON_LENGTH(p_json);

WHILE i < total DO
    INSERT INTO temp_uom
    VALUES(
        JSON_EXTRACT(p_json, CONCAT('$[', i, '].id')),
        JSON_UNQUOTE(JSON_EXTRACT(p_json, CONCAT('$[', i, '].code'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_json, CONCAT('$[', i, '].name'))),
        JSON_UNQUOTE(JSON_EXTRACT(p_json, CONCAT('$[', i, '].action')))
    );

    SET i = i + 1;
END WHILE;

-- INSERT
INSERT INTO uom(code, name)
SELECT code, name
FROM temp_uom
WHERE actionType = 'INSERT';

-- UPDATE
UPDATE uom u
JOIN temp_uom t
  ON u.id = t.id
SET u.code = t.code,
    u.name = t.name
WHERE t.actionType = 'UPDATE';

-- DELETE
DELETE u
FROM uom u
JOIN temp_uom t
  ON u.id = t.id
WHERE t.actionType = 'DELETE';

DROP TEMPORARY TABLE temp_uom;

END