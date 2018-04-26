const taxreturn = {
  type: 'taxreturn',
  url: 'http://localhost:3000/api/taxreturn',
  body: (data)  => {
    return {
      client_id: data.client.client_id
    };
  }
};

export default taxreturn;