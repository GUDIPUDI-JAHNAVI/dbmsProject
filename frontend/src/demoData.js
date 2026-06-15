const DEMO_USERS_KEY = 'demoUsers';

export const demoItems = [
  { id: 1, name: 'The Great Gatsby', description: 'Classic American novel set in the Jazz Age.', category: 'Books', price: 12.99, rating: 4.5 },
  { id: 2, name: 'Clean Code', description: 'A handbook of agile software craftsmanship.', category: 'Books', price: 34.99, rating: 4.8 },
  { id: 3, name: 'Atomic Habits', description: 'Build good habits and break bad ones.', category: 'Books', price: 16.5, rating: 4.7 },
  { id: 4, name: 'Database Systems', description: 'Concepts and design for modern databases.', category: 'Books', price: 58.0, rating: 4.4 },
  { id: 5, name: 'Wireless Headphones', description: 'Noise-cancelling over-ear headphones.', category: 'Electronics', price: 129.99, rating: 4.6 },
  { id: 6, name: 'Smart Watch', description: 'Fitness tracking with heart-rate monitor.', category: 'Electronics', price: 199.0, rating: 4.3 },
  { id: 7, name: 'USB-C Hub', description: '7-in-1 adapter for laptops and tablets.', category: 'Electronics', price: 39.99, rating: 4.2 },
  { id: 8, name: 'Bluetooth Speaker', description: 'Portable speaker with deep bass.', category: 'Electronics', price: 49.5, rating: 4.1 },
  { id: 9, name: 'Denim Jacket', description: 'Classic fit denim jacket for all seasons.', category: 'Clothing', price: 59.99, rating: 4.4 },
  { id: 10, name: 'Running Shoes', description: 'Lightweight shoes for daily training.', category: 'Clothing', price: 89.0, rating: 4.6 },
  { id: 11, name: 'Summer Dress', description: 'Floral print dress with breathable fabric.', category: 'Clothing', price: 45.0, rating: 4.3 },
  { id: 12, name: 'Hooded Sweatshirt', description: 'Soft fleece hoodie with front pocket.', category: 'Clothing', price: 38.5, rating: 4.0 },
  { id: 13, name: 'Data Structures in Java', description: 'Algorithms and structures for interviews.', category: 'Books', price: 42.0, rating: 4.5 },
  { id: 14, name: '4K Monitor', description: '27-inch display with vivid color accuracy.', category: 'Electronics', price: 279.99, rating: 4.7 },
  { id: 15, name: 'Leather Belt', description: 'Genuine leather belt with metal buckle.', category: 'Clothing', price: 24.99, rating: 3.9 },
  { id: 16, name: 'Mechanical Keyboard', description: 'RGB keyboard with tactile switches.', category: 'Electronics', price: 99.0, rating: 4.5 },
  { id: 17, name: 'Cookbook Essentials', description: 'Quick recipes for busy weeknights.', category: 'Books', price: 22.0, rating: 4.1 },
  { id: 18, name: 'Winter Scarf', description: 'Warm wool scarf in neutral tones.', category: 'Clothing', price: 18.0, rating: 4.2 },
];

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
};

export const demoSignup = (payload) => {
  const email = payload.email?.trim().toLowerCase();
  const users = readUsers();
  if (users.some((user) => user.email === email)) {
    return { code: 400, message: 'Email already registered' };
  }
  users.push({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email,
    password: payload.password,
  });
  writeUsers(users);
  return { code: 200, message: 'Account created successfully' };
};

export const demoSignin = (payload) => {
  const email = payload.username?.trim().toLowerCase();
  const user = readUsers().find(
    (entry) => entry.email === email && entry.password === payload.password
  );
  if (!user) {
    return { code: 401, message: 'Invalid email or password' };
  }
  const token = `demo-token-${user.email}`;
  return {
    code: 200,
    jwt: token,
    data: {
      token,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    },
  };
};

export const demoSearch = (searchParams) => {
  const query = (searchParams.get('q') || '').trim().toLowerCase();
  const category = searchParams.get('category') || 'all';
  const minPrice = Number(searchParams.get('minPrice') || 0);
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null;
  const minRating = Number(searchParams.get('minRating') || 0);
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const pageSize = Math.max(1, Number(searchParams.get('pageSize') || 12));

  let filtered = demoItems.filter((item) => {
    const matchesQuery =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);
    const matchesCategory = category === 'all' || item.category === category;
    const matchesMinPrice = !minPrice || item.price >= minPrice;
    const matchesMaxPrice = maxPrice == null || item.price <= maxPrice;
    const matchesRating = item.rating >= minRating;
    return matchesQuery && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating;
  });

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize).map((item) => ({
    ...item,
    image: `/assets/${item.category.toLowerCase()}-${item.id}`,
  }));

  return {
    code: 200,
    data: {
      items,
      totalCount,
      totalPages,
      page,
      pageSize,
    },
  };
};
