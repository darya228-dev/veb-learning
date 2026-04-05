interface User {
    id: string;
    name: string;
}

let users: User[] = [];

export const getAll = () => users;

export const getById = (id: string) => users.find(u => u.id === id);

export const add = (name: string) => {
    const user = { id: Date.now().toString(), name };
    users.push(user);
    return user;
};

export const remove = (id: string) => {
    users = users.filter(u => u.id !== id);
};