import {useState, useEffect} from "react";
import { DollarOutlined, SwapOutlined } from "@ant-design/icons";
import { Modal, Input, InputNumber } from "antd";
import { useContractWrite, useWaitForTransaction, usePrepareContractWrite } from "wagmi";
import { polygonMumbai } from "@wagmi/chains";
import ABI from "./abi.json";

const ADDRESS = "0x437a10e0B3ac1bf8c9B582Ba7FD4a1A815Dfc56C";

export default function RequestAndPay({requests, getDetails, payWindow, setPayWindow}) {
    const [requestModal, setRequestModal] = useState(false);
    const [requestAmount, setRequestAmount] = useState(0);
    const [requestAddress, setRequestAddress] = useState("");
    const [requestMessage, setRequestMessage] = useState("");

    const showRequestModal = () => {
        setRequestModal(true);
    }

    const hideRequestModal = () => {
        setRequestModal(false);
    }

    // For createRequest
    const { config : configCreateRequest } = usePrepareContractWrite({
        chainId: polygonMumbai.id,
        address: ADDRESS,
        abi: ABI,
        functionName: "createRequest",
        args: [requestAddress, requestAmount * 1e18, requestMessage]
    });

    const { write: writeRequest, data: dataRequest } = useContractWrite(configCreateRequest);

    const { isSuccess: isSuccessRequest } = useWaitForTransaction({
        hash: dataRequest?.hash,
    });

    useEffect(()=>{
        if(isSuccessRequest){
            getDetails();
        }
      },[isSuccessRequest])

    return (
        <>
            <Modal
                title="Request A Payment"
                open={requestModal}
                onOk={() => {
                writeRequest?.();
                hideRequestModal();
                }}
                onCancel={hideRequestModal}
                okText="Proceed To Request"
                cancelText="Cancel" >
                    <p>Amount (Matic)</p>
                    <InputNumber value={requestAmount} min={0.01} defaultValue={1} size={"middle"} onChange={(val)=>setRequestAmount(val)}/>
                    <p>From (address)</p>
                    <Input placeholder="0x..." value={requestAddress} onChange={(val)=>setRequestAddress(val.target.value)}/>
                    <p>Message</p>
                    <Input placeholder="Lunch Bill..." value={requestMessage} onChange={(val)=>setRequestMessage(val.target.value)}/>
            </Modal>
            <div className="requestAndPay">
                <div className="quickOption" onClick={() => setPayWindow(!payWindow)}>
                    <DollarOutlined style={{ fontSize: "26px" }} />
                    Pay
                </div>
                <div className="quickOption" onClick={showRequestModal}>
                    <SwapOutlined style={{ fontSize: "26px" }} />
                    Request
                </div>
            </div>
        </>
 
    )
}