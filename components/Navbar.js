import Link from 'next/link'

const Navbar = () => {
    return ( 
        <nav>
            <div className="logo">
                <h1>Cryptly</h1>
            </div>
        <Link href="/"><a>Home</a></Link>
        <Link href="/view-charts"><a>View Charts</a></Link>
        <Link href="/technical-analysis"><a>Technical Analysis</a></Link>
        </nav>
    );
}
 
export default Navbar;