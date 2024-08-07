const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

function transformTickets(tickets) {
  return tickets.map((ticket) => ({
    ticketId: ticket.ticket_id,
    correctStatus: ticket.correct,
    incorrectStatus: ticket.incorrect,
  }));
}

// Funkcja zapisująca incorrectTickets do pliku CSV
module.exports = function (incorrectTickets, filename) {
  const csvWriter = createCsvWriter({
    path: filename,
    header: [
      { id: "ticketId", title: "Ticket ID" },
      { id: "correctStatus", title: "Correct Status" },
      { id: "incorrectStatus", title: "Incorrect Status" },
    ],
  });

  const transformedTickets = transformTickets(incorrectTickets);

  csvWriter
    .writeRecords(transformedTickets)
    .then(() => {
      console.log("Lista incorrectTickets została zapisana do pliku:", filename);
    })
    .catch((err) => {
      console.error("Błąd podczas zapisywania pliku CSV:", err);
    });
};

// Przykładowe użycie
const incorrectTickets = [
  { ticketId: 1, correctStatus: "Resolved" },
  { ticketId: 2, correctStatus: "In progress" },
];

//  exportToCSV(incorrectTickets, "incorrectTickets.csv");
