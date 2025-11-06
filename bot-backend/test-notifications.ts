/**
 * Simple test script for notification system
 * Run with: npx tsx test-notifications.ts
 */

import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const BOT_BACKEND_URL = "http://localhost:3001";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "test-key";

async function testNotifications() {
  console.log("Testing Notification System...\n");

  // Test 1: New Task Notification
  console.log("1. Testing new task notification...");
  try {
    const response = await axios.post(
      `${BOT_BACKEND_URL}/notifications/new-task`,
      {
        taskTitle: "Test Channel Subscription",
        reward: 50,
        taskType: "channel",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": INTERNAL_API_KEY,
        },
      }
    );
    console.log("✓ New task notification:", response.data);
  } catch (error: any) {
    console.error("✗ New task notification failed:", error.message);
  }

  // Test 2: Referral Completion Notification
  console.log("\n2. Testing referral completion notification...");
  try {
    const response = await axios.post(
      `${BOT_BACKEND_URL}/notifications/referral-completion`,
      {
        userId: 123456789,
        referralName: "Test User",
        earnings: 5,
        taskTitle: "Test Task",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": INTERNAL_API_KEY,
        },
      }
    );
    console.log("✓ Referral completion notification:", response.data);
  } catch (error: any) {
    console.error("✗ Referral completion notification failed:", error.message);
  }

  // Test 3: Withdrawal Approved Notification
  console.log("\n3. Testing withdrawal approved notification...");
  try {
    const response = await axios.post(
      `${BOT_BACKEND_URL}/notifications/withdrawal-approved`,
      {
        userId: 123456789,
        amount: 100,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": INTERNAL_API_KEY,
        },
      }
    );
    console.log("✓ Withdrawal approved notification:", response.data);
  } catch (error: any) {
    console.error("✗ Withdrawal approved notification failed:", error.message);
  }

  // Test 4: Withdrawal Rejected Notification
  console.log("\n4. Testing withdrawal rejected notification...");
  try {
    const response = await axios.post(
      `${BOT_BACKEND_URL}/notifications/withdrawal-rejected`,
      {
        userId: 123456789,
        amount: 100,
        reason: "Insufficient balance",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": INTERNAL_API_KEY,
        },
      }
    );
    console.log("✓ Withdrawal rejected notification:", response.data);
  } catch (error: any) {
    console.error("✗ Withdrawal rejected notification failed:", error.message);
  }

  // Test 5: Admin Withdrawal Request Notification
  console.log("\n5. Testing admin withdrawal request notification...");
  try {
    const response = await axios.post(
      `${BOT_BACKEND_URL}/notifications/admin-withdrawal-request`,
      {
        username: "testuser",
        amount: 100,
        userId: 123456789,
        withdrawalId: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": INTERNAL_API_KEY,
        },
      }
    );
    console.log("✓ Admin withdrawal request notification:", response.data);
  } catch (error: any) {
    console.error(
      "✗ Admin withdrawal request notification failed:",
      error.message
    );
  }

  console.log("\n✓ All notification tests completed!");
}

// Run tests
testNotifications().catch(console.error);
