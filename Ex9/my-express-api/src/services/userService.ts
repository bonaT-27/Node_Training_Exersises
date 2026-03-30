export const getUser = (id: number) => {
  if (id <= 0) {
    throw new Error('Invalid ID');
  }

  return {
    id,
    name: 'Bona',
    email: 'bona@example.com'
  };
};

export const getUsers = () => {
  return [
    { id: 1, name: 'Bona' },
    { id: 2, name: 'John' }
  ];
};