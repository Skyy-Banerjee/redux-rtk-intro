import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deposit, requestLoan, withdraw, payLoan } from './accountSlice';

function AccountOps() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [currency, setCurrency] = useState("USD");

  const dispatch = useDispatch();
  const { loan: currentLoan, loanPurpose: currentLoanPurpose, balance, isLoading } = useSelector(state => state.account);
  console.log(`loan: ${currentLoan}, loanPurpose: ${currentLoanPurpose}, balance: ${balance}`);


  function handleDeposit() {
    if (!depositAmount) alert("Enter an amount first!💸");
    dispatch(deposit(depositAmount, currency));
    setDepositAmount("");
    setCurrency("USD");
  }

  function handleWithdrawal() {
    if (!withdrawalAmount) {
      alert("Enter an amount first!💸");
      return;
    };
    if (withdrawalAmount > balance) {
      alert("You have insufficient funds 😥");
      return;
    }
    dispatch(withdraw(withdrawalAmount));
    setWithdrawalAmount("");
    alert(`Withdrawal Successful!`);
  }

  function handleRequestLoan() {
    if (!loanAmount || !loanPurpose) {
      alert("Enter an amount and a purpose first!💸");
      return;
    };
    dispatch(requestLoan(loanAmount, loanPurpose));
    setLoanAmount("");
    setLoanPurpose("");
    alert(`Congrats, loan sanctioned! 🎉`)
  }

  function handlePayLoan() {
    dispatch(payLoan());
    alert("Loan paid! ✅🎉")
  }

  return (
    <div>
      <h2>Your account operations:</h2>
      <div className="inputs">
        <div>
          <label>Deposit</label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(+e.target.value)}
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">US Dollar</option>
            <option value="EUR">Euro</option>
            <option value="GBP">British Pound</option>
          </select>

          <button onClick={handleDeposit} disabled={isLoading}>{isLoading ? 'Converting... ' : `Deposit ${depositAmount}`}</button>
        </div>

        <div>
          <label>Withdraw</label>
          <input
            type="number"
            value={withdrawalAmount}
            onChange={(e) => setWithdrawalAmount(+e.target.value)}
          />
          <button onClick={handleWithdrawal}>
            Withdraw {withdrawalAmount}
          </button>
        </div>

        <div>
          <label>Request loan</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(+e.target.value)}
            placeholder="Loan amount"
          />
          <input
            value={loanPurpose}
            onChange={(e) => setLoanPurpose(e.target.value)}
            placeholder="Loan purpose"
          />
          <button onClick={handleRequestLoan}>Request loan</button>
        </div>
        {currentLoan && (
          <div>
            <span>Pay back ${currentLoan} ({currentLoanPurpose})</span>
            <button onClick={handlePayLoan}>Pay loan</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default AccountOps;
