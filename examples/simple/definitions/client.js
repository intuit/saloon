const client = {
  type: 'client',
  url: 'http://localhost:3000/api/client',
  body: data => {
    return {
      firm_id: data.firm.firm_id,
      lastName: 'defaultLastName'
    };
  }
};

export default client;
