"use client";

import { useState, useEffect } from "react";
import {useAccount, useConnect, useDisconnect} from "wagmi";
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import axios from "axios";
import { Layout, Button } from "antd";

import CurrentBalance from "@/components/CurrentBalance";
import RecentActivity from "@/components/RecentActivity";
import AccountDetails from "@/components/AccountDetails";
import RequestAndPay from "@/components/RequestAndPay";

// api used to fetch user details from paypal contract
const NAME_BALANCE_API = "http://localhost:3001/api/NameandBalance/";
const HISTORY_API = "http://localhost:3001/api/history/";
const REQUESTS_API = "http://localhost:3001/api/requests/";

export default function Home() {
  const { Header, Content } = Layout;

  // wallet connection
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector()
  });
  const { disconnect } = useDisconnect();

  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [dollars, setDollars] = useState("");
  const [history, setHistory] = useState(null);
  const [requests, setRequests] = useState(null);

  // disconnect wallet
  function disconnectWallet() {
    disconnect();
    setName("");
    setBalance("");
    setDollars("");
    setHistory(null);
    setRequests(null);
  }

  // fetch the name,balance, history of the connected wallet by using backend api
  async function getDetails() {
    // fetching wallet requests
    try {
      let res = await axios.get(`${NAME_BALANCE_API}${address}`);
      let data = res.data;
  
      // checking if name exist for this person
      if (data.name[1]) {
        setName(data.name[0]);
      }
      setBalance(data.balance);
      setDollars(data.usdPrice);
  
      // fetching wallet history
      res = await axios.get(`${HISTORY_API}${address}`);
      data = res.data;
      setHistory(data);

      res = await axios.get(`${REQUESTS_API}${address}`);
      data = res.data;
      setRequests(data);
    } catch (err) {
      console.error(err.message)
    }

  }

  useEffect(() => {
    if (!isConnected) return;
    getDetails();
  }, [isConnected])

  return (
    <main className="App">
      <Layout>
        <Header className="header">
          <div className="headerLeft">
            {isConnected && (
              <>
                <div
                  className="menuOption"
                  style={{ borderBottom: "1.5px solid black" }}
                >
                  Summary
                </div>
                <div className="menuOption">Activity</div>
                <div className="menuOption">{`Send & Request`}</div>
                <div className="menuOption">Wallet</div>
              </>
            )}
          </div>
          {
          isConnected ? (
            <Button type="primary" onClick={() => disconnectWallet()}>Disconnect</Button>
            ) : (<Button type="primary" onClick={() => connect()}>Connect Wallet</Button>)
          }
        </Header>
        <Content className="content">
          {
            isConnected ? (
              <>
                <div className="firstColumn">
                  <CurrentBalance dollars={dollars} />
                  <RequestAndPay requests={requests} getDetails={getDetails} />
                  <AccountDetails
                    address={address}
                    name={name}
                    balance={balance}
                    getDetails={getDetails}
                  />
                </div>
                <div className="secondColumn">
                  <RecentActivity history={history} />
                </div>
              </>
            ) : (
              <div className="connectText">
                Please Connect your Wallet
              </div>
            )
          }
        </Content>
      </Layout>
    </main>
  );
}
