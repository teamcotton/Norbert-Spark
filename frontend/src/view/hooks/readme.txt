🔌 5. UI Logic (Hooks)
This layer separates UI logic (like form handling and data fetching) from UI rendering. By using custom React hooks, we keep our components clean and declarative.

useUserForm() encapsulates logic related to user creation, including form handling and mutation lifecycle.
useUserList() fetches and manages the state of the user list using React Query.
These hooks can be reused or tested independently from the UI components.

// libs/users/view/hooks/useUserForm.ts
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { createUser } from '../../application/createUser';

export function useUserForm() {
  const form = useForm();
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => form.reset(),
  });

  return {
    ...form,
    onSubmit: form.handleSubmit(data => mutation.mutate(data))
  };
}
// lib/user/ui/hooks/useUserList.ts
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../../application/createUser';

export function useUserList() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });
}
