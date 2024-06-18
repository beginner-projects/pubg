import Link from 'next/link';
import Image from 'next/image';
import Wallet from '../Wallet/Wallet';

const Navbar = () => {
    return (
        <>
            <div className='flex justify-between items-center mr-4'>
                <Link href="/">
                <Image src="./rami.svg" alt='logo' width={130} height={130} />
                </Link>
                <Wallet />
            </div>
        </>
    )
}

export default Navbar;