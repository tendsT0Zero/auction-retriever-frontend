// ProfileTab component.
import React, { useRef } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

function ProfileTab({
  avatarUrl,
  onAvatarSelect,
  onSaveAvatar,
  avatarStatus,
  fullName,
  emailAddress,
  onFullNameChange,
  onEmailChange,
  onSaveAccount,
  accountStatus,
  currentPassword,
  newPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  showCurrentPassword,
  showNewPassword,
  onToggleCurrentPassword,
  onToggleNewPassword,
  onSavePassword,
  passwordStatus,
  onDeleteAccount,
  isLoading = {},
}) {
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file && onAvatarSelect) {
      onAvatarSelect(file);
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-2xl border border-amber-100 bg-white/70 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-900">
              Change your profile image
            </p>
            <p className="text-xs text-zinc-500">
              View and update your account details, profile, and more.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={isLoading.avatar}
              className="h-12 w-12 overflow-hidden rounded-full border border-amber-200 disabled:opacity-50"
            >
              <img
                src={avatarUrl || "/profile-photo-placeholder.png"}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading.avatar}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center gap-3">
        <button
          type="button"
          disabled={isLoading.avatar}
          className="rounded-md bg-amber-400 px-3 py-2 text-xs font-semibold text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onSaveAvatar}
        >
          {isLoading.avatar ? "Saving..." : "Save Change"}
        </button>
        {avatarStatus ? (
          <span className="text-xs text-amber-600">{avatarStatus}</span>
        ) : null}
      </div>

      <div className="rounded-2xl border border-amber-100 bg-white/70 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-sm font-semibold text-zinc-900">
              Account Setting
            </p>
            <p className="text-xs text-zinc-500">
              View and update your account details, profile, and more.
            </p>
          </div>
          <div className="space-y-3">
            <label className="block text-xs text-zinc-500">
              Full Name *
              <input
                type="text"
                value={fullName}
                onChange={onFullNameChange}
                disabled={isLoading.account}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 disabled:opacity-50"
              />
            </label>
            <label className="block text-xs text-zinc-500">
              Email Address *
              <input
                type="email"
                value={emailAddress}
                onChange={onEmailChange}
                disabled={isLoading.account}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 disabled:opacity-50"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        {accountStatus ? (
          <span className="text-xs text-amber-600">{accountStatus}</span>
        ) : null}
        <button
          type="button"
          disabled={isLoading.account}
          className="rounded-md bg-amber-400 px-3 py-2 text-xs font-semibold text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onSaveAccount}
        >
          {isLoading.account ? "Saving..." : "Save Change"}
        </button>
      </div>
      <div className="rounded-2xl border border-amber-100 bg-white/70 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-sm font-semibold text-zinc-900">
              Password Change
            </p>
            <p className="text-xs text-zinc-500">
              View and update your account details, profile, and more.
            </p>
          </div>
          <div className="space-y-3">
            <label className="block text-xs text-zinc-500">
              Current Password *
              <div className="relative mt-1">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={onCurrentPasswordChange}
                  disabled={isLoading.password}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 disabled:opacity-50"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 disabled:opacity-50"
                  onClick={onToggleCurrentPassword}
                  disabled={isLoading.password}
                >
                  {showCurrentPassword ? (
                    <FiEyeOff size={16} />
                  ) : (
                    <FiEye size={16} />
                  )}
                </button>
              </div>
            </label>
            <label className="block text-xs text-zinc-500">
              New Password *
              <div className="relative mt-1">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={onNewPasswordChange}
                  disabled={isLoading.password}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 disabled:opacity-50"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 disabled:opacity-50"
                  onClick={onToggleNewPassword}
                  disabled={isLoading.password}
                >
                  {showNewPassword ? (
                    <FiEyeOff size={16} />
                  ) : (
                    <FiEye size={16} />
                  )}
                </button>
              </div>
            </label>
            <p className="text-[10px] text-zinc-400">
              Must be at least 8 characters
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-3">
        {passwordStatus ? (
          <span className="text-xs text-amber-600">{passwordStatus}</span>
        ) : null}
        <button
          type="button"
          disabled={isLoading.password}
          className="rounded-md bg-amber-400 px-3 py-2 text-xs font-semibold text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onSavePassword}
        >
          {isLoading.password ? "Saving..." : "Save Change"}
        </button>
      </div>
      <div className="rounded-2xl border border-amber-100 bg-white/70 p-5">
        <p className="text-sm font-semibold text-red-600">
          Delete Your Account
        </p>
        <p className="text-xs text-zinc-500">Irreversible account actions</p>
        <button
          type="button"
          disabled={isLoading.delete}
          className="mt-3 rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onDeleteAccount}
        >
          {isLoading.delete ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
}

export default ProfileTab;
