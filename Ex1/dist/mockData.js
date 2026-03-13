"use strict";
// src/mockData.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockApi = exports.notifications = exports.posts = exports.users = exports.orders = exports.notification3 = exports.notification2 = exports.notification1 = exports.post3 = exports.post2 = exports.post1 = exports.foodOrder3 = exports.foodOrder2 = exports.foodOrder1 = exports.userData2 = exports.userData1 = exports.listofNumbersTwo = exports.listofNumbersOne = exports.listofItems = void 0;
exports.testObjectAndArray = testObjectAndArray;
// List exports
exports.listofItems = ["apple", "banana", "orange"];
exports.listofNumbersOne = [1, 2, 3, 4, 5];
exports.listofNumbersTwo = [6, 7, 8, 9, 10];
// User data
exports.userData1 = {
    id: 1,
    firstname: "Bona",
    lastname: "Tamirat",
    sex: "Male"
};
exports.userData2 = {
    id: 2,
    firstname: "Bontu",
    lastname: "Garatu",
    sex: "Female"
};
// Order Mock Data
exports.foodOrder1 = {
    id: 1,
    name: "shiro",
    orderNumber: 123,
    date: "2024-06-01",
    hotel: "Abissinia",
    price: 20,
    currency: "ETB",
    userId: 12
};
exports.foodOrder2 = {
    id: 2,
    name: "Bayinet",
    orderNumber: 123,
    date: "2024-06-01",
    hotel: "Tayitu",
    price: 60,
    currency: "ETB",
    userId: 12
};
exports.foodOrder3 = {
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
exports.post1 = {
    id: 1,
    title: "Title of Post1",
    body: "Text Body1",
    createdAt: new Date().toISOString(),
    userId: 12
};
exports.post2 = {
    id: 2,
    title: "Title of Post2",
    body: "Text Body2",
    createdAt: new Date().toISOString(),
    userId: 12
};
exports.post3 = {
    id: 3,
    title: "Title of Post3",
    body: "Text Body3",
    createdAt: new Date().toISOString(),
    userId: 13
};
// Notifications
exports.notification1 = {
    id: 1,
    title: "Notification Title1",
    body: "Notification Body1",
    icon: "Icon1",
    userId: 12
};
exports.notification2 = {
    id: 2,
    title: "Notification Title2",
    body: "Notification Body2",
    icon: "Icon2",
    userId: 12
};
exports.notification3 = {
    id: 3,
    title: "Notification Title3",
    body: "Notification Body3",
    icon: "Icon3",
    userId: 13
};
// Collections
exports.orders = [exports.foodOrder1, exports.foodOrder2, exports.foodOrder3];
exports.users = [exports.userData1, exports.userData2];
exports.posts = [exports.post1, exports.post2, exports.post3];
exports.notifications = [exports.notification1, exports.notification2, exports.notification3];
// Mock API functions (simulate server responses)
exports.mockApi = {
    // Get all items
    getItems: () => exports.listofItems,
    getNumbers: () => [...exports.listofNumbersOne, ...exports.listofNumbersTwo],
    getUsers: () => exports.users,
    getOrders: () => exports.orders,
    getPosts: () => exports.posts,
    getNotifications: () => exports.notifications,
    // Get by ID
    getUserById: (id) => exports.users.find(user => user.id === id),
    getOrderById: (id) => exports.orders.find(order => order.id === id),
    getPostById: (id) => exports.posts.find(post => post.id === id),
    // Get by userId
    getUserContent: (userId) => ({
        posts: exports.posts.filter(post => post.userId === userId),
        notifications: exports.notifications.filter(notif => notif.userId === userId),
        orders: exports.orders.filter(order => order.userId === userId)
    })
};
// Test function
function testObjectAndArray() {
    console.log("=== Testing Mock Data ===");
    console.log("List of items:", exports.listofItems);
    console.log("User data:", exports.userData1);
    console.log("Orders:", exports.orders);
    console.log("Posts:", exports.posts);
    console.log("Notifications:", exports.notifications);
}
