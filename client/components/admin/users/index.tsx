"use client";

import { DEFAULT_LIMIT } from "@/constants/constants";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import React, { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";

const userSchema = z.object({
  clerkId: z.string(),
  name: z.string().min(1, "Name is required"),
  emailId: z.string().email("Invalid email"),
  userType: z.enum(["admin", "user"]),
});

type UserFormData = z.infer<typeof userSchema>;

const AdminUsers = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <UsersAdminPageSectionsSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">
      Failed to load users
    </div>
  </div>
);

const UsersAdminPageSectionsSuspense: React.FC = () => {
  const { user: currentUser } = useUser();
  const utils = trpc.useUtils();
  const [editingUser, setEditingUser] = useState<UserFormData | null>(null);

  const [data] = trpc.getUsers.getAllUsers.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const updateMutation = trpc.getUsers.updateUser.useMutation({
    onSuccess: () => {
      utils.getUsers.getAllUsers.invalidate();
      toast.success("User updated successfully");
      setEditingUser(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: UserFormData) => {
    updateMutation.mutate({
      clerkId: data.clerkId,
      name: data.name,
      emailId: data.emailId,
      userType: data.userType,
    });
  };

  const users = data?.pages.flatMap((page) => page.users) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        User Management
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr
                  key={user.clerkId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image
                        className="rounded-full"
                        src={user.imageUrl || ""}
                        alt={`${user.name}'s avatar`}
                        width={40}
                        height={40}
                        unoptimized // Clerk's images are already optimized
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {editingUser?.clerkId === user.clerkId ? (
                      <UserEditForm
                        user={editingUser}
                        onSave={onSubmit}
                        onCancel={() => setEditingUser(null)}
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {editingUser?.clerkId === user.clerkId
                      ? null
                      : user.emailId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {editingUser?.clerkId === user.clerkId ? null : (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          user.userType === "admin"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {user.userType}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingUser?.clerkId === user.clerkId ? null : (
                      <button
                        onClick={() => setEditingUser(user)}
                        disabled={user.clerkId === currentUser?.id}
                        className={`${
                          user.clerkId === currentUser?.id
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        } mr-3`}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const UserEditForm: React.FC<{
  user: UserFormData;
  onSave: (data: UserFormData) => void;
  onCancel: () => void;
}> = ({ user, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user,
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-3">
      <div>
        <input
          {...register("name")}
          className={`w-full px-3 py-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <input
          {...register("emailId")}
          className={`w-full px-3 py-2 border rounded-md ${errors.emailId ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
        />
        {errors.emailId && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.emailId.message}
          </p>
        )}
      </div>

      <div>
        <select
          {...register("userType")}
          className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdminUsers;
