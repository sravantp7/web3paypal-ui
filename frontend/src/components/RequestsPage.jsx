import { Card, Table, Button } from "antd";
import { useState, useEffect } from "react";
import { useContractWrite, useWaitForTransaction, usePrepareContractWrite } from "wagmi";
import { polygonMumbai } from "@wagmi/chains";
import ABI from "./abi.json";

const ADDRESS = "0x437a10e0B3ac1bf8c9B582Ba7FD4a1A815Dfc56C";

export default function RequestsPage({requests, getDetails}) {
    const [request, setRequest] = useState(null);

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
        },
        {
          title: "Name",
          dataIndex: "requestorName",
          key: "requestorName",
          render: (_, request) => (
            <div>
              {request.requestorName ? request.requestorName : "Unknown"}
            </div>
          ),
        },
        {
            title: "Requestor",
            dataIndex: "requestor",
            key: "requestor",
            render: (_, request) => (
              <div>
                {request.requestor.slice(0, 4)}...{request.requestor.slice(38)}
              </div>
            ),
        },
        {
          title: "Message",
          dataIndex: "message",
          key: "message",
        },
        {
          title: "Amount",
          key: "amount",
          render: (_, request) => (
            <div>
              {request.amount / 1e18} Matic
            </div>
          ),
        },
        {
            title: "Pay",
            render: (_, request) => (
              <div>
                <Button type="primary" onClick={() => { setRequest(request); write?.()} }>Pay</Button>
              </div>
            ),
          },
    ];

    console.log(request?.id);

    const { config } = usePrepareContractWrite({
        chainId: polygonMumbai.id,
        address: ADDRESS,
        abi: ABI,
        functionName: "payRequest",
        args: [request?.id],
        value: request?.amount
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
        <Card title="Pending Requests" style={{ width: "100%", minHeight: "663px" }}>
            {
            requests && 
            <Table
                dataSource={requests}
                columns={columns}
                pagination={{ position: ["bottomCenter"], pageSize: 8 }}
            />
            }
        </Card>
    );
}