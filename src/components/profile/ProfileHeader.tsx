import { Component } from "solid-js";
import type { User } from "@/types/index.js";

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader: Component<ProfileHeaderProps> = (props) => {
  const getAvatarUrl = () => {
    return (
      props.user.avatarUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        props.user.firstName
      )}&background=1a1a1a&color=ffffff&size=128`
    );
  };

  const getDisplayName = () => {
    if (props.user.username) {
      return `@${props.user.username}`;
    }
    return props.user.firstName;
  };

  return (
    <div class="profile-header">
      <img
        src={getAvatarUrl()}
        alt={props.user.firstName}
        class="profile-avatar"
      />
      <h2 class="profile-username">{getDisplayName()}</h2>
    </div>
  );
};
