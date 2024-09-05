/**
 * @readonly Exposes the function as an NDC function (the function should only query data without making modifications)
 */
export function hello(name?: string): {
    members: {
        a: {
            name: string;
        };
        b: {
            name: string;
        };
    };
} {
    console.log("====", process.env.HASURA_SERVICE_TOKEN_SECRET);
    return {
        members: {
            a: { name: "john" },
            b: { name: "foo" },
        },
    };
}

export function todo(): {
    id: number;
    name: string;
    completed: boolean;
} {
    return {
        completed: false,
        name: "saa",
        id: 1,
    };
}

type Geo = {
    lat: string;
    lng: string;
};

type Address = {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
};

type Company = {
    name: string;
    catchPhrase: string;
    bs: string;
};

type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
};

type Todo = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
    user: User;
};
/**
 * @readonly Exposes the function as an NDC function (the function should only query data without making modifications)
 */
export async function todov2(): Promise<Todo[]> {
    const res = (await fetch("https://jsonplaceholder.typicode.com/todos").then(
        (response) => response.json()
    )) as Todo[];

    // console.log("res===", res);
    const users = (await fetch(
        "https://jsonplaceholder.typicode.com/users"
    ).then((response) => response.json())) as User[];

    // Create a map of userId to User object for efficient lookup
    const userMap: { [key: number]: User } = {};
    users.forEach((user) => {
        userMap[user.id] = user;
    });

    // Combine todos with corresponding user data
    const todos: Todo[] = res.map((item) => ({
        ...item,
        user: userMap[item.userId],
    }));

    return todos;
}
