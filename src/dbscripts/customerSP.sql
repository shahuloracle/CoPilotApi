CREATE DEFINER=`a2c2cd_ship`@`%` PROCEDURE `sp_customer_bulk`(
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

    CREATE TEMPORARY TABLE temp_customer(
        id INT,
        name VARCHAR(255),
        address VARCHAR(500),
        phone VARCHAR(50),
        actionType VARCHAR(10)
    );

    SET total = JSON_LENGTH(p_json);

    WHILE i < total DO

        INSERT INTO temp_customer
        VALUES(
            JSON_EXTRACT(p_json, CONCAT('$[',i,'].id')),
            JSON_UNQUOTE(JSON_EXTRACT(p_json, CONCAT('$[',i,'].name'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_json, CONCAT('$[',i,'].address'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_json, CONCAT('$[',i,'].phone'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_json, CONCAT('$[',i,'].action')))
        );

        SET i = i + 1;

    END WHILE;

    -- INSERT
    INSERT INTO customer(name,address,phone)
    SELECT name,address,phone
    FROM temp_customer
    WHERE actionType = 'INSERT';

    -- UPDATE
    UPDATE customer c
    JOIN temp_customer t
    ON c.id = t.id
    SET c.name = t.name,
        c.address = t.address,
        c.phone = t.phone
    WHERE t.actionType = 'UPDATE';

    -- DELETE
    DELETE c
    FROM customer c
    JOIN temp_customer t
    ON c.id = t.id
    WHERE t.actionType = 'DELETE';

    DROP TEMPORARY TABLE temp_customer;

END