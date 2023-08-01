import { useState, useEffect } from "react";
import { Card, Modal, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import matic from "./matic.png";

import { useContractWrite, useWaitForTransaction, usePrepareContractWrite } from "wagmi";
import { polygonMumbai } from "@wagmi/chains";
import ABI from "./abi.json";

const ADDRESS = "0x437a10e0B3ac1bf8c9B582Ba7FD4a1A815Dfc56C";

export default function AccountDetails({ address, name, balance, getDetails }) {
  const [nameModal, setNameModal] = useState(false);
  const [username, setUserName] = useState("");

  function handleNameModal() {
    setNameModal(true);
  }

  function cancelNameModal() {
    setNameModal(false);
  }

  // for setUsername
  const { config } = usePrepareContractWrite({
    chainId: polygonMumbai.id,
    address: ADDRESS,
    abi: ABI,
    functionName: "addName",
    args: [username]
  });

  const { write, data } = useContractWrite(config);

  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash
  });

  useEffect(() => {
    if (isSuccess) {
      getDetails();
    }
  }, [isSuccess]);

  return (
    <Card title="Account Details" style={{ width: "100%" }}>
      <div className="accountDetailRow">
        {/* User Icon */}
        <UserOutlined style={{ color: "#767676", fontSize: "25px" }} /> 
        <div>
          {/* if name then it will display the name, else display Unknown */}
          <div className="accountDetailHead"> {name ? name : "Unknown"} </div>
          <div className="accountDetailBody">
            {" "}
            Address: {address.slice(0, 4)}...{address.slice(38)}
          </div>
        </div>
      </div>
      <div className="accountDetailRow">
        <Image src={matic} alt="maticLogo" width={25} />
        <div>
          <div className="accountDetailHead">Matic Tokens</div>
          <div className="accountDetailBody">{balance} Matic</div>
        </div>
      </div>
      <div className="balanceOptions">
        <div className="extraOption" onClick={handleNameModal}>Set Username</div>
        <div className="extraOption">Switch Accounts</div>
      </div>
      <Modal title="Set Username" open={nameModal} onOk={() => {write?.(); cancelNameModal();}} onCancel={cancelNameModal} okText="Confirm" cancelText="Cancel" >
        <Input placeholder="Username.." value={username} onChange={(val)=>setUserName(val.target.value)}/>
      </Modal>
    </Card>
  );
}