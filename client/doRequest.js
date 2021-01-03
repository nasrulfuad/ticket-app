process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const axios = require("axios");

const cookie =
  "express:sess=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalZtWmpGaU16WTJPVEpsT1RCaU1EQXlNalUwWXpRNE5pSXNJbVZ0WVdsc0lqb2lhbTlvYmtCbGJXRnBiQzVqYjIwaUxDSnBZWFFpT2pFMk1EazJOelUyTWpKOS5OcThYaUZMMUVEeGdtZlVDSUJoVlVXYXJTbnlCUlpwNFZjUE5maHM1NHk4In0=";

const doRequest = async () => {
  try {
    const { data } = await axios.post(
      `https://ticket.com/api/tickets`,
      { title: "ticket", price: 5 },
      {
        headers: { cookie },
      }
    );

    await axios.put(
      `https://ticket.com/api/tickets/${data.id}`,
      { title: "ticket", price: 10 },
      {
        headers: { cookie },
      }
    );

    axios.put(
      `https://ticket.com/api/tickets/${data.id}`,
      { title: "ticket", price: 15 },
      {
        headers: { cookie },
      }
    );
    console.log("Request complete");
  } catch (error) {
    console.log(error.response.data);
  }
};

(async () => {
  for (let i = 0; i < 600; i++) {
    doRequest();
  }
})();
