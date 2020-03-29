import React, { useState } from "react";
import "./styles.css";
import { FiLogIn } from "react-icons/fi";
import logoImg from "../../assets/logo.svg";
import heroesImg from "../../assets/heroes.png";
import { Link, useHistory } from "react-router-dom";
import api from "../services/api";

export default function Logon() {
  const [id, setId] = useState("");
  const history = useHistory();

  function handeLogin(e) {
    e.preventDefault();

    return api
      .post("/sessions", { id })
      .then(resp => {
        localStorage.setItem("ongId", id);
        localStorage.setItem("ongName", resp.data.name);
        history.push("/profile");
      })
      .catch(() => alert("Falha no login, tente novamente!"));
  }

  return (
    <div className="logon-container">
      <section className="form">
        <img src={logoImg} alt="Be The Hero" />

        <form onSubmit={handeLogin}>
          <h1>Faça seu logon</h1>
          <input
            placeholder="Sua ID"
            value={id}
            onChange={e => setId(e.target.value)}
          />
          <button className="button" type="submit">
            Entrar
          </button>

          <Link className="back-link" to="/register">
            <FiLogIn size={16} color={"#e02041"} />
            Não tenho cadastro!
          </Link>
        </form>
      </section>

      <img src={heroesImg} alt="Heroes" />
    </div>
  );
}
