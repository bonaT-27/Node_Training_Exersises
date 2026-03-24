interface QueryOptions {
  page: number;
  limit: number;
  name?: string;
}

const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Alice" },
  { id: 3, name: "John" },
  { id: 4, name: "Bob" },
  { id: 5, name: "Eve" },
  { id: 6, name: "John" },
];

export const userService = {
  async getUsers(options: QueryOptions) {
    let { page, limit, name } = options;

    // 1. Filtering
    let filteredUsers = users;
    if (name) {
      filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    // 2. Pagination
    const offset = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    return {
      page,
      limit,
      total: filteredUsers.length,
      data: paginatedUsers,
    };
  }
};