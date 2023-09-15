import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    host: 'db',
    port: 5432,
    database: 'cloud',
    user: 'postgres',
    password: 'postgres',
})

await client.connect();

export const getCurrentCounter = async () => {
    try {
        const tableExists = await doesTableExist();

        if (tableExists) {
            const existingEntry = await client.query(`SELECT * FROM counter;`);
            const counter = existingEntry.rows[0].counter
            return counter;
        }
    }
    catch (err) {

    }
}

const doesTableExist = async () => {
    const result = await client.query('SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)', ['counter'])
    const tableExists = result.rows[0].exists
    return tableExists;
}

export const createTableIfNotExists = async () => {

    try {
        const tableExists = await doesTableExist()

        if (!tableExists) {
            const res = await client.query(' CREATE TABLE IF NOT EXISTS counter (\
            id SERIAL PRIMARY KEY, \
            counter INTEGER \
          )')

            console.log("Created database successfully")
        }
    }
    catch (err) {
        console.log("Error creating database")
    }
}

export const updateCounter = async () => {
    try {

        const existingEntry = await client.query(`
        SELECT * FROM counter;
      `);

        let currentCount;

        if (existingEntry.rowCount > 0) {
            const res = await client.query(`
              UPDATE counter
              SET counter = counter + 1
              WHERE id = $1
              RETURNING counter;
            `, [existingEntry.rows[0].id]);
            console.log('Entry updated successfully.');
            currentCount = res.rows[0].counter
            console.log(currentCount)
        } else {
            const res = await client.query(`
          INSERT INTO counter (counter)
          VALUES (1);
        `);
            console.log('Entry created successfully.');
        }

        return currentCount;
    }
    catch (err) {

    }
}
