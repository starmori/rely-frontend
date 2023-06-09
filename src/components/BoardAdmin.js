import React, { useState, useEffect } from "react";
import AdminService from "../services/admin.service";
import UserService from "../services/user.service";

const BoardAdmin = () => {
  const [users, setUsers] = useState([]);
  const [tvl, setTvl] = useState(0);
  const [stakers, setStakers] = useState(0);
  const [reward, setReward] = useState(0);

  function currencyFormat(num) {
    if (num) {
      return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
    else return Number(0).toFixed(2);
  }
  useEffect(() => {
    AdminService.get_users().then(async (response) => {
      const { data } = response;
      let newData = [];
      await new Promise((resolve) => {
        data.forEach(async (user) => {
          const balRes = await UserService.get_user_balance(user._id);
          const stakingRes = await UserService.get_user_staked_balance(user._id);
          newData.push({
            ...user,
            balance: balRes.data,
            reward: stakingRes.data.data.reward,
            amount: stakingRes.data.data.amount
          });
          if (newData.length === data.length) resolve(newData);
        });
      });
      setUsers(newData);
    });
    AdminService.get_tvl().then((response) => {
      setTvl(response.data);
    });
    AdminService.get_stakers().then((response) => {
      setStakers(response.data);
    });
    AdminService.get_stakers_yield().then((response) => {
      setReward(response.data);
    });
  }, []);

  return (
    <div className="container max-w-none mx-auto board-user">
      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-2 top-dashboard">
          <div className="col-span-4"></div>
          <div className="col-span-4"></div>
          {/* <div className="col-span-4">
        <Link to={"/add"} className="nav-link btn-add">
          Agregar fondos
        </Link>
        <Link to={"/withdraw"} className="nav-link btn-withdraw">
          Retirar fondos
        </Link>
        </div> */}
        </div>
        <div className="grid grid-cols-12 gap-2 board-grid">
          <div className="col-span-3 box shadow">
            <h2>
              <i className="fa-solid fa-sack-dollar"></i> TVL
            </h2>
            <p>
              {currencyFormat(tvl)} <span>ARS</span>
            </p>
          </div>
          <div className="col-span-3 box shadow">
            <h2>
              <i className="fa-solid fa-users"></i> Stakers
            </h2>
            <p>{stakers}</p>
          </div>
          <div className="col-span-3 box shadow">
            <h2>
              <i className="fa-solid fa-piggy-bank"></i> Stakers Yield
            </h2>
            <p className="green">
              + {currencyFormat(reward)} <span>USDT</span>
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
          <div className="col-span-12 box user-box shadow">
            <h2>Stakers</h2>
            <div className="grid grid-cols-12 top-border user-list">
              <div className="col-span-2">Nombre</div>
              <div className="col-span-2">Balance</div>
              <div className="col-span-2">Staked</div>
              <div className="col-span-2">Yield</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-2">
                <span>Acciones</span>
              </div>
            </div>
            {users.reverse().map((user) => (
              <div className="grid grid-cols-12 user-list" key={user._id}>
                <div className="col-span-2">
                  {user.firstname} {user.lastname}
                </div>
                <div className="col-span-2">
                  {currencyFormat(user.balance)}{" "}
                  <span className="bolder">ARS</span>
                </div>
                <div className="col-span-2">
                  {currencyFormat(user.amount)}{" "}
                  <span className="bolder">USDT</span>
                </div>
                <div className="col-span-2">
                  <span className="green">+{user.reward}</span>
                </div>
                <div className="col-span-2">
                  <span className="bolder">{user.status}</span>
                </div>
                <div className="col-span-2">
                  <a className="btn-view" href={"/user/" + user._id}>
                    <i className="fa-solid fa-eye"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default BoardAdmin;
