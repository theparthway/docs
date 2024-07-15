---
id: order-matching-engine
---

# Order Matching Engine

:::note
Coming Soon!
:::
**Our decentralised Order matching engine (OME) is the core mechanism through which Garden facilitates the efficient matching and execution of trades.** This section of our documentation delves into the intricate workings of the Garden OME, highlighting how orders are emitted, matched, and ultimately filled. It details the process from creating an order to the final trade execution, explaining the roles of Fillers and stakers and how they interact to secure the best prices and minimal risks.

Here is a rundown of what happens once a user creates an order:

1. The Garden OME emits the order details to all the eligible Fillers. This stage is marked by 'order matching' in the UI.
2. Fillers respond with the best price they can offer.
3. The OME identifies the best price among all Filler responses and communicates it back to all Fillers.
4. If only one Filler accepts, they fill the order, signified by an 'order matched' message in the UI.
5. If multiple Fillers accept the order,

   a. For staker-users, their orders are assigned to the Fillers they staked towards. An additional discount of 0.1 bips (basis points) per vote (up to the Filler's maximum fee) is applied, subtracted from the fees stakers receive.

   b. A ratio is calculated comparing the proportion of stakers to the proportion of the order filled. The Filler with the lowest ratio is assigned the order.

   c. Only the assigned Filler(s) expend costs for filling and the cost of failure for the participating Fillers is zero. This creates a positive-sum effect for Fillers as in any other arbitrage scenarios like sandwiching, all the participants expend funds and end up with failure costs.

6. After matching, the user initiates the asset deposit into the HTLC contract and the Filler bot observes for a fixed amount of confirmations.
7. Subsequently, the Filler gets a fixed time window to deposit their asset. Users receive an inconvenience fee if the Filler doesn't execute in time.
8. User and Filler can then redeem each other's assets, completing the trade.

## Types of order

### Market Order

Market orders are filled immediately at the price offered by active Fillers, provided the user accepts the offered price.

### Limit Orders

Users set a price limit and a time expiry. If an active Filler is ready to fill the order at or better than the set price before the expiry, the order is executed.

### Dutch Auction Order

Users set a price range they are willing to accept for the assets they want to swap within a specified time period (currently 3 minutes) and initiate an auction. The auction starts at the highest price point within the range and decreases to the lowest point by the end of the 3-minute window. If a Filler agrees to fill the order at any price within this range during the time period, the order is executed. You can read more about Dutch Auctions [here](https://www.financestrategists.com/wealth-management/stocks/ipo/dutch-auction/).
