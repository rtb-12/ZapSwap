import { React, useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "../App.css";
import tokenList from "../tokenList.json";
import axios from "axios";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";

const Swap = (props) => {
  const {address , isConnected } = props
  const [messageApi, contextHolder] = message.useMessage();
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [slippage, setSlippage] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const [changeTokens, setChangeTokens] = useState(1);
  const [txDetails, setTxDetails] = useState({
    to: null,
    data: null,
    value: null,
  });

  const { data, sendTransaction } = useSendTransaction({
    request: {
      from: address,
      to: String(txDetails.to),
      data: String(txDetails.data),
      value: String(txDetails.value),
    },
  });

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  async function fetchAllowance(tokenOne, address) {
  try {
    const response = await axios.get(`http://localhost:3000/fetchAllowance?tokenOne=${tokenOne.address}&address=${address}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchApproveTransaction(tokenOne) {
  try {
    const response = await axios.get(`http://localhost:3000/fetchApproveTransaction?tokenOne=${tokenOne.address}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchSwap(tokenOne, tokenTwo, tokenOneAmount, address, slippage) {
  try {
    const response = await axios.get(`http://localhost:3000/fetchSwap?tokenOne=${tokenOne.address}&tokenTwo=${tokenTwo.address}&tokenOneAmount=${tokenOneAmount}&address=${address}&slippage=${slippage}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

  async function fetchDexSwap() {
    const allowance = await fetchAllowance(tokenOne, address);
    // console.log(allowance);

    if (allowance === "0") {
      const approve = await fetchApproveTransaction(tokenOne);

      setTxDetails(approve.data);
      console.log("not approved");
      return;
    }

    const tx = await fetchSwap(tokenOne, tokenTwo, tokenOneAmount, address, slippage);
    console.log(tx)
    let decimals = Number(`1E${tokenTwo.decimals}`);
    setTokenTwoAmount((Number(tx.data.toTokenAmount) / decimals).toFixed(2));

    setTxDetails(tx.data.tx);
  }

  function handleSlippage(e) {
    setSlippage(e.target.value);
  }
  function changeAmmount(e) {
    setTokenOneAmount(e.target.value);
  }
  function switchTokens() {
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
  }
  function showTokens(asset) {
    setChangeTokens(asset);
    setIsOpen(true);
  }

  function getPrice() {
    axios
      .get(
        `http://localhost:3000/tokenPrice?addressOne=${tokenOne.address}&addressTwo=${tokenTwo.address}`
      )
      .then((response) => {
        console.log(response.data);
        setTokenTwoAmount(
          parseFloat((tokenOneAmount * response.data.ratio).toFixed(2))
        );
      })
      .catch((error) => {
        console.log(error);
        message.error("Error fetching data");
      });
  }

  useEffect(() => {
    if (tokenOneAmount) {
      getPrice();
    }
  }, [tokenOneAmount, tokenOne, tokenTwo]);

  useEffect(() => {
    if (txDetails.to && isConnected) {
      sendTransaction();
    }
  }, [txDetails]);

  useEffect(() => {
    messageApi.destroy();

    if (isLoading) {
      messageApi.open({
        type: "loading",
        content: "Transaction is Pending...",
        duration: 0,
      });
    }
  }, [isLoading]);

  useEffect(()=>{
    messageApi.destroy();
    if(isSuccess){
      messageApi.open({
        type: 'success',
        content: 'Transaction Successful',
        duration: 1.5,
      })
    }else if(txDetails.to){
      messageApi.open({
        type: 'error',
        content: 'Transaction Failed',
        duration: 1.50,
      })
    }


  },[isSuccess])


  const setting = (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex-col items-center font-semibold">
        <div>Slippage Tolerance</div>
        <Radio.Group onChange={handleSlippage} value={slippage}>
          <Radio.Button value={1}>1%</Radio.Button>
          <Radio.Button value={3}>3%</Radio.Button>
          <Radio.Button value={5}>5%</Radio.Button>
        </Radio.Group>
      </div>
      {/* <div className='flex justify-between items-center'>
        <div>Transaction Deadline</div>
        <div>20m</div>
      </div>
      <div className='flex justify-between items-center'>
        <div>Recipient</div>
        <div>Recipient</div>
      </div> */}
    </div>
  );
  return (
    <>
    {contextHolder}
      <Modal
        title="Choose Token"
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
      >
        {tokenList.map((token, index) => {
          return (
            <div
              className="m-3 flex items-center gap-3 px-3 py-3 border-2 rounded-md  hover:cursor-pointer hover:bg-gray-900"
              key={index}
              onClick={() => {
                if (changeTokens === 1) {
                  setTokenOne(token);
                } else {
                  setTokenTwo(token);
                }
                setIsOpen(false);
              }}
            >
              <img src={token.img} alt="token" className="h-7" />
              <div className="flex flex-col">
                <div className="font-bold font-lg">{token.ticker}</div>
                <div className="font-xs font-medium">{token.name}</div>
              </div>
            </div>
          );
        })}
      </Modal>
      <div className="tradeBox">
        <div className="flex justify-between items-center w-[98%] py-3 font-bold">
          Swap
          <Popover
            content={setting}
            title="Settings"
            trigger="click"
            placement="bottomRight"
          >
            <SettingOutlined className="text-[#5981F3] hover:cursor-pointer" />
          </Popover>
        </div>
        <div className="relative">
          <Input
            placeholder="0"
            value={tokenOneAmount}
            onChange={changeAmmount}
          ></Input>
          <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
          <div className="switchButton" onClick={switchTokens}>
            <ArrowDownOutlined />
          </div>
          <div className="assetOne" onClick={() => showTokens(1)}>
            <img src={tokenOne.img} alt="assetOne" className="h-7" />
            {tokenOne.ticker}
            <DownOutlined />
          </div>
          <div className="assetTwo" onClick={() => showTokens(2)}>
            <img src={tokenTwo.img} alt="assetTwo" className="h-7" />
            {tokenTwo.ticker}
            <DownOutlined />
          </div>
          <div className="swapButton" disabled={!tokenOneAmount || !isConnected} onClick={fetchDexSwap}>Swap</div>
        </div>
      </div>
    </>
  );
};

export default Swap;
