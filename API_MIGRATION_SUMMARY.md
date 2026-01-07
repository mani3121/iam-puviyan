# Rewards API Migration Summary

## Changes Made

### 1. Updated Reward Interface
- Added new fields to match API response: `rewardId`, `carbonContribution`, `orgId`, `partnerId`, `createdBy`
- Changed `availableCoupons` type to `string | number`
- Changed `termsAndConditions` type to `string[] | string`
- Added optional discount fields: `maxDiscountAmount`, `discountAmount`, `discountPercent`, `minPurchaseAmount`

### 2. Replaced Database Calls with API Calls

#### fetchRewards()
- **Old**: Queried Firestore `rewards` collection
- **New**: Calls `https://puviyan-api-staging-omzkebgc5q-uc.a.run.app/api/v1/rewards`
- Uses Firebase Authentication to generate bearer token via `auth.currentUser.getIdToken()`

#### fetchRewardsPaginated()
- **Old**: Used Firestore pagination with `lastVisible` cursor
- **New**: Uses offset-based pagination with query parameters `?limit={pageSize}&offset={offset}`
- Returns `{ rewards, hasMore, total, offset }` instead of `{ rewards, hasMore, lastVisible }`

#### fetchRewardsStats()
- **Old**: Queried Firestore and calculated stats from documents
- **New**: Calls `fetchRewards()` API and calculates stats from returned data

### 3. Updated RewardsContent Component
- Changed `fetchPage()` to use offset-based pagination: `offset = (page - 1) * pageSize`
- Removed `lastVisible` cursor logic

## API Response Structure

The API returns:
```json
{
  "data": [
    {
      "rewardId": "...",
      "brandName": "...",
      "rewardTitle": "...",
      ...
    }
  ],
  "total": 9,
  "limit": 50,
  "offset": 0
}
```

## Authentication Flow

1. User must be authenticated via Firebase Auth (`auth.currentUser`)
2. Bearer token is generated: `await user.getIdToken()`
3. Token is sent in Authorization header: `Bearer {token}`

## Troubleshooting

### If data is not loading:

1. **Check browser console** for error messages:
   - "No authenticated user found" → User not logged in
   - "API request failed with status XXX" → Check API error response
   - "API Response:" log → Verify response structure

2. **Verify user is authenticated**:
   - Check if `auth.currentUser` exists
   - Ensure user logged in successfully

3. **Check API response format**:
   - Look for console log "API Response:" to see actual structure
   - Verify it matches expected format with `data` array

4. **Network issues**:
   - Check if API endpoint is accessible
   - Verify CORS settings allow requests from your domain
   - Check if bearer token is valid

## Testing Steps

1. Open browser DevTools → Console
2. Navigate to Dashboard → Rewards page
3. Look for these console logs:
   - "fetchRewardsPaginated called with: {pageSize: 10, offset: 0}"
   - "User authenticated, fetching rewards..."
   - "API Response: {data: [...], total: X, ...}"
   - "Returning result: {rewardsCount: X, hasMore: ..., total: X}"

4. If you see errors, check the error message for details
