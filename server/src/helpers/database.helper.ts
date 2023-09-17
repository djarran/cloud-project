import pkg from 'pg';
const { Client } = pkg;

/**
 * Initialise the client used to communicate with the database
 */
const client = new Client({
    host: 'db',
    port: 5432,
    database: 'cloud',
    user: 'postgres',
    password: 'postgres',
})

await client.connect();

/**
 * Get the current counter from the database
 */
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

/**
 * Check if table exists
 */
const doesTableExist = async () => {
    const result = await client.query('SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)', ['counter'])
    const tableExists = result.rows[0].exists
    return tableExists;
}

/**
 * Create table if table doesn't exist
 */
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

/**
 * Update counter
 */
export const updateCounter = async () => {
    try {

        const existingEntry = await client.query(`
        SELECT * FROM counter;
      `);

        let currentCount = 0;

        if (existingEntry.rowCount > 0) { // increase count by 1 and return current count
            const res = await client.query(`
              UPDATE counter
              SET counter = counter + 1
              WHERE id = $1
              RETURNING counter;
            `, [existingEntry.rows[0].id]);
            currentCount = res.rows[0].counter
            return currentCount
        } else {
            const res = await client.query(`
          INSERT INTO counter (counter)
          VALUES (1);
        `);
        }

        return currentCount;
    }
    catch (err) {
        console.log("Error updating counter")
        return {
            message: "Unable to update counter"
        }
    }
}
