# Seller API + FE + UI Audit

Updated: 2026-05-27

This matrix tracks the intended seller boundary after the wiring pass:

- `apps/seller`: route ownership, loaders, mutations, auth/public-path handling
- `packages/ui-seller`: reusable seller page UI, props, callbacks
- `apps/api-seller`: seller backend surface
- `@ecom/contracts/generated`: typed seller API contracts

| Seller surface         | App route | ui-seller page | api-seller | generated contracts | Notes                                                                                      |
| ---------------------- | --------- | -------------- | ---------- | ------------------- | ------------------------------------------------------------------------------------------ |
| Dashboard              | Yes       | Yes            | Yes        | Yes                 | Uses shared integration bundle                                                             |
| Analytics              | Yes       | Yes            | Yes        | Yes                 | Uses shared integration bundle                                                             |
| Metrics                | Yes       | Yes            | Yes        | Yes                 | Uses shared integration bundle                                                             |
| Finance                | Yes       | Yes            | Yes        | Yes                 | Uses shared integration bundle                                                             |
| Shop profile           | Yes       | Yes            | Yes        | Yes                 | Uses shared integration bundle                                                             |
| Vouchers list/create   | Yes       | Yes            | Yes        | Yes                 | Uses shared integration bundle                                                             |
| Products list/create   | Yes       | Yes            | Yes        | Yes                 | List/create wired through shared integration                                               |
| Orders list/detail     | Yes       | Yes            | Yes        | Yes                 | List/detail/status actions wired through shared integration                                |
| Inventory              | Yes       | Yes            | Yes        | Yes                 | List wired through shared integration                                                      |
| Shipping               | Yes       | Yes            | Yes        | Yes                 | Providers/method toggle wired through shared integration                                   |
| Reviews                | Yes       | Yes            | Yes        | Yes                 | List/analytics/reply wired through shared integration                                      |
| Returns                | Yes       | Yes            | Yes        | Yes                 | List/status update wired through shared integration                                        |
| Notifications          | Yes       | Yes            | Yes        | Yes                 | List/read/read-all wired through shared integration                                        |
| Approvals              | Yes       | Yes            | Yes        | Yes                 | List/resubmit wired through shared integration                                             |
| Bulk jobs              | Yes       | Yes            | Yes        | Yes                 | Jobs/import/export wired through shared integration                                        |
| Warehouses list/create | Yes       | Yes            | Yes        | Yes                 | List/create wired through shared integration                                               |
| Messages/chat          | Yes       | Yes            | Yes        | Yes                 | Conversations/messages/read/send wired through shared integration                          |
| Login                  | Yes       | Yes            | Yes        | Yes                 | Route already mounted                                                                      |
| Forgot password        | Yes       | Yes            | Yes        | Yes                 | Route already mounted                                                                      |
| Reset password         | Yes       | Yes            | Yes        | Yes                 | Mounted in seller app in this pass                                                         |
| Promotions             | Yes       | Yes            | Partial    | Partial             | Routed from packaged UI; future API mapping should reuse seller promo surfaces             |
| Seller onboarding      | Yes       | Yes            | Partial    | Partial             | Routed from packaged UI; end-to-end onboarding workflow still needs dedicated API mapping  |
| Onboarding status      | Yes       | Yes            | Partial    | Partial             | Routed from packaged UI; status-specific API mapping can follow when workflow is finalized |

Navigation adjustments in this pass:

- `Chat` now points to `/messages`
- `Shop Settings` now points to `/shop-profile`
- the dead `/search` navigation item was removed
