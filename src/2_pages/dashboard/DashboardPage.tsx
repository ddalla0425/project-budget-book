import { Link } from "react-router-dom";


export const DashboardPage = () => {

    return (
        <>
            <h2>Dashboard</h2>
            <div><Link to={'/test'}>TEST</Link></div>
            <div><Link to={'/account'}>Account</Link></div>
            <div><Link to={'/mypage'}>Mypage</Link></div>
        </>
    );
}