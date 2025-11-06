# Group Expense Management System (Splitwise-like Features)

## Overview
Transform the current personal expense tracker into a comprehensive group expense management system supporting individual and shared expenses, similar to Splitwise. This will be implemented in multiple phases for incremental delivery.

---

## Complete Feature List

### Phase 1: Core Group & Expense Features (MVP)
- Create and manage groups
- Add members to groups via email
- Add group expenses with participant selection
- Equal split functionality
- View group balances (who owes whom)
- Basic settlement recording
- Group activity feed
- Leave group functionality

### Phase 2: Advanced Splitting & Settlement
- Exact amount splits (specify exact amount per person)
- Percentage-based splits
- Unequal splits with custom shares
- Split by shares/multipliers
- Optimized debt simplification algorithm
- Partial settlement support
- Settlement history tracking
- Multiple currency support per group

### Phase 3: Enhanced User Experience
- Add members by mobile number
- Email invitations for non-users
- Guest user support (placeholder accounts)
- Comments on expenses
- Expense attachments (receipts)
- Recurring group expenses
- Expense categories per group
- Search and filter expenses

### Phase 4: Notifications & Collaboration
- Real-time notifications (in-app)
- Email notifications for key events
- Push notifications (web push)
- Activity feed with real-time updates
- Member mentions in comments
- Notification preferences per user/group

### Phase 5: Advanced Features
- Export group data (CSV, PDF)
- Group analytics and insights
- Spending trends per member
- Category-wise group spending
- Monthly/weekly summaries
- Integration with payment apps
- WhatsApp/SMS reminders

---

## Database Schema Design

### New Models to Create

#### 1. Group Model (`server/models/Group.js`)
```javascript
{
  name: String (required),
  description: String,
  type: String (enum: ['trip', 'home', 'couple', 'other']),
  category: String (default group category),
  currency: String (default: 'INR'),
  createdBy: ObjectId (ref: User),
  members: [{
    user: ObjectId (ref: User),
    role: String (enum: ['admin', 'member']),
    joinedAt: Date,
    isActive: Boolean
  }],
  isActive: Boolean,
  settings: {
    simplifyDebts: Boolean (default: true),
    allowNonMemberView: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. GroupExpense Model (`server/models/GroupExpense.js`)
```javascript
{
  group: ObjectId (ref: Group, required),
  description: String (required),
  totalAmount: Number (required),
  currency: String,
  category: String,
  date: Date (default: Date.now),
  paidBy: ObjectId (ref: User, required),
  splitType: String (enum: ['equal', 'exact', 'percentage', 'shares']),
  splits: [{
    user: ObjectId (ref: User),
    owedAmount: Number,
    percentage: Number,
    shares: Number,
    isPaid: Boolean
  }],
  attachments: [{
    url: String,
    type: String,
    uploadedAt: Date
  }],
  notes: String,
  isSettlement: Boolean (default: false),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Settlement Model (`server/models/Settlement.js`)
```javascript
{
  group: ObjectId (ref: Group, required),
  paidBy: ObjectId (ref: User, required),
  paidTo: ObjectId (ref: User, required),
  amount: Number (required),
  currency: String,
  date: Date (default: Date.now),
  notes: String,
  relatedExpense: ObjectId (ref: GroupExpense),
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. GroupInvitation Model (`server/models/GroupInvitation.js`)
```javascript
{
  group: ObjectId (ref: Group, required),
  invitedBy: ObjectId (ref: User, required),
  invitedEmail: String (required, lowercase),
  invitedMobile: String,
  role: String (enum: ['admin', 'member'], default: 'member'),
  status: String (enum: ['pending', 'accepted', 'rejected', 'expired']),
  token: String (unique, for email link),
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. Comment Model (`server/models/Comment.js`)
```javascript
{
  expense: ObjectId (ref: GroupExpense, required),
  user: ObjectId (ref: User, required),
  text: String (required),
  mentions: [ObjectId (ref: User)],
  createdAt: Date,
  updatedAt: Date
}
```

#### 6. Notification Model (`server/models/Notification.js`)
```javascript
{
  user: ObjectId (ref: User, required),
  type: String (enum: ['expense_added', 'expense_updated', 'expense_deleted',
                        'payment_received', 'settlement_added', 'group_invite',
                        'member_added', 'member_removed', 'comment_added', 'mention']),
  title: String,
  message: String,
  relatedGroup: ObjectId (ref: Group),
  relatedExpense: ObjectId (ref: GroupExpense),
  relatedUser: ObjectId (ref: User),
  isRead: Boolean (default: false),
  link: String,
  createdAt: Date
}
```

### Model Updates

#### Update Expense Model (`server/models/Expense.js`)
- Keep existing schema for personal expenses
- Add optional field: `isPersonal: Boolean (default: true)`
- This maintains backward compatibility

#### Update User Model (`server/models/User.js`)
- Add `phoneNumber: String (unique, sparse)`
- Add `notificationPreferences: Object`
- Add `defaultCurrency: String`

---

## Backend Implementation

### Phase 1: Core APIs

#### 1. Group Management Routes (`server/routes/groups.js`)

**Endpoints:**
- `POST /api/groups` - Create new group
- `GET /api/groups` - Get all user's groups
- `GET /api/groups/:id` - Get group details with members
- `PUT /api/groups/:id` - Update group details
- `DELETE /api/groups/:id` - Delete group (admin only)
- `POST /api/groups/:id/leave` - Leave group
- `GET /api/groups/:id/balances` - Get all balances in group

**Implementation Steps:**
1. Create `server/routes/groups.js`
2. Implement group CRUD operations
3. Add member management (add/remove)
4. Implement authorization middleware (group membership check)
5. Add balance calculation logic
6. Create group service layer (`server/services/groupService.js`)

#### 2. Group Member Routes (`server/routes/groups.js` - extend)

**Endpoints:**
- `POST /api/groups/:id/members` - Add member by email
- `DELETE /api/groups/:id/members/:userId` - Remove member
- `PUT /api/groups/:id/members/:userId/role` - Update member role
- `POST /api/groups/:id/invite` - Send email invitation
- `GET /api/groups/invitations` - Get user's pending invitations
- `POST /api/invitations/:token/accept` - Accept invitation
- `POST /api/invitations/:token/reject` - Reject invitation

**Implementation Steps:**
1. Create member validation (check if user exists by email)
2. Implement invitation system with expiry tokens
3. Create email service for sending invites
4. Add invitation acceptance flow
5. Handle non-existing users (guest placeholders)

#### 3. Group Expense Routes (`server/routes/groupExpenses.js`)

**Endpoints:**
- `POST /api/groups/:id/expenses` - Add group expense
- `GET /api/groups/:id/expenses` - Get all group expenses
- `GET /api/groups/:id/expenses/:expenseId` - Get expense details
- `PUT /api/groups/:id/expenses/:expenseId` - Update expense
- `DELETE /api/groups/:id/expenses/:expenseId` - Delete expense
- `GET /api/expenses/group` - Get all user's group expenses (across groups)

**Implementation Steps:**
1. Create group expense CRUD operations
2. Implement split calculation algorithms:
   - Equal split: `totalAmount / numberOfParticipants`
   - Exact split: Use provided amounts
   - Percentage split: Calculate based on percentages
   - Shares split: Calculate proportional to shares
3. Validate split amounts (must equal total)
4. Create expense service (`server/services/groupExpenseService.js`)
5. Add transaction support (atomic operations)

#### 4. Settlement Routes (`server/routes/settlements.js`)

**Endpoints:**
- `POST /api/groups/:id/settlements` - Record settlement
- `GET /api/groups/:id/settlements` - Get settlement history
- `DELETE /api/groups/:id/settlements/:settlementId` - Delete settlement
- `POST /api/groups/:id/settlements/simplify` - Get simplified debts

**Implementation Steps:**
1. Create settlement recording logic
2. Implement debt calculation algorithm
3. Build debt simplification algorithm (graph-based)
4. Add settlement validation
5. Update balances after settlement
6. Create settlement service (`server/services/settlementService.js`)

#### 5. Balance Calculation Service (`server/services/balanceService.js`)

**Core Functions:**
- `calculateGroupBalances(groupId)` - Calculate who owes whom
- `calculateUserBalance(groupId, userId)` - Get user's net balance
- `simplifyDebts(balances)` - Optimize debt graph
- `getUserOwesBreakdown(groupId, userId)` - Detailed breakdown

**Algorithm:**
```
For each expense in group:
  1. Create debt from each participant to payer
  2. Subtract their owed amount from debt
  3. Net all debts between same user pairs
  4. Apply debt simplification if enabled

Debt Simplification:
  1. Calculate net balance per user
  2. Separate creditors (positive) and debtors (negative)
  3. Sort both lists
  4. Match largest creditor with largest debtor
  5. Create settlement for min(creditor, debtor)
  6. Update balances and repeat
```

#### 6. Activity Feed Routes (`server/routes/activities.js`)

**Endpoints:**
- `GET /api/groups/:id/activities` - Get group activity feed
- `GET /api/activities` - Get user's activity feed (all groups)

**Implementation Steps:**
1. Create activity logging middleware
2. Log expense additions, updates, deletions
3. Log settlements, member changes
4. Add pagination support
5. Include user details in activities

### Phase 2: Advanced Features

#### 7. Comment System (`server/routes/comments.js`)

**Endpoints:**
- `POST /api/expenses/:id/comments` - Add comment
- `GET /api/expenses/:id/comments` - Get all comments
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

**Implementation Steps:**
1. Create comment CRUD operations
2. Add mention parsing (@username)
3. Link comments to expenses
4. Add notification triggers

#### 8. Notification System (`server/routes/notifications.js`)

**Endpoints:**
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

**Implementation Steps:**
1. Create notification service
2. Add event triggers:
   - New expense added
   - Expense updated/deleted
   - Settlement recorded
   - Member added/removed
   - Comment added
   - Mention in comment
3. Implement email notifications
4. Add notification preferences
5. Create notification aggregation logic

#### 9. File Upload Service (`server/services/uploadService.js`)

**Implementation Steps:**
1. Set up file storage (Cloudinary/AWS S3/Firebase Storage)
2. Create upload middleware
3. Add image compression
4. Validate file types and sizes
5. Link attachments to expenses

### Middleware Updates

#### 10. Authorization Middleware (`server/middleware/groupAuth.js`)

**Create new middleware:**
- `isGroupMember` - Check if user is group member
- `isGroupAdmin` - Check if user is group admin
- `canModifyExpense` - Check expense modification rights
- `canViewGroup` - Check group view permissions

### Testing

#### 11. Backend Tests
- Unit tests for balance calculation algorithms
- Unit tests for debt simplification
- Integration tests for group APIs
- Integration tests for expense APIs
- Test edge cases (negative amounts, zero splits)

---

## Frontend Implementation

### Phase 1: Core UI Components

#### 1. Group Components (`client/src/components/groups/`)

**Components to Create:**
- `GroupCard.jsx` - Display group summary
- `GroupList.jsx` - List all user's groups
- `CreateGroupModal.jsx` - Modal to create new group
- `GroupHeader.jsx` - Group details header
- `GroupMembers.jsx` - Display and manage members
- `AddMemberModal.jsx` - Modal to add members
- `InviteMemberModal.jsx` - Modal to send invitations
- `GroupSettings.jsx` - Group settings panel
- `BalanceSummary.jsx` - Show balances summary
- `BalancesList.jsx` - Detailed balances list

**Implementation Steps:**
1. Create component structure with proper props
2. Add responsive design (mobile-first)
3. Implement loading and error states
4. Add animations and transitions
5. Follow project's design system (Tailwind classes)

#### 2. Group Expense Components (`client/src/components/groupExpenses/`)

**Components to Create:**
- `GroupExpenseCard.jsx` - Display single expense
- `GroupExpenseList.jsx` - List group expenses
- `AddGroupExpenseModal.jsx` - Modal to add expense
- `ExpenseDetailsModal.jsx` - Show expense details
- `SplitTypeSelector.jsx` - Choose split type
- `EqualSplitForm.jsx` - Equal split form
- `ExactSplitForm.jsx` - Exact amount form
- `PercentageSplitForm.jsx` - Percentage split form
- `SharesSplitForm.jsx` - Shares-based form
- `ParticipantSelector.jsx` - Select participants
- `ExpenseAttachments.jsx` - Display/upload attachments

**Implementation Steps:**
1. Create reusable form components
2. Implement split calculation in real-time
3. Add validation for split amounts
4. Show visual feedback (who owes what)
5. Add file upload UI
6. Implement expense editing

#### 3. Settlement Components (`client/src/components/settlements/`)

**Components to Create:**
- `SettleUpModal.jsx` - Record settlement
- `SettlementSuggestions.jsx` - Show optimal settlements
- `SettlementHistory.jsx` - Show past settlements
- `BalanceCard.jsx` - Individual balance display
- `SimplifiedDebts.jsx` - Show simplified debt graph

**Implementation Steps:**
1. Create settlement recording UI
2. Show suggested settlements
3. Display settlement confirmation
4. Add settlement history view
5. Visualize debt relationships

#### 4. Activity & Comments Components (`client/src/components/activity/`)

**Components to Create:**
- `ActivityFeed.jsx` - Display activity stream
- `ActivityItem.jsx` - Single activity card
- `CommentSection.jsx` - Comments under expense
- `CommentForm.jsx` - Add comment form
- `CommentItem.jsx` - Single comment display
- `MentionInput.jsx` - Input with @mention support

**Implementation Steps:**
1. Create activity feed with infinite scroll
2. Format activities with icons and colors
3. Add comment threading
4. Implement mention autocomplete
5. Add real-time updates (optional)

### Phase 2: Pages

#### 5. Group Pages (`client/src/pages/groups/`)

**Pages to Create:**
- `Groups.jsx` - List all groups
- `GroupDetail.jsx` - Single group view with tabs
- `GroupExpenses.jsx` - Group expenses tab
- `GroupBalances.jsx` - Balances tab
- `GroupActivity.jsx` - Activity tab
- `GroupSettings.jsx` - Settings tab
- `AcceptInvitation.jsx` - Accept invitation page

**Implementation Steps:**
1. Create page layouts with navigation
2. Implement tab switching
3. Add breadcrumbs
4. Handle loading states
5. Add empty states with CTAs

### Phase 3: State Management

#### 6. Redux Slices (`client/src/store/slices/`)

**Slices to Create:**
- `groupSlice.js` - Group state management
- `groupExpenseSlice.js` - Group expenses state
- `settlementSlice.js` - Settlements state
- `balanceSlice.js` - Balances state
- `notificationSlice.js` - Notifications state
- `invitationSlice.js` - Invitations state

**Actions for Each Slice:**

**groupSlice.js:**
```javascript
- fetchGroups (async)
- fetchGroupById (async)
- createGroup (async)
- updateGroup (async)
- deleteGroup (async)
- addMember (async)
- removeMember (async)
- leaveGroup (async)
- setActiveGroup
```

**groupExpenseSlice.js:**
```javascript
- fetchGroupExpenses (async)
- fetchExpenseById (async)
- createGroupExpense (async)
- updateGroupExpense (async)
- deleteGroupExpense (async)
- setFilters
```

**settlementSlice.js:**
```javascript
- fetchSettlements (async)
- createSettlement (async)
- deleteSettlement (async)
- fetchSimplifiedDebts (async)
```

**balanceSlice.js:**
```javascript
- fetchGroupBalances (async)
- fetchUserBalance (async)
```

**Implementation Steps:**
1. Create slice structure with initial state
2. Implement async thunks with API calls
3. Add loading/error handling
4. Implement optimistic updates
5. Add cache invalidation logic

### Phase 4: Routing & Navigation

#### 7. Route Updates (`client/src/App.jsx`)

**New Routes:**
```javascript
- /groups - Groups list
- /groups/create - Create group
- /groups/:id - Group detail
- /groups/:id/expenses - Group expenses
- /groups/:id/balances - Group balances
- /groups/:id/activity - Group activity
- /groups/:id/settings - Group settings
- /invitations/:token - Accept invitation
- /notifications - Notifications page
```

**Implementation Steps:**
1. Add new routes in App.jsx
2. Create protected route wrappers
3. Add group-specific route guards
4. Implement navigation menu updates
5. Add mobile navigation

#### 8. Navigation Updates (`client/src/components/Layout.jsx`)

**Implementation Steps:**
1. Add "Groups" navigation item
2. Add notification bell icon
3. Show notification count badge
4. Add user groups dropdown
5. Create mobile menu with groups

### Phase 5: Utilities & Helpers

#### 9. Utility Functions (`client/src/utils/`)

**Files to Create:**
- `balanceCalculator.js` - Client-side balance utils
- `splitCalculator.js` - Split calculation helpers
- `currencyFormatter.js` - Format currency with symbol
- `dateFormatter.js` - Format dates for display
- `mentionParser.js` - Parse @mentions
- `validationSchemas.js` - Form validation schemas

**Implementation Steps:**
1. Create pure utility functions
2. Add unit tests
3. Export commonly used functions
4. Add JSDoc comments

### Phase 6: Internationalization (i18n)

#### 10. Translation Updates (`client/src/i18n/locales/`)

**Keys to Add in `en.json` and `es.json`:**
```json
groups: {
  title, create, edit, delete, leave,
  members, addMember, removeMember,
  balances, expenses, activity,
  settings, invitations, ...
},
groupExpenses: {
  add, edit, delete, paidBy,
  splitType, equal, exact, percentage, shares,
  participants, selectParticipants, ...
},
settlements: {
  record, history, settleUp,
  simplified, youOwe, owesYou, ...
},
notifications: {
  expenseAdded, settlementRecorded,
  memberAdded, commentAdded, ...
}
```

**Implementation Steps:**
1. Add all translation keys
2. Translate to supported languages
3. Use translation keys in components
4. Test language switching

---

## Database Indexes & Performance

### Required Indexes

```javascript
// Group indexes
Group.index({ 'members.user': 1 })
Group.index({ createdBy: 1 })
Group.index({ isActive: 1 })

// GroupExpense indexes
GroupExpense.index({ group: 1, date: -1 })
GroupExpense.index({ 'splits.user': 1 })
GroupExpense.index({ paidBy: 1 })
GroupExpense.index({ createdAt: -1 })

// Settlement indexes
Settlement.index({ group: 1, date: -1 })
Settlement.index({ paidBy: 1, paidTo: 1 })

// Notification indexes
Notification.index({ user: 1, isRead: 1, createdAt: -1 })

// Invitation indexes
GroupInvitation.index({ invitedEmail: 1, status: 1 })
GroupInvitation.index({ token: 1 }, { unique: true })
GroupInvitation.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

---

## Security Considerations

### Authentication & Authorization

1. **Group Access Control:**
   - Only members can view group details
   - Only admins can add/remove members
   - Only admins can delete group
   - Only expense creator or admin can edit/delete expense

2. **Invitation Security:**
   - Generate secure random tokens
   - Set expiration time (7 days)
   - Validate token before accepting
   - One-time use tokens

3. **Data Validation:**
   - Validate split amounts match total
   - Validate participants are group members
   - Sanitize user inputs
   - Prevent XSS in comments

4. **Rate Limiting:**
   - Limit invitation emails per user
   - Limit expense creation rate
   - Limit API requests per user

---

## Email Templates

### Email Service Setup (`server/services/emailService.js`)

**Templates Needed:**
1. Group invitation email
2. New expense notification
3. Settlement recorded notification
4. Payment reminder
5. Weekly summary

**Implementation:**
- Use nodemailer or SendGrid
- Create HTML email templates
- Add email queue (Bull/BeeQueue)
- Handle email failures gracefully

---

## Testing Strategy

### Backend Tests
1. Unit tests for each service
2. Integration tests for APIs
3. Test balance calculation accuracy
4. Test debt simplification algorithm
5. Test edge cases

### Frontend Tests
1. Component unit tests (Jest + React Testing Library)
2. Integration tests for flows
3. E2E tests for critical paths (Cypress/Playwright)
4. Test responsive design
5. Test accessibility

---

## Deployment Considerations

### Environment Variables
```
# Add to .env
FRONTEND_URL=http://localhost:5173
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_key
FILE_UPLOAD_SERVICE=cloudinary
CLOUDINARY_URL=your_url
MAX_FILE_SIZE=5mb
```

### Database Migration
1. Create migration scripts for new models
2. Backup existing data
3. Run migrations
4. Verify data integrity

### API Versioning
- Consider versioning: `/api/v1/groups`
- Maintain backward compatibility
- Document API changes

---

## Implementation Order (Recommended)

### Sprint 1 (Week 1-2): Database & Core Backend
1. Create all database models
2. Add indexes
3. Create group CRUD APIs
4. Create member management APIs
5. Write unit tests

### Sprint 2 (Week 3-4): Group Expenses Backend
1. Create group expense APIs
2. Implement split calculation logic
3. Create balance calculation service
4. Write integration tests

### Sprint 3 (Week 5-6): Frontend Core
1. Create group components
2. Create group pages
3. Implement Redux slices
4. Add routing

### Sprint 4 (Week 7-8): Group Expenses Frontend
1. Create expense components
2. Create expense forms with split types
3. Connect to Redux
4. Add form validation

### Sprint 5 (Week 9-10): Settlements
1. Create settlement APIs
2. Implement debt simplification
3. Create settlement UI components
4. Add settlement flow

### Sprint 6 (Week 11-12): Enhanced Features
1. Add invitation system
2. Create activity feed
3. Add comment system
4. Implement notifications

### Sprint 7 (Week 13-14): Polish & Testing
1. Comprehensive testing
2. Bug fixes
3. Performance optimization
4. Documentation
5. Deployment

---

## Success Metrics

### Key Metrics to Track
- Number of groups created
- Number of expenses per group
- Settlement completion rate
- User engagement (DAU/MAU)
- Invitation acceptance rate
- Average response time
- Error rates

---

## Future Enhancements (Post-MVP)

1. Mobile app (React Native)
2. Offline support (PWA)
3. Budget planning per group
4. Recurring expenses
5. Payment gateway integration
6. QR code for quick expense adding
7. Voice input for expenses
8. AI-powered category detection
9. Multi-language receipts OCR
10. Group chat integration

---

## Additional Splitwise Features to Consider

### 1. Expense Categories with Icons
- Customizable categories per group
- Visual icons for each category
- Color-coding expenses

### 2. Bill Splitting Features
- Split by item (restaurant bills)
- Itemized bill splitting
- Tax and tip calculation
- Photo of receipt with item detection

### 3. Payment Integration
- UPI integration (for India)
- PayPal, Venmo integration
- Direct payment links
- Payment reminders

### 4. Group Types & Templates
- Trip/vacation groups
- Household/roommate groups
- Couple expenses
- Event expenses
- Custom templates

### 5. Reporting & Analytics
- Monthly spending reports
- Per-person spending analysis
- Category-wise breakdown
- Export to Excel/CSV
- PDF statement generation

### 6. Social Features
- Friend list management
- Add friends to multiple groups
- Profile customization
- Activity notifications
- Like/react to expenses

### 7. Advanced Settings
- Currency conversion rates
- Custom split rules per group
- Auto-settlement schedules
- Spending limits/alerts
- Privacy settings

### 8. Mobile-Specific Features
- Scan receipts with camera
- Location-based expense tracking
- Quick add from notification
- Widget for quick expense entry
- Dark mode support

### 9. Fairness Features
- Calculate who has paid more
- Historical payment patterns
- Fair split recommendations
- Balance over time graphs

### 10. Collaboration Features
- Vote on expense approval
- Expense disputes/challenges
- Group chat integration
- Shared shopping lists
- Bill reminders

---

## Technical Implementation Details

### Balance Calculation Algorithm (Detailed)

```javascript
// Pseudo-code for balance calculation

function calculateGroupBalances(groupId) {
  // Step 1: Get all expenses and settlements
  const expenses = await GroupExpense.find({ group: groupId, isSettlement: false });
  const settlements = await Settlement.find({ group: groupId });

  // Step 2: Initialize balance map
  const balances = new Map(); // userId -> balance (positive = owed, negative = owes)

  // Step 3: Process each expense
  for (const expense of expenses) {
    const payer = expense.paidBy;

    // Payer gets credited the full amount
    balances.set(payer, (balances.get(payer) || 0) + expense.totalAmount);

    // Each participant gets debited their share
    for (const split of expense.splits) {
      balances.set(split.user, (balances.get(split.user) || 0) - split.owedAmount);
    }
  }

  // Step 4: Process settlements
  for (const settlement of settlements) {
    balances.set(settlement.paidBy, (balances.get(settlement.paidBy) || 0) - settlement.amount);
    balances.set(settlement.paidTo, (balances.get(settlement.paidTo) || 0) + settlement.amount);
  }

  // Step 5: Create debt pairs
  const debts = [];
  const userIds = Array.from(balances.keys());

  for (let i = 0; i < userIds.length; i++) {
    for (let j = i + 1; j < userIds.length; j++) {
      const user1 = userIds[i];
      const user2 = userIds[j];
      const balance1 = balances.get(user1) || 0;
      const balance2 = balances.get(user2) || 0;

      // If one owes the other
      if (balance1 > 0 && balance2 < 0) {
        debts.push({
          from: user2,
          to: user1,
          amount: Math.min(balance1, Math.abs(balance2))
        });
      } else if (balance2 > 0 && balance1 < 0) {
        debts.push({
          from: user1,
          to: user2,
          amount: Math.min(balance2, Math.abs(balance1))
        });
      }
    }
  }

  return debts;
}

function simplifyDebts(balances) {
  // Convert balances map to array
  const users = Array.from(balances.entries()).map(([userId, balance]) => ({
    userId,
    balance
  }));

  // Separate creditors and debtors
  const creditors = users.filter(u => u.balance > 0).sort((a, b) => b.balance - a.balance);
  const debtors = users.filter(u => u.balance < 0).sort((a, b) => a.balance - b.balance);

  const settlements = [];
  let i = 0, j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    const amount = Math.min(creditor.balance, Math.abs(debtor.balance));

    settlements.push({
      from: debtor.userId,
      to: creditor.userId,
      amount
    });

    creditor.balance -= amount;
    debtor.balance += amount;

    if (creditor.balance === 0) i++;
    if (debtor.balance === 0) j++;
  }

  return settlements;
}
```

### Split Calculation Formulas

#### 1. Equal Split
```javascript
const amountPerPerson = totalAmount / participants.length;
```

#### 2. Exact Split
```javascript
// User provides exact amounts
// Validation: sum of all amounts must equal totalAmount
const totalSplit = splits.reduce((sum, split) => sum + split.amount, 0);
if (Math.abs(totalSplit - totalAmount) > 0.01) {
  throw new Error('Split amounts do not match total');
}
```

#### 3. Percentage Split
```javascript
// User provides percentages
// Validation: sum must equal 100%
const totalPercentage = splits.reduce((sum, split) => sum + split.percentage, 0);
if (Math.abs(totalPercentage - 100) > 0.01) {
  throw new Error('Percentages must sum to 100');
}

splits.forEach(split => {
  split.amount = (totalAmount * split.percentage) / 100;
});
```

#### 4. Shares Split
```javascript
// User provides shares (e.g., 2 shares for one person, 1 for others)
const totalShares = splits.reduce((sum, split) => sum + split.shares, 0);

splits.forEach(split => {
  split.amount = (totalAmount * split.shares) / totalShares;
});
```

---

## API Response Examples

### Get Group Balances Response
```json
{
  "groupId": "60d5ec49f1b2c8a9e8b4567a",
  "groupName": "Trip to Goa",
  "balances": [
    {
      "from": {
        "_id": "60d5ec49f1b2c8a9e8b4567b",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "to": {
        "_id": "60d5ec49f1b2c8a9e8b4567c",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "amount": 1500.00,
      "currency": "INR"
    }
  ],
  "simplifiedBalances": [
    {
      "from": {
        "_id": "60d5ec49f1b2c8a9e8b4567b",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "to": {
        "_id": "60d5ec49f1b2c8a9e8b4567c",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "amount": 1500.00,
      "currency": "INR"
    }
  ]
}
```

### Group Expense Response
```json
{
  "_id": "60d5ec49f1b2c8a9e8b4567d",
  "group": {
    "_id": "60d5ec49f1b2c8a9e8b4567a",
    "name": "Trip to Goa"
  },
  "description": "Hotel booking",
  "totalAmount": 6000.00,
  "currency": "INR",
  "category": "accommodation",
  "date": "2024-01-15T10:30:00.000Z",
  "paidBy": {
    "_id": "60d5ec49f1b2c8a9e8b4567c",
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "splitType": "equal",
  "splits": [
    {
      "user": {
        "_id": "60d5ec49f1b2c8a9e8b4567b",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "owedAmount": 2000.00,
      "isPaid": false
    },
    {
      "user": {
        "_id": "60d5ec49f1b2c8a9e8b4567c",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "owedAmount": 2000.00,
      "isPaid": true
    },
    {
      "user": {
        "_id": "60d5ec49f1b2c8a9e8b4567e",
        "name": "Bob Johnson",
        "email": "bob@example.com"
      },
      "owedAmount": 2000.00,
      "isPaid": false
    }
  ],
  "createdBy": {
    "_id": "60d5ec49f1b2c8a9e8b4567c",
    "name": "Jane Smith"
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## UI/UX Considerations

### Mobile-First Design
- Touch-friendly buttons (min 44x44px)
- Swipe gestures for actions
- Bottom navigation for key features
- Pull-to-refresh on lists
- Floating action button for quick add

### Loading States
- Skeleton screens for lists
- Progressive loading of images
- Optimistic UI updates
- Error boundaries with retry

### Empty States
- Helpful illustrations
- Clear call-to-action
- Guide users on next steps
- Show example data

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast mode
- Focus indicators

### Performance
- Lazy load images
- Virtual scrolling for long lists
- Debounce search inputs
- Cache API responses
- Code splitting by route

---

## Conclusion

This comprehensive plan provides a complete roadmap for implementing a Splitwise-like group expense management system. The phased approach ensures incremental delivery of value while maintaining code quality and user experience. Each phase builds upon the previous one, allowing for iterative improvements and user feedback incorporation.

**Estimated Total Development Time:** 14-20 weeks (depending on team size and complexity choices)

**Key Success Factors:**
1. Start with MVP (Phase 1) and iterate
2. Focus on accurate balance calculations
3. Ensure robust testing of financial logic
4. Maintain clear, intuitive UX
5. Handle edge cases gracefully
6. Keep performance optimized
7. Document all APIs and algorithms

Good luck with the implementation! 🚀

