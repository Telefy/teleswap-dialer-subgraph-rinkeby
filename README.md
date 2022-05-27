# TeleSwap Subgraph

Aims to deliver analytics & historical data for TeleSwap. Still a work in progress. Feel free to contribute!

The Graph exposes a GraphQL endpoint to query the events and entities within the TeleSwap ecosytem.

Current subgraph locations:

1. **Exchange**: Includes all TeleSwap Exchange data with Price Data, Volume, Users, etc:
   + https://thegraph.com/explorer/subgraph/Teleswap/exchange (mainnet)
   + https://thegraph.com/explorer/subgraph/Teleswap/bsc-exchange (bsc)
   + https://q.hg.network/okex-exchange/oec (okex)
   + https://thegraph.com/explorer/subgraph/Teleswap/xdai-exchange (xdai)
   + https://q.hg.network/heco-exchange/heco (heco)
   + https://thegraph.com/explorer/subgraph/Teleswap/matic-exchange (matic)
   + https://thegraph.com/explorer/subgraph/Teleswap/fantom-exchange (fantom)
   + https://thegraph.com/explorer/subgraph/Teleswap/arbitrum-exchange (arbitrum)
   + https://thegraph.com/explorer/subgraph/Teleswap/celo-exchange (celo)
   + https://thegraph.com/explorer/subgraph/Teleswap/avalanche-exchange (avalanche)
   + https://Tele.graph.t.hmny.io/subgraphs/name/Teleswap/harmony-exchange (harmony)
   + https://thegraph.com/hosted-service/subgraph/Teleswap/moonriver-exchange (moonriver)

2. **DialerContract**: Indexes all DialerContract staking data: https://thegraph.com/explorer/subgraph/Teleswap/DialerContract

3. **Tele Maker**: Indexes the TeleMaker contract, that handles the serving of exchange fees to the TeleBar: https://thegraph.com/explorer/subgraph/Teleswap/Tele-maker

4. **Tele Timelock**: Includes all of the timelock transactions queued, executed, and cancelled: https://thegraph.com/explorer/subgraph/Teleswap/Tele-timelock

5. **Tele Bar**: Indexes the TeleBar, includes data related to the bar: https://thegraph.com/explorer/subgraph/Teleswap/Tele-bar

6. **TeleSwap-SubGraph-Fork** (on uniswap-fork branch): Indexes the TeleSwap Factory, includes Price Data, Pricing, etc: https://thegraph.com/explorer/subgraph/jiro-ono/Teleswap-v1-exchange

7. **BentoBox**: Indexes BentoBox and Kashi Lending data: https://thegraph.com/explorer/subgraph/Teleswap/bentobox

8. **MiniChef**: Indexes MiniChef contracts that are used in place of DialerContracts for alternate networks:
  + https://thegraph.com/explorer/subgraph/Teleswap/matic-minichef

## To setup and deploy

For any of the subgraphs follow below steps

1. CD in to the subgraph directory `subgraphs:[subgraphName]`
2. Run the `yarn run prepare:[network]` to prepare yaml file from template.yaml and network specific data.
3. Run the `yarn run codegen` command to prepare the TypeScript sources for the GraphQL (generated/schema) and the ABIs (generated/[ABI]/\*)
4. [Optional] run the `yarn run build` command to build the subgraph. Can be used to check compile errors before deploying.
5. Run `graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>`
6. Deploy via `yarn run deploy`.

> It is also possible to follow steps 2-4 from root directory. Given you are running from root, it will try to prepare/codegen/build all subgraphs.
> So to ensure successful run for `prepare:[network]` command, `network` of your interest, all subgraphs should have this command.
## To query these subgraphs

Please use our node utility: [Tele-data](https://github.com/Teleswap/Tele-data).

Note: This is in on going development as well.

## Example Queries

We will add to this as development progresses.

### Maker

```graphql
{
  maker(id: "0x6684977bbed67e101bb80fc07fccfba655c0a64f") {
    id
    servings(orderBy: timestamp) {
      id
      server {
        id
      }
      tx
      pair
      token0
      token1
      TeleServed
      block
      timestamp
    }
  }
  servers {
    id
    TeleServed
    servings(orderBy: timestamp) {
      id
      server {
        id
      }
      tx
      pair
      token0
      token1
      Tele
      block
      timestamp
    }
  }
}
```

# Community Subgraphs

1) croco-finance fork of this repo with slight modifications - [deployment](https://thegraph.com/explorer/subgraph/benesjan/Tele-swap), [code](https://github.com/croco-finance/Teleswap-subgraph)
2) croco-finance dex-rewards-subgraph which tracks SLPs in DialerContract and all the corresponding rewards individually. (can be used for analysis of user's positions) - [deployment](https://thegraph.com/explorer/subgraph/benesjan/dex-rewards-subgraph), [code](https://github.com/croco-finance/dex-rewards-subgraph)
