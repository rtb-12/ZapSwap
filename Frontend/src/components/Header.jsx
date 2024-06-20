import { Link } from "react-router-dom"

const Header = (props) => {
    const {connect, address , isConnected } = props
    const handleClick = () => {
        console.log('Div clicked');
        if (connect) {
            connect();
        }
    }
    return (
        <div className='h-25 flex justify-between items-center pl-12 pr-12 py-3'>
            <div className='hidden sm:flex items-center gap-4'>
                <Link to="/">
                <div className='p-2.5 pl-3.5 pr-3.5 rounded font-medium transition-all duration-300 flex items-center hover:bg-[#222A3A] hover:cursor-pointer' >
                    Swap
                </div>
                </Link>
                <Link to="/tokens">
                <div className='p-2.5 pl-3.5 pr-3.5 rounded font-medium transition-all duration-300 flex items-center hover:bg-[#222A3A] hover:cursor-pointer'>
                    Tokens
                </div></Link>
                
            </div>
            <div className='flex items-center gap-4'>
                <div className='p-2.5 pl-3.5 pr-3.5 rounded font-medium transition-all duration-300 flex items-center hover:bg-[#222A3A] hover:cursor-pointer' >
                    Ethereum
                </div>
                <div className='bg-[#243056] p-2.5 pr-5 pl-5 rounded-full text-[#5981F3] font-bold transition-all duration-300 hover:cursor-pointer hover:text-[#3b4874]' onClick={handleClick}>
                    {isConnected ? (address.slice(0,4)+"..."+address.slice(38)) : 'Connect'}
                </div>
            </div>

        </div>
    )
}

export default Header