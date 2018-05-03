const firm = {
  type: 'firm',
  url: 'http://localhost:3000/api/firm',
  body: data => ({
    user_id: data.user.user_id,
  }),
};

export default firm;
