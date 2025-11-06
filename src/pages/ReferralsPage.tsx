import { Component } from "solid-js";
import { ReferralLink } from "@/components/referrals/ReferralLink.js";
import { ReferralStats } from "@/components/referrals/ReferralStats.js";

export const ReferralsPage: Component = () => {
  return (
    <div class="page referrals-page">
      <ReferralLink />
      <ReferralStats />
    </div>
  );
};
