"use client";

import { trpc } from "@/trpc/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSave,
  FiEdit,
  FiX,
  FiSettings,
  FiShoppingBag,
} from "react-icons/fi";
import { OrderHistoryPage } from "../order-history";

interface UserFormData {
  name: string;
  whatsAppNumber: string | null;
  delivery_address: string | null;
}

const CurrentUserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const tabs = [
    { id: "profile" as const, label: "Profile", icon: FiSettings },
    { id: "orders" as const, label: "Order History", icon: FiShoppingBag },
  ];
  const { data, refetch } = trpc.getCurrentUserProfile.getCurrentUser.useQuery(
    undefined,
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const updateUser = trpc.getCurrentUserProfile.updateCurrentUser.useMutation({
    onSuccess: () => {
      refetch();
      setIsEditing(false);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>();

  // Reset form when user data loads or editing mode changes
  React.useEffect(() => {
    if (data?.user) {
      reset({
        name: data.user.name,
        whatsAppNumber: data.user.whatsAppNumber || "",
        delivery_address: data.user.delivery_address || "",
      });
    }
  }, [data, reset, isEditing]);

  const onSubmit = (formData: UserFormData) => {
    updateUser.mutate({
      name: formData.name,
      whatsAppNumber: formData.whatsAppNumber || null,
      delivery_address: formData.delivery_address || null,
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form when canceling edit
      reset({
        name: data?.user.name || "",
        whatsAppNumber: data?.user.whatsAppNumber || "",
        delivery_address: data?.user.delivery_address || "",
      });
    }
  };

  if (!data?.user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { user } = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 mt-28"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information and preferences
          </p>
        </motion.div>

        <div className="max-w-6xl flex space-x-1 p-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 m-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex-1 justify-center ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "profile" ? (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden m-auto"
            >
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      {user.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.imageUrl}
                          alt={user.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white">
                      {user.name}
                    </h2>
                    <p className="text-blue-100">{user.emailId}</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-white/20 text-white text-xs rounded-full">
                      {user.userType}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEditToggle}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isEditing
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-white/20 hover:bg-white/30 text-white"
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <FiX className="w-4 h-4" />
                        <span>Cancel</span>
                      </>
                    ) : (
                      <>
                        <FiEdit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Name Field */}
                <motion.div variants={itemVariants}>
                  <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiUser className="w-4 h-4 text-blue-500" />
                    <span>Full Name</span>
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                  )}
                </motion.div>

                {/* Email Field (Read-only) */}
                <motion.div variants={itemVariants}>
                  <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiMail className="w-4 h-4 text-green-500" />
                    <span>Email Address</span>
                  </label>
                  <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {user.emailId}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Email cannot be changed
                  </p>
                </motion.div>

                {/* WhatsApp Number Field */}
                <motion.div variants={itemVariants}>
                  <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiPhone className="w-4 h-4 text-green-500" />
                    <span>WhatsApp Number</span>
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="tel"
                        {...register("whatsAppNumber")}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        placeholder="+94 77 123 4567"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Optional - Include country code
                      </p>
                    </div>
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                      {user.whatsAppNumber || "Not provided"}
                    </p>
                  )}
                </motion.div>

                {/* Delivery Address Field */}
                <motion.div variants={itemVariants}>
                  <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FiMapPin className="w-4 h-4 text-red-500" />
                    <span>Delivery Address</span>
                  </label>
                  {isEditing ? (
                    <div>
                      <textarea
                        {...register("delivery_address")}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none"
                        placeholder="Enter your delivery address"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Optional - Your preferred delivery location
                      </p>
                    </div>
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                      {user.delivery_address || "Not provided"}
                    </p>
                  )}
                </motion.div>

                {/* Account Created Date */}
                <motion.div variants={itemVariants}>
                  <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span>Member Since</span>
                  </label>
                  <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </motion.div>

                {/* Save Button */}
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="pt-4 border-t border-gray-200 dark:border-gray-600"
                  >
                    <motion.button
                      type="submit"
                      disabled={updateUser.isPending}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      <FiSave className="w-4 h-4" />
                      <span>
                        {updateUser.isPending ? "Saving..." : "Save Changes"}
                      </span>
                    </motion.button>
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Success Message */}
            {updateUser.isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <p className="text-green-800 dark:text-green-200 text-center">
                  Profile updated successfully!
                </p>
              </motion.div>
            )}

            {/* Error Message */}
            {updateUser.isError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-red-800 dark:text-red-200 text-center">
                  Failed to update profile. Please try again.
                </p>
              </motion.div>
            )}
          </>
        ) : (
          <OrderHistoryPage />
        )}
      </div>
    </div>
  );
};

export default CurrentUserProfile;
