Core business logic (pure functions, entities)

In this layer, we define the most fundamental and stable pieces of our application — the business rules. These include:

Entities: the objects with identity (like User)
Value Objects: small, self-contained types with validation logic (like Email)
Types and schemas: defined using Zod for strong typing and validation
Let’s see how they are structured and implemented.

// libs/users/domain/user.ts
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

export const NewUserSchema = UserSchema.omit({ id: true });

export type User = z.infer<typeof UserSchema>;
export type NewUser = z.infer<typeof NewUserSchema>;
This file defines the User and NewUser schemas using Zod. Instead of manually writing TypeScript types, we use z.infer to automatically infer them from the schema.

UserSchema includes id, name, and email.
NewUserSchema omits the id field for creation scenarios. UserSchema includes all fields while NewUserSchema omits the id (for creation use cases).
// libs/users/domain/valueObjects/email.ts
import { z } from 'zod';

export const EmailSchema = z.string().email('Invalid email');

export function validateEmail(email: string): string {
  return EmailSchema.parse(email);
}
This file handles validation of the email as a Value Object using Zod. It ensures emails passed to domain logic are valid, parsed, and normalized if needed.