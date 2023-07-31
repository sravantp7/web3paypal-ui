import { Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import matic from "./matic.png";

export default function AccountDetails({ address, name, balance }) {
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
        <div className="extraOption">Set Username</div>
        <div className="extraOption">Switch Accounts</div>
      </div>
    </Card>
  );
}