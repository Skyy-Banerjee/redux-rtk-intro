import CreateCustomer from "./features/customers/CreateCustomer";
import Customer from "./features/customers/Customer";
import AccountOps from './features/account/AccountOps'
import BalanceDisplay from "./features/account/BalanceDisplay";
import { useSelector } from "react-redux";

function App() {

  const fullName = useSelector(state => state.customer.fullName)
  return (
    <div>
      <h1>🏦 The React-Redux Bank ⚛️</h1>
      {fullName === "" ? (
        <CreateCustomer />
      ) : (
        <>
          <Customer />
          <AccountOps />
          <BalanceDisplay />
        </>
      )
      }
    </div>
  )
}

export default App;
