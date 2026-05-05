export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

const STORAGE_KEY = "beacon_user";
const USERS_KEY = "beacon_users";

function getUsers(): Array<AuthUser & { password: string }> {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users: Array<AuthUser & { password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function register(
  name: string,
  email: string,
  password: string
): { user?: AuthUser; error?: string } {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return { error: "User already exists" };
  }

  const user: AuthUser & { password: string } = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
  };

  users.push(user);
  saveUsers(users);

  const authUser = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
  return { user: authUser };
}

export function login(
  email: string,
  password: string
): { user?: AuthUser; error?: string } {
  const users = getUsers();
  const found = users.find((u) => u.email === email && u.password === password);
  if (!found) {
    return { error: "Invalid email or password" };
  }

  const authUser = { id: found.id, name: found.name, email: found.email };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
  return { user: authUser };
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}
