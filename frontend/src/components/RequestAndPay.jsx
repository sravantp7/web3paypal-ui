import {useState, useEffect} from "react";
import { DollarOutlined, SwapOutlined } from "@ant-design/icons";
import { Modal, Input, InputNumber } from "antd";
import { useContractWrite, useWaitForTransaction, usePrepareContractWrite } from "wagmi";
import { polygonMumbai } from "@wagmi/chains";
import ABI from "./abi.json";

export default function RequestAndPay({requests, getDetails}) {
    return (
        <div></div>
    )
}