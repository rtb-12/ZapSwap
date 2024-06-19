import { React, useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "../App.css";
import  tokenList from "../tokenList.json";

const Swap = () => {
  const [tokenOneAmmount, setTokenOneAmmount] = useState(null);
  const [tokenTwoAmmount, setTokenTwoAmmount] = useState(null);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [slippage, setSlippage] = useState(2.5);
  const [isOpen, setIsOpen] = useState(false);
  const [changeTokens, setChangeTokens] = useState(1);
  function handleSlippage(e) {
    setSlippage(e.target.value);
  }
  function changeAmmount(e) {
    setTokenOneAmmount(e.target.value);
  }
  function switchTokens(){
    const one=tokenOne;
    const two=tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
  }
  function showTokens(asset){
    setChangeTokens(asset);
    setIsOpen(true);
  }
  const setting = (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex-col items-center font-semibold">
        <div>Slippage Tolerance</div>
        <Radio.Group onChange={handleSlippage} value={slippage}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
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
    <Modal
    title="Choose Token"
    open={isOpen}
    footer={null}
    onCancel={()=>setIsOpen(false)}
    >
        {tokenList.map((token,index)=>{
          return(
            <div className="m-3 flex items-center gap-3 px-3 py-3 border-2 rounded-md  hover:cursor-pointer hover:bg-gray-900" key={index} onClick={()=>{
              if(changeTokens===1){
                setTokenOne(token);
              }else{
                setTokenTwo(token);
              }
              setIsOpen(false);
            }}>
              <img src={token.img} alt="token" className="h-7"/>
              <div className="flex flex-col">
              <div className="font-bold font-lg">{token.ticker}</div>
              <div className="font-xs font-medium">{token.name}</div>
              </div>
            </div>
          )
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
          value={tokenOneAmmount}
          onChange={changeAmmount}
        ></Input>
        <Input placeholder="0" value={tokenTwoAmmount} disabled={true} />
        <div className="switchButton" onClick={switchTokens}>
          <ArrowDownOutlined />
        </div>
        <div className="assetOne" onClick={()=>showTokens(1)}>
          <img src={tokenOne.img} alt="assetOne" className="h-7" />
          {tokenOne.ticker}
          <DownOutlined/>
        </div>
        <div className="assetTwo" onClick={()=>showTokens(2)}>
          <img src={tokenTwo.img} alt="assetTwo"  className="h-7"/>
          {tokenTwo.ticker}
          <DownOutlined/>
        </div>
        <div className="swapButton">
          Swap
        </div>
      </div>
    </div>
    </>
    
  );
};

export default Swap;
