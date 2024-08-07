const mysql = require("mysql2");
const axios = require("axios");
const exportcsv = require("./exportcsv");

// First, I've set up local SQL database with MySQLWorkbench and imported all tickets data.
// Then I installed mysql2 package with npm to connect with database.

const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Password123!",
  database: "public",
});

database.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
  getTicketStatuses();
});

// I wrote function to get proper ticket status from provided API
const getCorrectTicketStatus = async (ticketId) => {
  try {
    const res = await axios.get(`https://customizations.zowie.dev/ecommerce/tickets/${ticketId}`, {
      headers: { "X-API-KEY": "c895a35c365541c4ac22a61d13bc388d" }, // It should be in .env file for safety reasons but I will let it here as it's only excercise.
    });
    return res.data.status;
  } catch (error) {
    console.error(error);
  }
};

// I'm fetching list of all tickets from database and check in which one status is incorrect.
// All incorrect tickets are saving into new array and exporting to csv file.
const getTicketStatuses = () => {
  const query = `SELECT ticket_id, status FROM public.tickets`;
  const incorrectTickets = [];

  database.query(query, async (err, res) => {
    if (err) throw err;

    // const numberOfTickets = 10; // There are 10k tickets so for testing I am limiting it's number
    let count = 0; // Counter to know if process is running properly

    // for (const ticket of res.slice(0, numberOfTickets)) {
    for (const ticket of res) {
      const correctStatus = await getCorrectTicketStatus(ticket.ticket_id);

      count = count + 1;

      if (correctStatus !== ticket.status) {
        incorrectTickets.push({ ticket_id: ticket.ticket_id, correct: correctStatus, incorrect: ticket.status });
      }

      console.log(count);
    }

    exportcsv(incorrectTickets, "incorrectTickets.csv");
    // changeIncorrectStatuses(incorrectTickets)
  });
};

// Generate SQL queries to fix tickets statuses
const changeIncorrectStatuses = (incorrectTickets) => {
  const queries = incorrectTickets.map((ticket) => {
    return `UPDATE public.tickets SET status = '${ticket.correct}' WHERE ticket_id = '${ticket.ticket_id}';`;
  });

  queries.forEach((query) => console.log(query));
};
