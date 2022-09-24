import React, { useState, useEffect } from "react";
import AdminService from "../services/admin.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { Link, useParams } from "react-router-dom";
import moment from "moment";

const SingleUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  
  useEffect(() => {
    if (id) {
      AdminService.get_user_by_id(id).then((response) => {
        setUser(response.data);
      });
    }
  }, []);

  useEffect(() => {
    if (user.accountNumber) {
      AdminService.get_transaction_history(user.accountNumber).then(
        (response) => {
          setTransactions(response.data);
          setAccountNumber(user.accountNumber);
        }
      );
    }
  }, [user]);

  const approve_deposit = (accountNumber, transactionId) => {
    AdminService.approve_deposit(accountNumber, transactionId).then(
      (response) => {
        setMessage(response.data);
        setSuccessful(true);
      },
      (error) => {
        const resMessage =

          (error.response && error.response.data && error.response.data) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  const approve_withdraw = (accountNumber, transactionId) => {
    AdminService.approve_withdraw(accountNumber, transactionId).then(
      (response) => {
        setMessage(response.data);
        setSuccessful(true);
      },
      (error) => {
        const resMessage =

          (error.response && error.response.data && error.response.data) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };



  return (
    <div className="container max-w-none mx-auto board-user">
      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-2 top-dashboard">
          <div className="col-span-4 user-info">
            <h2>
              {user.firstname} {user.lastname} - {user.email}{" "}
              <i className="fa-solid fa-circle-check"></i>
            </h2>
            <a href="#">Ver documentacion</a>
          </div>
          <div className="col-span-4"></div>
          <div className="col-span-4">
            <Link to={""} className="nav-link btn-add">
              Activar
            </Link>
            <Link to={""} className="nav-link btn-withdraw">
              Desactivar
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 board-grid">
          <div className="col-span-3 box shadow">
            <h2>
              <i className="fa-solid fa-wallet"></i> Net Worth
            </h2>
            <p>
              {user.accountBalance} <span>USD</span>
            </p>
          </div>
          <div className="col-span-3 box shadow">
            <h2>
              <i className="fa-solid fa-sack-dollar"></i> Staked
            </h2>
            <p>
              {user.stakedBalance} <span>USD</span>
            </p>
          </div>
          <div className="col-span-3 box shadow">
            <h2>
              <i className="fa-solid fa-piggy-bank"></i> Yield
            </h2>
            <p className="green">
              + 45,65 <span>USD</span>
            </p>
          </div>
          <div className="col-span-3 box shadow">
            <h2>
              <i className="fa-solid fa-chart-line"></i> APY
            </h2>
            <p>12%</p>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 board-secondary-grid">
          <div className="col-span-12 box history-box shadow">
            <h2>Actividad reciente</h2>
            <div className="grid grid-cols-12 top-border transaction">
              <div className="col-span-2">Actividad</div>
              <div className="col-span-2">Fecha</div>
              <div className="col-span-2">
                <span>Desde</span>
              </div>
              <div className="col-span-2">Estado</div>

              <div className="col-span-2">
                <span>Monto</span>
              </div>

              <div className="col-span-2">
                <span>Acciones</span>
              </div>
            </div>
            {}
            {transactions.reverse().map(
              (transaction) => (
                console.log(transaction.status),
                (
                  <div className="grid grid-cols-12 transaction">
                    <div className="col-span-2">
                      {transaction.transactionType}
                    </div>
                    <div className="col-span-2">
                      {moment(transaction.transactionTime)
                        .utc()
                        .format("DD/MM/YYYY")}
                    </div>
                    <div className="col-span-2">
                      <span>Banco</span>
                    </div>
                    <div className="col-span-2">
                      {transaction.status === true ? (
                        <span className="green">Aprobado</span>
                      ) : (
                        <span className="red">Pendiente</span>
                      )}
                    </div>

                    <div className="col-span-2">
                      <span>
                        {" "}
                        ${transaction.transactionAmount}
                        USD
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span>
                      {transaction.transactionType === "Deposit" ? (
                        <a href="#" onClick = {() => approve_deposit(accountNumber, transaction._id)}>Aprobar Deposito</a>
                        ) : (
                          <a href="#" onClick = {() => approve_withdraw(accountNumber, transaction._id)}>Aprobar Retiro</a>
                          )}
                      </span>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SingleUser;