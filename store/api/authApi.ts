import { BASE_URL } from "@/utilities";
import { User } from "../slices/authSlice";

// REGISTER USER
export const registerUserApi = async (payload: {
  name: string;
  email: string;
  password: string;
}): Promise<User> => {
  // First check if email already exists
  const existing = await fetch(`${BASE_URL}/users?email=${payload.email}`);
  const exists = await existing.json();

  if (exists.length > 0) {
    throw new Error("Email already exists");
  }

  const newUser: User = {
    id: Date.now().toString(),
    name: payload.name,
    email: payload.email,
    password: payload.password, // In production: hash it!
    createdAt: new Date().toISOString(),
    registered: true,
    lastSyncAt: "",
  };

  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  });

  if (!res.ok) throw new Error("Failed to register user");

  return res.json();
};


// LOGIN USER
export const loginUserApi = async (payload: {
  email: string;
  password: string;
}): Promise<User> => {
  const res = await fetch(
    `${BASE_URL}/users?email=${payload.email}&password=${payload.password}`
  );

  const users = await res.json();

  if (users.length === 0) {
    throw new Error("Invalid email or password");
  }

  return users[0];
};


// GET USER BY ID
export const fetchUserByIdApi = async (id: string): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};