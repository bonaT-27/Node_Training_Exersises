// src/mockData.ts

// List exports
export const listofItems = ["apple", "banana", "orange"];
export const listofNumbersOne = [1, 2, 3, 4, 5];
export const listofNumbersTwo = [6, 7, 8, 9, 10];

// User data
export const userData1 = {
    id: 1,
    firstname: "Bona",
    lastname: "Tamirat",
    sex: "Male"
};

export const userData2 = {
    id: 2,
    firstname: "Bontu",
    lastname: "Garatu",
    sex: "Female"
};

// Order Mock Data
export const foodOrder1 = {
    id: 1,
    name: "shiro",
    orderNumber: 123,
    date: "2024-06-01",
    hotel: "Abissinia",
    price: 20,
    currency: "ETB",
    userId: 12
};

export const foodOrder2 = {
    id: 2,
    name: "Bayinet",
    orderNumber: 123,
    date: "2024-06-01",
    hotel: "Tayitu",
    price: 60,
    currency: "ETB",
    userId: 12
};

export const foodOrder3 = {
    id: 3,
    name: "Tibs",
    orderNumber: 13,
    date: "",
    hotel: "Mr y",
    price: 40,
    currency: "ETB",
    userId: 13
};

// Posts
export const post1 = {
    id: 1,
    title: "Title of Post1",
    body: "Text Body1",
    createdAt: new Date().toISOString(),
    userId: 12
};

export const post2 = {
    id: 2,
    title: "Title of Post2",
    body: "Text Body2",
    createdAt: new Date().toISOString(),
    userId: 12
};

export const post3 = {
    id: 3,
    title: "Title of Post3",
    body: "Text Body3",
    createdAt: new Date().toISOString(),
    userId: 13
};

// Notifications
export const notification1 = {
    id: 1,
    title: "Notification Title1",
    body: "Notification Body1",
    icon: "Icon1",
    userId: 12
};

export const notification2 = {
    id: 2,
    title: "Notification Title2",
    body: "Notification Body2",
    icon: "Icon2",
    userId: 12
};

export const notification3 = {
    id: 3,
    title: "Notification Title3",
    body: "Notification Body3",
    icon: "Icon3",
    userId: 13
};

// Collections
export const orders = [foodOrder1, foodOrder2, foodOrder3];
export const users = [userData1, userData2];
export const posts = [post1, post2, post3];
export const notifications = [notification1, notification2, notification3];

// Mock API functions (simulate server responses)
export const mockApi = {
    // Get all items
    getItems: () => listofItems,
    getNumbers: () => [...listofNumbersOne, ...listofNumbersTwo],
    getUsers: () => users,
    getOrders: () => orders,
    getPosts: () => posts,
    getNotifications: () => notifications,

    // Get by ID
    getUserById: (id: number) => users.find(user => user.id === id),
    getOrderById: (id: number) => orders.find(order => order.id === id),
    getPostById: (id: number) => posts.find(post => post.id === id),
    
    // Get by userId
    getUserContent: (userId: number) => ({
        posts: posts.filter(post => post.userId === userId),
        notifications: notifications.filter(notif => notif.userId === userId),
        orders: orders.filter(order => order.userId === userId)
    })
};

// Test function
export function testObjectAndArray() {
    console.log("=== Testing Mock Data ===");
    console.log("List of items:", listofItems);
    console.log("User data:", userData1);
    console.log("Orders:", orders);
    console.log("Posts:", posts);
    console.log("Notifications:", notifications);
}