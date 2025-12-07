Application-level use cases and orchestrators

The application layer acts as the coordinator of your domain logic. It connects the domain with the infrastructure, without knowing the details of either one. This is where your use cases and services live.

Use Cases represent specific operations or flows in your application, like creating a user or fetching users.
Services hold business logic that doesn’t belong to a single entity or value object.
Let’s implement these pieces to handle our user creation logic.

// libs/users/application/userService.ts
import { validateEmail } from '../../user/domain/valueObjects/email';
import { NewUser } from '../../user/domain/user';

export function prepareUser(data: NewUser): NewUser {
  return {
    ...data,
    email: validateEmail(data.email),
  };
}
This service prepares and validates a new user before sending it to the repository. It separates business logic from controller logic and makes it reusable in different use cases.

// libs/users/application/createUser.ts
import { prepareUser } from './userService';
import { userApi } from '../../user/infrastructure/userApi';

export async function createUser(data: { name: string; email: string }) {
  const user = prepareUser(data);
  return userApi.create(user);
}

export async function getAllUsers() {
  return userApi.getAll();
}
These are our application-level use cases. createUser prepares and submits a user while getAllUsers fetches all existing users from the backend.

