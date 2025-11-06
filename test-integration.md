# Integration Testing Checklist for Stars Grabber

## Test Environment Setup

### Prerequisites

- [ ] API Backend running on port 3000
- [ ] Bot Backend running on port 3001
- [ ] Frontend built and served
- [ ] Supabase database configured
- [ ] Bot token configured
- [ ] Test Telegram account available

## 1. User Registration and Authentication Flow

### Test Case 1.1: New User Registration

**Steps:**

1. Open Mini App in Telegram
2. App should automatically authenticate using initData
3. Check that user is created in database
4. Verify JWT token is stored in localStorage
5. Check user balance is 0

**Expected Results:**

- User record created in `users` table
- JWT token returned and stored
- User redirected to Home page
- Balance shows 0 stars

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 1.2: Existing User Login

**Steps:**

1. Clear localStorage
2. Open Mini App again with same Telegram account
3. Verify user data is loaded from database
4. Check that balance persists

**Expected Results:**

- Same user ID retrieved
- Previous balance maintained
- User info updated if changed in Telegram

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 1.3: Referral Registration

**Steps:**

1. Generate referral link from existing user
2. Open Mini App with referral link in new account
3. Verify referrer_id is set in database
4. Check referral appears in referrer's list

**Expected Results:**

- New user has referrer_id set
- Referrer can see new referral in their list
- Referral count incremented

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

## 2. Task Management Flow

### Test Case 2.1: View Available Tasks

**Steps:**

1. Navigate to Home page
2. Verify tasks are loaded and displayed
3. Check task cards show: title, reward, action button
4. Verify completed tasks are not shown

**Expected Results:**

- All active tasks displayed
- Task details visible
- Completed tasks filtered out

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 2.2: Channel Subscription Task - Success

**Steps:**

1. Click on channel subscription task
2. Modal opens with task details
3. Click "Subscribe" button
4. Telegram channel opens
5. Subscribe to channel
6. Return to app and click "Verify"
7. Wait for verification

**Expected Results:**

- Bot verifies subscription successfully
- Stars added to balance
- Lottie animation plays
- Task marked as completed
- Transaction recorded in history

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 2.3: Channel Subscription Task - Failure

**Steps:**

1. Click on channel subscription task
2. Click "Subscribe" but don't actually subscribe
3. Return and click "Verify"

**Expected Results:**

- Verification fails
- Button shows red border
- Error message "Попробуйте снова" displayed
- No stars added
- Task remains incomplete

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 2.4: Bot Activation Task - Success

**Steps:**

1. Click on bot activation task
2. Modal opens with bot details
3. Click "Activate" button
4. Bot opens with tracking link
5. Send /start command to bot
6. Return to app and click "Verify"

**Expected Results:**

- Bot records activation in database
- Verification succeeds
- Stars added to balance
- Lottie animation plays
- Task marked as completed

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

## 3. Referral System Flow

### Test Case 3.1: Referral Link Generation

**Steps:**

1. Navigate to Referrals page
2. Check referral link is displayed
3. Copy link to clipboard
4. Verify link format includes user ID

**Expected Results:**

- Unique referral link generated
- Copy functionality works
- Link contains correct user identifier

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 3.2: Referral Earnings

**Steps:**

1. Have referral complete a task (e.g., 100 stars)
2. Check referrer's balance
3. Verify 5% commission (5 stars) added
4. Check transaction history

**Expected Results:**

- Referrer receives 5% of task reward
- Transaction type "referral" recorded
- Referral stats updated
- Both users see correct balances

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 3.3: Referral Stats Display

**Steps:**

1. Navigate to Referrals page
2. Check total referrals count
3. Check total earnings amount
4. Verify referral list shows all referrals

**Expected Results:**

- Correct referral count displayed
- Accurate total earnings shown
- All referrals listed with details

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

## 4. Withdrawal System Flow

### Test Case 4.1: Withdrawal - Insufficient Balance

**Steps:**

1. Navigate to Profile page
2. Click withdrawal button
3. Enter amount greater than balance
4. Submit

**Expected Results:**

- Error message displayed
- Withdrawal not created
- Balance unchanged

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 4.2: Withdrawal - Below Minimum

**Steps:**

1. Click withdrawal button
2. Enter amount less than 100 stars
3. Submit

**Expected Results:**

- Validation error shown
- Minimum amount requirement displayed
- Withdrawal not created

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 4.3: Withdrawal - No Username

**Steps:**

1. Use account without Telegram username
2. Attempt withdrawal with valid amount
3. Submit

**Expected Results:**

- Error message about missing username
- Instructions to set username in Telegram
- Withdrawal not created

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 4.4: Withdrawal - Inactive Subscription

**Steps:**

1. Complete channel subscription task
2. Unsubscribe from channel
3. Attempt withdrawal
4. Submit

**Expected Results:**

- System re-verifies subscriptions
- Detects inactive subscription
- Deducts stars for inactive task
- Withdrawal rejected with reason
- Balance updated

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 4.5: Withdrawal - Success

**Steps:**

1. Ensure balance >= 100 stars
2. Ensure username is set
3. Ensure all subscriptions active
4. Submit withdrawal request
5. Check status in history

**Expected Results:**

- Withdrawal created with "pending" status
- Admin notified via bot
- Withdrawal appears in history with loading emoji
- Balance not yet deducted

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

## 5. Profile and History Flow

### Test Case 5.1: Profile Display

**Steps:**

1. Navigate to Profile page
2. Check user info displayed
3. Verify balance is correct
4. Check tabs work (Balance/History)

**Expected Results:**

- Avatar, username, name displayed
- Current balance shown
- Tabs switch correctly

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 5.2: Transaction History

**Steps:**

1. Navigate to History tab
2. Verify all transactions displayed
3. Check color coding (green for earnings, red for withdrawals)
4. Verify status icons for withdrawals

**Expected Results:**

- All transactions listed chronologically
- Task completions show "+X" in green
- Referral earnings show "+X" in green
- Withdrawals show "-X" in red
- Status emojis correct (⏳ pending, ✅ approved, ❌ rejected)

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

## 6. Admin Panel Flow

### Test Case 6.1: Admin Access Control

**Steps:**

1. Login with admin account (ID: 1327903698)
2. Verify admin button appears in header
3. Login with non-admin account
4. Verify admin button does not appear

**Expected Results:**

- Admin button visible only for admin
- Non-admin cannot access admin endpoints
- 403 error returned for unauthorized access

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 6.2: Task Creation

**Steps:**

1. Open admin panel
2. Navigate to Task Manager
3. Click create task
4. Fill in task details (type, title, reward, target)
5. Submit

**Expected Results:**

- Task created in database
- Task appears in task list
- All users notified via bot
- Task visible on Home page

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 6.3: Task Editing

**Steps:**

1. Select existing task
2. Click edit
3. Modify task details
4. Save changes

**Expected Results:**

- Task updated in database
- Changes reflected immediately
- Updated task visible to users

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 6.4: Task Closing

**Steps:**

1. Select active task
2. Click close/deactivate
3. Confirm action

**Expected Results:**

- Task status set to "inactive"
- Task no longer visible to users
- Existing completions preserved

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 6.5: Withdrawal Approval

**Steps:**

1. Navigate to Withdrawal Manager
2. View pending withdrawals
3. Select withdrawal to approve
4. Click approve
5. Confirm action

**Expected Results:**

- Withdrawal status updated to "approved"
- Stars deducted from user balance
- User notified via bot
- Withdrawal shows ✅ in user history

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 6.6: Withdrawal Rejection

**Steps:**

1. Select pending withdrawal
2. Click reject
3. Enter rejection reason
4. Confirm

**Expected Results:**

- Withdrawal status updated to "rejected"
- Stars remain in user balance
- User notified with reason via bot
- Withdrawal shows ❌ in user history

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 6.7: Statistics Display

**Steps:**

1. Navigate to Stats Panel
2. Verify all metrics displayed
3. Check accuracy of numbers

**Expected Results:**

- Total users count correct
- Total tasks completed accurate
- Total stars distributed matches sum
- Pending withdrawals amount correct

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 6.8: Referral Tree Visualization

**Steps:**

1. Navigate to Referral Tree
2. View tree structure
3. Verify hierarchy is correct
4. Check earnings displayed

**Expected Results:**

- Tree shows referral relationships
- Hierarchy accurate
- Earnings per user shown
- Expandable/collapsible nodes work

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

## 7. Banner System Flow

### Test Case 7.1: Banner Display

**Steps:**

1. Navigate to Home page
2. Check banner carousel visible
3. Swipe through banners
4. Click on banner

**Expected Results:**

- Banners load and display
- Horizontal scroll works
- Banner click opens link in Telegram browser
- Smooth transitions

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 7.2: Banner Creation (Admin)

**Steps:**

1. Open admin panel
2. Navigate to banner management
3. Create new banner with image URL and link
4. Set order index
5. Save

**Expected Results:**

- Banner created in database
- Banner appears in carousel
- Order respected
- Link works correctly

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

## 8. Notification System Flow

### Test Case 8.1: New Task Notification

**Steps:**

1. Admin creates new task
2. Check all users receive bot notification

**Expected Results:**

- All users notified via bot message
- Message contains task details
- Link to Mini App included

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 8.2: Referral Completion Notification

**Steps:**

1. Referral completes task
2. Check referrer receives notification

**Expected Results:**

- Referrer notified of referral's completion
- Earnings amount shown in message

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 8.3: Withdrawal Status Notifications

**Steps:**

1. Submit withdrawal request
2. Admin approves/rejects
3. Check user receives notification

**Expected Results:**

- User notified of approval with success message
- User notified of rejection with reason
- Notifications sent via bot

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 8.4: Admin Withdrawal Request Notification

**Steps:**

1. User submits withdrawal request
2. Check admin receives notification

**Expected Results:**

- Admin notified immediately
- Message contains user info and amount
- Link to admin panel included

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

## 9. UI/UX and Navigation Flow

### Test Case 9.1: Bottom Navigation

**Steps:**

1. Test all three navigation buttons
2. Verify active state highlighting
3. Check page transitions

**Expected Results:**

- All nav buttons work
- Active button highlighted
- Smooth page transitions
- Icons display correctly

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 9.2: Animations

**Steps:**

1. Complete task and trigger Lottie animation
2. Check modal transitions
3. Verify button hover states

**Expected Results:**

- Lottie animation plays smoothly
- Modals slide up with fade
- Button states responsive
- No animation glitches

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 9.3: Responsive Design

**Steps:**

1. Test on different screen sizes
2. Check on iOS and Android
3. Verify in Telegram Desktop

**Expected Results:**

- Layout adapts to screen size
- All elements visible and accessible
- No horizontal scroll
- Touch targets adequate

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

## 10. Error Handling and Edge Cases

### Test Case 10.1: Network Errors

**Steps:**

1. Disable network
2. Attempt API calls
3. Re-enable network

**Expected Results:**

- Error messages displayed
- Retry mechanism works
- App recovers gracefully
- No data loss

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 10.2: Invalid Token

**Steps:**

1. Manually corrupt JWT token in localStorage
2. Attempt authenticated action

**Expected Results:**

- 401 error caught
- User logged out
- Redirected to login
- Token cleared

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 10.3: Bot Permissions

**Steps:**

1. Remove bot from channel
2. Attempt to verify subscription task

**Expected Results:**

- Verification fails gracefully
- Error message displayed
- Admin notified of permission issue
- User can retry later

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 10.4: Concurrent Requests

**Steps:**

1. Rapidly click verify button multiple times
2. Check for duplicate transactions

**Expected Results:**

- Only one verification processed
- No duplicate rewards
- Request debouncing works
- Database constraints prevent duplicates

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

## 11. Security Testing

### Test Case 11.1: InitData Validation

**Steps:**

1. Attempt login with invalid initData
2. Attempt login with expired initData
3. Attempt login with tampered signature

**Expected Results:**

- All invalid attempts rejected
- 401 errors returned
- No user created
- Security logged

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 11.2: Admin Endpoint Protection

**Steps:**

1. Attempt admin API calls with non-admin token
2. Attempt without token
3. Verify response codes

**Expected Results:**

- 403 Forbidden for non-admin
- 401 Unauthorized without token
- No data leaked
- Actions not performed

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 11.3: SQL Injection Prevention

**Steps:**

1. Attempt SQL injection in task title
2. Try in username field
3. Test in other inputs

**Expected Results:**

- All inputs sanitized
- No SQL executed
- Prepared statements used
- Data stored safely

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

## 12. Performance Testing

### Test Case 12.1: Load Time

**Steps:**

1. Measure initial app load time
2. Check API response times
3. Monitor database query performance

**Expected Results:**

- App loads < 3 seconds
- API responses < 500ms
- Database queries optimized
- No N+1 queries

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

### Test Case 12.2: Large Data Sets

**Steps:**

1. Create 100+ tasks
2. Add 1000+ transactions
3. Test pagination and loading

**Expected Results:**

- App remains responsive
- Pagination works correctly
- No memory leaks
- Smooth scrolling

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

**Notes:**

```

```

---

## Summary

### Test Results Overview

- Total Test Cases: 50
- Passed: \_\_\_
- Failed: \_\_\_
- Not Tested: \_\_\_

### Critical Issues Found

```
1.
2.
3.
```

### Non-Critical Issues Found

```
1.
2.
3.
```

### Recommendations

```
1.
2.
3.
```

### Next Steps

```
1.
2.
3.
```
