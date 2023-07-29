"use client";

import { useState, useEffect } from "react";
import {useAccount, useConnect, useDisconnect} from "wagmi";
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import axios from "axios";
import { Layout, Button } from "antd";

export default function Home() {
  const { Header, Content } = Layout;

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect({
    connector: new MetaMaskConnector()
  });

  const { disconnect } = useDisconnect();

  // disconnect wallet
  function disconnectWallet() {
    disconnect();
  }

  // fetch the name and balance of the connected wallet by using backend api
  async function getNameAndBalance() {

  }

  return (
    <main className="App">
      <Layout>
        <Header className="header">
          <div className="headerLeft">

          </div>
          {
          isConnected ? (
            <Button type="primary" onClick={() => disconnectWallet()}>Disconnect</Button>
            ) : (<Button type="primary" onClick={() => connect()}>Connect Wallet</Button>)
          }
        </Header>
        <Content className="content">

        </Content>
      </Layout>
    </main>
  );
}
